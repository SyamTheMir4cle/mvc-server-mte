const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import Models
const User = require('./src/models/User');
const Project = require('./src/models/Project');
const Inventory = require('./src/models/Inventory');
const Request = require('./src/models/Request');
const Attendance = require('./src/models/Attendance');
const DailyReport = require('./src/models/DailyReport');
const ToolLog = require('./src/models/ToolLog');
const ToolRequest = require('./src/models/ToolRequest');
const ToolUsage = require('./src/models/ToolUsage');
const ProjectTool = require('./src/models/ProjectTool');

// Connect to MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mte-server');
        console.log('✓ Connected to MongoDB');
    } catch (error) {
        console.error('✗ Failed to connect to MongoDB:', error.message);
        process.exit(1);
    }
};

// Seed Data
const seedData = async () => {
    try {
        // Clear existing data
        console.log('\n📋 Clearing existing data...');
        await User.deleteMany({});
        await Project.deleteMany({});
        await Inventory.deleteMany({});
        await Request.deleteMany({});
        await Attendance.deleteMany({});
        await DailyReport.deleteMany({});
        await ToolLog.deleteMany({});
        await ToolRequest.deleteMany({});
        await ToolUsage.deleteMany({});
        await ProjectTool.deleteMany({});
        console.log('✓ Data cleared');

        // ========== CREATE USERS ==========
        console.log('\n👥 Creating Users...');
        const hashedPassword = await bcrypt.hash('password123', 10);
        
        const users = await User.insertMany([
            {
                username: 'owner1',
                email: 'owner@company.com',
                password: hashedPassword,
                fullName: 'Pemilik Perusahaan',
                role: 'owner',
                isVerified: true
            },
            {
                username: 'director1',
                email: 'director@company.com',
                password: hashedPassword,
                fullName: 'Direktur Proyek',
                role: 'director',
                assignedProject: 'Proyek Jalan Tol',
                isVerified: true
            },
            {
                username: 'asset_admin1',
                email: 'admin@company.com',
                password: hashedPassword,
                fullName: 'Admin Aset',
                role: 'asset_admin',
                isVerified: true
            },
            {
                username: 'supervisor1',
                email: 'supervisor@company.com',
                password: hashedPassword,
                fullName: 'Supervisor Lapangan',
                role: 'supervisor',
                assignedProject: 'Proyek Jalan Tol',
                isVerified: true
            },
            {
                username: 'worker1',
                email: 'worker1@company.com',
                password: hashedPassword,
                fullName: 'Budi Santoso',
                role: 'worker',
                assignedProject: 'Proyek Jalan Tol',
                isVerified: true
            },
            {
                username: 'worker2',
                email: 'worker2@company.com',
                password: hashedPassword,
                fullName: 'Siti Nurhaliza',
                role: 'worker',
                assignedProject: 'Pembangunan Gedung',
                isVerified: true
            },
            {
                username: 'worker3',
                email: 'worker3@company.com',
                password: hashedPassword,
                fullName: 'Ahmad Riyanto',
                role: 'worker',
                assignedProject: 'Proyek Jalan Tol',
                isVerified: true
            }
        ]);
        console.log(`✓ Created ${users.length} users`);

        // ========== CREATE PROJECTS ==========
        console.log('\n🏗️  Creating Projects...');
        const projects = await Project.insertMany([
            {
                nama: 'Proyek Jalan Tol',
                lokasi: 'Jakarta - Bandung',
                description: 'Pembangunan jalan tol sepanjang 250 km',
                status: 'In Progress',
                progress: 45,
                totalBudget: 5000000000,
                createdBy: users[0]._id,
                globalDates: {
                    planned: {
                        start: new Date('2024-01-01'),
                        end: new Date('2026-12-31')
                    },
                    actual: {
                        start: new Date('2024-01-15'),
                        end: null
                    }
                },
                startDate: new Date('2024-01-15'),
                endDate: new Date('2026-12-31'),
                supplies: [
                    {
                        id: 'S001',
                        item: 'Aspal Hotmix',
                        cost: 500000000,
                        staffAssigned: 'Budi Santoso',
                        deadline: '2024-06-30',
                        status: 'Completed',
                        actualPurchaseDate: new Date('2024-06-15'),
                        actualCost: 480000000
                    }
                ],
                workItems: [
                    {
                        id: 1,
                        name: 'Persiapan Lahan',
                        qty: 250,
                        volume: 'km',
                        cost: 250000000,
                        weight: 5,
                        logic: 'Inflexible'
                    },
                    {
                        id: 2,
                        name: 'Pembangunan Jalan',
                        qty: 250,
                        volume: 'km',
                        cost: 3500000000,
                        weight: 70,
                        logic: 'Semi-flexible'
                    },
                    {
                        id: 3,
                        name: 'Finishing & Marking',
                        qty: 250,
                        volume: 'km',
                        cost: 1250000000,
                        weight: 25,
                        logic: 'Flexible'
                    }
                ]
            },
            {
                nama: 'Pembangunan Gedung',
                lokasi: 'Surabaya',
                description: 'Pembangunan gedung perkantoran 10 lantai',
                status: 'Planning',
                progress: 15,
                totalBudget: 2000000000,
                createdBy: users[0]._id,
                globalDates: {
                    planned: {
                        start: new Date('2025-01-01'),
                        end: new Date('2026-12-31')
                    },
                    actual: {
                        start: null,
                        end: null
                    }
                },
                startDate: new Date('2025-01-01'),
                workItems: [
                    {
                        id: 1,
                        name: 'Fondasi',
                        qty: 1,
                        volume: 'unit',
                        cost: 400000000,
                        weight: 20,
                        logic: 'Inflexible'
                    },
                    {
                        id: 2,
                        name: 'Konstruksi Beton',
                        qty: 1,
                        volume: 'unit',
                        cost: 1200000000,
                        weight: 60,
                        logic: 'Semi-flexible'
                    },
                    {
                        id: 3,
                        name: 'Interior & Finishing',
                        qty: 1,
                        volume: 'unit',
                        cost: 400000000,
                        weight: 20,
                        logic: 'Flexible'
                    }
                ]
            }
        ]);
        console.log(`✓ Created ${projects.length} projects`);

        // ========== CREATE INVENTORY ==========
        console.log('\n📦 Creating Inventory...');
        const inventory = await Inventory.insertMany([
            {
                nama: 'Excavator CAT 320',
                kategori: 'alat',
                stok: 5,
                satuan: 'unit',
                kondisi: 'Bagus',
                lokasi: 'Gudang Utama'
            },
            {
                nama: 'Dump Truck',
                kategori: 'alat',
                stok: 12,
                satuan: 'unit',
                kondisi: 'Bagus',
                lokasi: 'Gudang Utama'
            },
            {
                nama: 'Roller Vibrator',
                kategori: 'alat',
                stok: 3,
                satuan: 'unit',
                kondisi: 'Bagus',
                lokasi: 'Gudang Utama'
            },
            {
                nama: 'Bor Beton',
                kategori: 'alat',
                stok: 15,
                satuan: 'unit',
                kondisi: 'Bagus',
                lokasi: 'Gudang Utama'
            },
            {
                nama: 'Aspal Hotmix',
                kategori: 'material',
                stok: 500,
                satuan: 'ton',
                kondisi: 'Bagus',
                lokasi: 'Gudang Utama'
            },
            {
                nama: 'Semen',
                kategori: 'material',
                stok: 1000,
                satuan: 'sak',
                kondisi: 'Bagus',
                lokasi: 'Gudang Utama'
            },
            {
                nama: 'Batu Split',
                kategori: 'material',
                stok: 2000,
                satuan: 'ton',
                kondisi: 'Bagus',
                lokasi: 'Gudang Utama'
            },
            {
                nama: 'Pasir Beton',
                kategori: 'material',
                stok: 1500,
                satuan: 'ton',
                kondisi: 'Bagus',
                lokasi: 'Gudang Utama'
            },
            {
                nama: 'Besi Tulangan',
                kategori: 'material',
                stok: 800,
                satuan: 'ton',
                kondisi: 'Bagus',
                lokasi: 'Gudang Utama'
            },
            {
                nama: 'Bensin',
                kategori: 'material',
                stok: 5000,
                satuan: 'liter',
                kondisi: 'Bagus',
                lokasi: 'Gudang Utama'
            }
        ]);
        console.log(`✓ Created ${inventory.length} inventory items`);

        // ========== CREATE REQUESTS ==========
        console.log('\n📝 Creating Requests...');
        const requests = await Request.insertMany([
            {
                jenis: 'material',
                userId: users[4]._id,
                projectId: projects[0]._id,
                item: 'Aspal Hotmix',
                qty: '100 ton',
                dateNeeded: '2024-08-15',
                costEstimate: 50000000,
                detail: 'Untuk finishing jalan KM 50-75',
                purpose: 'Pembangunan perkerasan jalan',
                status: 'approved',
                approvedBy: users[1]._id,
                tanggal: new Date('2024-08-10')
            },
            {
                jenis: 'kasbon',
                userId: users[4]._id,
                projectId: projects[0]._id,
                jumlah: 5000000,
                detail: 'Keperluan perjalanan dinas ke lokasi proyek',
                status: 'approved',
                approvedBy: users[1]._id,
                tanggal: new Date('2024-08-12')
            },
            {
                jenis: 'material',
                userId: users[5]._id,
                projectId: projects[1]._id,
                item: 'Besi Tulangan',
                qty: '50 ton',
                dateNeeded: '2025-06-01',
                costEstimate: 200000000,
                detail: 'Untuk konstruksi lantai 3-5',
                purpose: 'Struktur bangunan',
                status: 'pending',
                tanggal: new Date('2024-08-14')
            },
            {
                jenis: 'material',
                userId: users[6]._id,
                projectId: projects[0]._id,
                item: 'Semen',
                qty: '200 sak',
                dateNeeded: '2024-09-01',
                costEstimate: 20000000,
                detail: 'Untuk pekerjaan fondasi',
                purpose: 'Pembuatan fondasi jalan',
                status: 'rejected',
                approvedBy: users[1]._id,
                tanggal: new Date('2024-08-13')
            }
        ]);
        console.log(`✓ Created ${requests.length} requests`);

        // ========== CREATE PROJECT TOOLS ==========
        console.log('\n🛠️  Creating Project Tools...');
        const projectTools = await ProjectTool.insertMany([
            {
                projectId: projects[0]._id,
                toolId: inventory[0]._id,
                quantity: 2,
                notes: 'Untuk pekerjaan penggalian',
                status: 'Active',
                assignedBy: users[2]._id,
                assignedDate: new Date('2024-07-01')
            },
            {
                projectId: projects[0]._id,
                toolId: inventory[1]._id,
                quantity: 5,
                notes: 'Untuk transport material',
                status: 'Active',
                assignedBy: users[2]._id,
                assignedDate: new Date('2024-07-05')
            },
            {
                projectId: projects[0]._id,
                toolId: inventory[2]._id,
                quantity: 1,
                notes: 'Untuk pemadatan lapisan jalan',
                status: 'Active',
                assignedBy: users[2]._id,
                assignedDate: new Date('2024-07-10')
            },
            {
                projectId: projects[1]._id,
                toolId: inventory[3]._id,
                quantity: 3,
                notes: 'Untuk pekerjaan bor beton',
                status: 'Active',
                assignedBy: users[2]._id,
                assignedDate: new Date('2025-01-01')
            }
        ]);
        console.log(`✓ Created ${projectTools.length} project tools`);

        // ========== CREATE TOOL REQUESTS ==========
        console.log('\n🔧 Creating Tool Requests...');
        const toolRequests = await ToolRequest.insertMany([
            {
                toolId: inventory[0]._id,
                requesterId: users[4]._id,
                projectId: projects[0]._id,
                status: 'approved',
                requestDate: new Date('2024-08-01'),
                approvedBy: users[2]._id,
                approvalDate: new Date('2024-08-02')
            },
            {
                toolId: inventory[1]._id,
                requesterId: users[4]._id,
                projectId: projects[0]._id,
                status: 'approved',
                requestDate: new Date('2024-08-05'),
                approvedBy: users[2]._id,
                approvalDate: new Date('2024-08-06')
            },
            {
                toolId: inventory[3]._id,
                requesterId: users[5]._id,
                projectId: projects[1]._id,
                status: 'pending',
                requestDate: new Date('2024-08-15')
            }
        ]);
        console.log(`✓ Created ${toolRequests.length} tool requests`);

        // ========== CREATE TOOL LOGS ==========
        console.log('\n📋 Creating Tool Logs...');
        const toolLogs = await ToolLog.insertMany([
            {
                toolId: inventory[0]._id,
                userId: users[4]._id,
                action: 'borrow',
                kondisi: 'Bagus',
                tanggal: new Date('2024-08-01'),
                lokasiProject: 'Jakarta - Bandung'
            },
            {
                toolId: inventory[0]._id,
                userId: users[4]._id,
                action: 'return',
                kondisi: 'Bagus',
                tanggal: new Date('2024-08-15'),
                lokasiProject: 'Jakarta - Bandung'
            },
            {
                toolId: inventory[1]._id,
                userId: users[6]._id,
                action: 'borrow',
                kondisi: 'Bagus',
                tanggal: new Date('2024-08-05'),
                lokasiProject: 'Jakarta - Bandung'
            },
            {
                toolId: inventory[2]._id,
                userId: users[4]._id,
                action: 'borrow',
                kondisi: 'Bagus',
                tanggal: new Date('2024-07-20'),
                lokasiProject: 'Jakarta - Bandung'
            }
        ]);
        console.log(`✓ Created ${toolLogs.length} tool logs`);

        // ========== CREATE ATTENDANCE ==========
        console.log('\n✅ Creating Attendance Records...');
        const attendance = await Attendance.insertMany([
            {
                userId: users[4]._id,
                jamMasuk: '07:30',
                foto: '/uploads/attendance/budi_20240815.jpg',
                projectId: projects[0]._id,
                wageMultiplier: 1.0,
                tanggal: new Date('2024-08-15')
            },
            {
                userId: users[4]._id,
                jamMasuk: '07:45',
                foto: '/uploads/attendance/budi_20240816.jpg',
                projectId: projects[0]._id,
                wageMultiplier: 1.0,
                tanggal: new Date('2024-08-16')
            },
            {
                userId: users[5]._id,
                jamMasuk: '08:00',
                foto: '/uploads/attendance/siti_20240815.jpg',
                projectId: projects[1]._id,
                wageMultiplier: 0.5,
                tanggal: new Date('2024-08-15')
            },
            {
                userId: users[6]._id,
                jamMasuk: '07:20',
                foto: '/uploads/attendance/ahmad_20240816.jpg',
                projectId: projects[0]._id,
                wageMultiplier: 1.0,
                tanggal: new Date('2024-08-16')
            }
        ]);
        console.log(`✓ Created ${attendance.length} attendance records`);

        // ========== CREATE DAILY REPORTS ==========
        console.log('\n📊 Creating Daily Reports...');
        const dailyReports = await DailyReport.insertMany([
            {
                projectId: projects[0]._id,
                date: new Date('2024-08-15'),
                weather: 'Cerah',
                toolboxMeeting: 'Safety briefing dilakukan, kondisi aman',
                workProgress: [
                    {
                        id: 1,
                        name: 'Persiapan Lahan',
                        currentProgress: 100,
                        actualCostToday: 25000000,
                        notes: 'Selesai'
                    },
                    {
                        id: 2,
                        name: 'Pembangunan Jalan',
                        currentProgress: 45,
                        actualCostToday: 50000000,
                        notes: 'Pekerjaan jalan KM 50-75 berlangsung'
                    }
                ],
                workforce: [
                    { role: 'Supervisor', count: 1 },
                    { role: 'Worker', count: 8 }
                ],
                resources: [
                    { item: 'Aspal Hotmix', qty: 100, unit: 'ton' },
                    { item: 'Dump Truck', qty: 5, unit: 'unit' }
                ]
            },
            {
                projectId: projects[0]._id,
                date: new Date('2024-08-16'),
                weather: 'Berawan',
                toolboxMeeting: 'Diskusi tentang jadwal minggu depan',
                workProgress: [
                    {
                        id: 2,
                        name: 'Pembangunan Jalan',
                        currentProgress: 48,
                        actualCostToday: 45000000,
                        notes: 'Dilanjutkan pekerjaan asphalt'
                    },
                    {
                        id: 3,
                        name: 'Finishing & Marking',
                        currentProgress: 5,
                        actualCostToday: 10000000,
                        notes: 'Mulai marking jalan yang sudah selesai'
                    }
                ],
                workforce: [
                    { role: 'Supervisor', count: 1 },
                    { role: 'Worker', count: 9 }
                ],
                resources: [
                    { item: 'Aspal Hotmix', qty: 90, unit: 'ton' },
                    { item: 'Dump Truck', qty: 5, unit: 'unit' },
                    { item: 'Roller Vibrator', qty: 1, unit: 'unit' }
                ]
            }
        ]);
        console.log(`✓ Created ${dailyReports.length} daily reports`);

        // ========== CREATE TOOL USAGE ==========
        console.log('\n🏭 Creating Tool Usage Records...');
        const toolUsage = await ToolUsage.insertMany([
            {
                projectToolId: projectTools[0]._id,
                projectId: projects[0]._id,
                usedByWorker: 'Budi Santoso',
                workItem: 'Penggalian tanah KM 50-60',
                taggedBy: users[2]._id,
                date: new Date('2024-08-15'),
                notes: 'Excavator digunakan untuk penggalian'
            },
            {
                projectToolId: projectTools[1]._id,
                projectId: projects[0]._id,
                usedByWorker: 'Ahmad Riyanto',
                workItem: 'Transport material aspal',
                taggedBy: users[2]._id,
                date: new Date('2024-08-15'),
                notes: 'Dump truck untuk transport aspal hotmix'
            },
            {
                projectToolId: projectTools[2]._id,
                projectId: projects[0]._id,
                usedByWorker: 'Budi Santoso',
                workItem: 'Pemadatan jalan KM 50-75',
                taggedBy: users[2]._id,
                date: new Date('2024-08-16'),
                notes: 'Roller untuk pemadatan lapisan aspal'
            }
        ]);
        console.log(`✓ Created ${toolUsage.length} tool usage records`);

        console.log('\n✨ ========== SEED DATA COMPLETE ==========');
        console.log(`
📊 Summary:
   👥 Users: ${users.length}
   🏗️  Projects: ${projects.length}
   📦 Inventory Items: ${inventory.length}
   📝 Requests: ${requests.length}
   🛠️  Project Tools: ${projectTools.length}
   🔧 Tool Requests: ${toolRequests.length}
   📋 Tool Logs: ${toolLogs.length}
   ✅ Attendance: ${attendance.length}
   📊 Daily Reports: ${dailyReports.length}
   🏭 Tool Usage: ${toolUsage.length}

🔐 Test Credentials:
   Owner: owner1 / password123
   Director: director1 / password123
   Asset Admin: asset_admin1 / password123
   Supervisor: supervisor1 / password123
   Worker: worker1 / password123
        `);
        
    } catch (error) {
        console.error('✗ Error seeding data:', error.message);
        process.exit(1);
    } finally {
        await mongoose.connection.close();
        console.log('✓ MongoDB connection closed');
        process.exit(0);
    }
};

// Run seed
connectDB().then(seedData);
