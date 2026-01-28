const Request = require('../models/Request');

// 1. Buat Request Baru
exports.createRequest = async (req, res) => {
    try {
        const newReq = await Request.create({
            ...req.body,
            userId: req.user.id
        });
        res.json(newReq);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

// 2. Get Requests (All / Filtered)
exports.getRequests = async (req, res) => {
    try {
        const { status } = req.query;
        let query = {};
        if (status) query.status = status;

        const requests = await Request.find(query)
            .populate('userId', 'fullName role')
            .populate('projectId', 'nama')
            .sort({ createdAt: -1 });
            
        res.json(requests);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

// 3. Approval Request (Khusus Direktur/Owner)
exports.approveRequest = async (req, res) => {
    if (!['director', 'owner'].includes(req.user.role)) {
        return res.status(403).json({ msg: 'Hanya Direktur yang boleh approve' });
    }
    try {
        const updatedReq = await Request.findByIdAndUpdate(
            req.params.id,
            { status: req.body.status, approvedBy: req.user.id },
            { new: true }
        );
        res.json(updatedReq);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};