const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    // --- Informasi Utama ---
    nama: { type: String, required: true },
    lokasi: { type: String, required: true },
    status: { type: String, default: 'Planning' }, 
    progress: { type: Number, default: 0 }, // Progress Total Proyek
    budget: Number,
    startDate: Date,
    endDate: Date,
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    
    // --- Item Pekerjaan (Detail) ---
    workItems: [{ 
        id: Number, 
        name: String, 
        target: String,
        progress: { type: Number, default: 0 }, // Progress per Item
        startDate: Date, // Jadwal Mulai Item
        endDate: Date    // Jadwal Selesai Item
    }],
    
    // --- Dokumen ---
    documents: {
        perencanaan: String,
        rab: String,
        gambarKerja: String,
        rencanaMaterial: String,
        rencanaAlat: String
    }
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);
