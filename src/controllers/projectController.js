const Project = require('../models/Project');
const DailyReport = require('../models/DailyReport');

// 1. Create Project
exports.createProject = async (req, res) => {
    if (!['owner', 'director', 'admin'].includes(req.user.role)) {
        return res.status(403).json({ msg: 'Akses Ditolak' });
    }

    try {
        const { nama, lokasi, budget, startDate, endDate, workItems, status } = req.body;

        const docs = {};
        if (req.files) {
            if (req.files.perencanaan?.[0]) docs.perencanaan = `/uploads/${req.files.perencanaan[0].filename}`;
            if (req.files.rab?.[0]) docs.rab = `/uploads/${req.files.rab[0].filename}`;
            if (req.files.gambarKerja?.[0]) docs.gambarKerja = `/uploads/${req.files.gambarKerja[0].filename}`;
            if (req.files.rencanaMaterial?.[0]) docs.rencanaMaterial = `/uploads/${req.files.rencanaMaterial[0].filename}`;
            if (req.files.rencanaAlat?.[0]) docs.rencanaAlat = `/uploads/${req.files.rencanaAlat[0].filename}`;
        }

        let parsedWorkItems = [];
        if (workItems) {
            try {
                parsedWorkItems = JSON.parse(workItems);
            } catch (e) { console.error("Parse error workItems", e); }
        }

        const project = await Project.create({
            nama,
            lokasi,
            budget: budget ? Number(budget) : 0,
            startDate: startDate || new Date(),
            endDate: endDate || new Date(new Date().setDate(new Date().getDate() + 30)),
            status: status || 'Planning',
            workItems: parsedWorkItems,
            documents: docs,
            createdBy: req.user.id
        });

        res.json(project);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: e.message });
    }
};

// 2. Get All Projects
exports.getProjects = async (req, res) => {
    try {
        const projects = await Project.find().sort({ createdAt: -1 });
        res.json(projects);
    } catch (e) { res.status(500).json({ error: e.message }); }
};

// 3. Get Single Project (Detail) -> FUNGSI INI YANG MUNGKIN HILANG SEBELUMNYA
exports.getProjectById = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) return res.status(404).json({ msg: 'Proyek tidak ditemukan' });
        res.json(project);
    } catch (e) { res.status(500).json({ error: e.message }); }
};

// 4. Update Progress
exports.updateProgress = async (req, res) => {
    try {
        const project = await Project.findByIdAndUpdate(
            req.params.id, 
            { progress: req.body.progress }, 
            { new: true }
        );
        res.json(project);
    } catch (e) { res.status(500).json({ error: e.message }); }
};

// 5. Delete Project
exports.deleteProject = async (req, res) => {
    if (!['owner', 'director', 'admin'].includes(req.user.role)) {
        return res.status(403).json({ msg: 'Hanya Owner/Direktur yang boleh menghapus.' });
    }
    try {
        const projectId = req.params.id;
        await DailyReport.deleteMany({ projectId });
        const project = await Project.findByIdAndDelete(projectId);
        if (!project) return res.status(404).json({ msg: 'Proyek tidak ditemukan' });
        res.json({ msg: 'Proyek berhasil dihapus.' });
    } catch (e) { res.status(500).json({ error: e.message }); }
};

// 6. Create Daily Update (with Auto Item Update)
exports.createDailyUpdate = async (req, res) => {
    try {
        const projectId = req.params.id;
        let updateData = {};
        if (req.body.data) {
            try { updateData = JSON.parse(req.body.data); } 
            catch (e) { return res.status(400).json({ msg: 'Format Data Salah' }); }
        }

        let fotoPath = null;
        if (req.file) fotoPath = `/uploads/${req.file.filename}`;

        const report = await DailyReport.create({
            projectId,
            date: updateData.date || new Date(),
            workProgress: updateData.workProgress,
            workforce: updateData.workforce,
            resources: updateData.resources,
            foto: fotoPath,
            reportedBy: req.user.id
        });

        // Update Project Items
        const project = await Project.findById(projectId);
        if (project) {
            if (req.body.progress) project.progress = req.body.progress;
            if (updateData.workProgress && Array.isArray(updateData.workProgress)) {
                updateData.workProgress.forEach(updateItem => {
                    const targetItem = project.workItems.find(i => i.id == updateItem.id);
                    if (targetItem) targetItem.progress = updateItem.currentProgress;
                });
            }
            project.markModified('workItems');
            await project.save();
        }
        res.json({ msg: 'Laporan tersimpan', data: report });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: e.message });
    }
};

// 7. Get S-Curve Data
exports.getSCurveData = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) return res.status(404).json({ msg: 'Project not found' });

        const reports = await DailyReport.find({ projectId: project._id }).sort({ date: 1 });
        const start = project.startDate ? new Date(project.startDate) : new Date(project.createdAt);
        const end = project.endDate ? new Date(project.endDate) : new Date(start.getTime() + (30 * 24 * 60 * 60 * 1000));
        
        let totalDuration = (end - start) / (1000 * 60 * 60 * 24);
        if (totalDuration <= 0) totalDuration = 1;

        let labels = ['Start'];
        let plannedData = [0];
        let actualData = [0];

        reports.forEach(rep => {
            const repDate = new Date(rep.date);
            labels.push(`${repDate.getDate()}/${repDate.getMonth() + 1}`);

            let dailyAvg = 0;
            if (rep.workProgress?.length > 0) {
                const total = rep.workProgress.reduce((acc, i) => acc + (Number(i.currentProgress) || 0), 0);
                dailyAvg = total / rep.workProgress.length;
            }
            actualData.push(Math.round(dailyAvg));

            const daysPassed = (repDate - start) / (1000 * 60 * 60 * 24);
            let planned = (daysPassed / totalDuration) * 100;
            planned = Math.min(Math.max(planned, 0), 100);
            plannedData.push(Math.round(planned));
        });

        if (labels.length === 1) { // Jika belum ada data
            labels.push('End');
            plannedData.push(100);
            actualData.push(0);
        }

        res.json({ labels, plannedData, actualData });
    } catch (e) { res.status(500).json({ error: e.message }); }
};
