const mongoose = require('mongoose');

const dailyReportSchema = new mongoose.Schema({
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
    date: { type: Date, default: Date.now },
    
    // Data Progress Item
    workProgress: [{
        id: Number,
        name: String,
        target: String,
        currentProgress: Number,
        todayUpdate: String
    }],
    
    // Data Tenaga Kerja
    workforce: [{
        role: String,
        count: String
    }],
    
    // Material & Alat
    resources: String,
    
    // Foto
    foto: String,
    
    reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('DailyReport', dailyReportSchema);
