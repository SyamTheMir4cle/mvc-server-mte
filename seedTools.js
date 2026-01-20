require('dotenv').config();
const mongoose = require('mongoose');

// Import Models
const Inventory = require('./src/models/Inventory');
const ProjectTool = require('./src/models/ProjectTool');
const ToolUsage = require('./src/models/ToolUsage');
const Project = require('./src/models/Project');
const User = require('./src/models/User');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mterp_db');
        console.log('✅ Database Terhubung');
    } catch (err) {
        console.error('❌ Gagal Koneksi:', err);
        process.exit(1);
    }
};

const seedData = async () => {
    await connectDB();

    try {
        console.log('🧹 Membersihkan Data Inventory Lama...');
        await Inventory.deleteMany({});
        await ProjectTool.deleteMany({});
        await ToolUsage.deleteMany({});

        // 1. Ambil Data Penunjang (User Admin & Project)
        const admin = await User.findOne({ role: { $in: ['asset_admin', 'owner', 'director'] } });
        if (!admin) {
            console.log('⚠️ Tidak ditemukan User dengan role admin/asset_admin. Silakan register/seed user dulu.');
            process.exit();
        }

        const project = await Project.findOne();
        if (!project) {
            console.log('⚠️ Tidak ditemukan Project apapun. Silakan buat project dulu via API/App.');
            process.exit();
        }

        console.log(`👤 Menggunakan Admin: ${admin.username}`);
        console.log(`🏗️ Menggunakan Project: ${project.nama}`);

        // 2. Buat Master Inventory (Gudang Utama)
        console.log('📦 Membuat Master Inventory...');
        const inventoryData = [
            { nama: 'Bor Listrik Bosch', kategori: 'alat', stok: 10, satuan: 'Unit', kondisi: 'Bagus', lokasi: 'Gudang Utama' },
            { nama: 'Gerinda Tangan Maktec', kategori: 'alat', stok: 15, satuan: 'Unit', kondisi: 'Bagus', lokasi: 'Gudang Utama' },
            { nama: 'Genset 5000 Watt', kategori: 'alat', stok: 3, satuan: 'Unit', kondisi: 'Bagus', lokasi: 'Gudang Utama' },
            { nama: 'Semen Tiga Roda', kategori: 'material', stok: 100, satuan: 'Sak', kondisi: 'Baru', lokasi: 'Gudang Utama' },
            { nama: 'Cat Tembok Dulux Putih', kategori: 'material', stok: 50, satuan: 'Pail', kondisi: 'Baru', lokasi: 'Gudang Utama' },
            { nama: 'Palu Godam', kategori: 'alat', stok: 5, satuan: 'Unit', kondisi: 'Bekas', lokasi: 'Gudang Utama' }
        ];

        const createdInventory = await Inventory.insertMany(inventoryData);
        console.log(`✅ Berhasil membuat ${createdInventory.length} item di Gudang.`);

        // 3. Assign Alat ke Project (Simulasi Pengiriman ke Lapangan)
        console.log('🚚 Mengirim Alat ke Project...');
        
        // Ambil item yang baru dibuat
        const bor = createdInventory.find(i => i.nama === 'Bor Listrik Bosch');
        const gerinda = createdInventory.find(i => i.nama === 'Gerinda Tangan Maktec');

        // Kurangi stok gudang (Manual update for seeding logic)
        bor.stok -= 2; await bor.save();
        gerinda.stok -= 3; await gerinda.save();

        const projectToolsData = [
            {
                projectId: project._id,
                toolId: bor._id,
                quantity: 2,
                notes: 'Kondisi prima, baru beli tahun lalu',
                assignedBy: admin._id,
                status: 'Active'
            },
            {
                projectId: project._id,
                toolId: gerinda._id,
                quantity: 3,
                notes: 'Satu unit tombol on/off agak keras',
                assignedBy: admin._id,
                status: 'Active'
            }
        ];

        const createdProjectTools = await ProjectTool.insertMany(projectToolsData);
        console.log(`✅ Berhasil mengirim ${createdProjectTools.length} jenis alat ke Project ${project.nama}.`);

        // 4. Tagging Usage (Simulasi Pemakaian Harian)
        console.log('🏷️ Mencatat Log Pemakaian Harian...');

        const pToolBor = createdProjectTools.find(pt => pt.toolId.toString() === bor._id.toString());

        const usageData = [
            {
                projectToolId: pToolBor._id,
                projectId: project._id,
                usedByWorker: 'Budi (Tukang Kayu)',
                workItem: 'Pemasangan Pintu Utama',
                taggedBy: admin._id,
                notes: 'Dipakai seharian di lantai 1'
            },
            {
                projectToolId: pToolBor._id,
                projectId: project._id,
                usedByWorker: 'Asep (Kenek)',
                workItem: 'Bongkar Palet Kayu',
                taggedBy: admin._id,
                notes: 'Hanya dipakai 2 jam pagi hari'
            }
        ];

        await ToolUsage.insertMany(usageData);
        console.log(`✅ Berhasil mencatat 2 log pemakaian.`);

        console.log('====================================');
        console.log('🎉 SEEDING SELESAI! Database siap digunakan.');
        console.log('====================================');

        process.exit();

    } catch (err) {
        console.error('❌ Terjadi Error saat Seeding:', err);
        process.exit(1);
    }
};

seedData();
