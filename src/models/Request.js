const mongoose = require('mongoose');
const requestSchema = new mongoose.Schema({
    jenis: { type: String, enum: ['material', 'kasbon'] },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    detail: String,
    jumlah: Number,
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    tanggal: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Request', requestSchema);
