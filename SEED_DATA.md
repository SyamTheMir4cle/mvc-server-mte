# Seed Data Documentation

## Overview
The `seedData.js` script generates comprehensive dump/test data for the MTE Server application. It populates all MongoDB collections with realistic sample data for development and testing purposes.

## Generated Data

### Users (7 users)
- 1 Owner
- 1 Director
- 1 Asset Admin
- 1 Supervisor
- 3 Workers

All users have password: `password123`

### Projects (2 projects)
1. **Proyek Jalan Tol** - Road construction project in Jakarta-Bandung (In Progress, 45% complete)
2. **Pembangunan Gedung** - 10-story office building in Surabaya (Planning, 15% complete)

### Inventory (10 items)
- **Equipment (Alat)**: Excavator, Dump Truck, Roller, Drill
- **Materials**: Asphalt, Cement, Gravel, Sand, Reinforcement Steel, Gasoline

### Requests (4 requests)
- 2 Approved material requests
- 1 Pending material request
- 1 Rejected material request + kasbon requests

### Project Tools (4 allocations)
Tools assigned to projects with specific quantities and status

### Tool Requests (3 requests)
- 2 Approved tool requests
- 1 Pending tool request

### Tool Logs (4 logs)
Borrow/return history for tools

### Attendance (4 records)
Worker attendance records with timestamps and wage multipliers

### Daily Reports (2 reports)
Daily project progress reports with weather, workforce, and resources data

### Tool Usage (3 records)
Detailed tool usage tracking by workers

## Usage

### Running the Seed Script

```bash
# Using Node directly
node scripts/seedData.js

# Or add to package.json scripts section
npm run seed
```

### Add to package.json

Add this to your `package.json` in the `scripts` section:

```json
{
  "scripts": {
    "seed": "node scripts/seedData.js",
    "dev": "nodemon server.js"
  }
}
```

## Requirements

- MongoDB must be running
- Environment variables configured (MONGODB_URI)
- All models must be properly exported

## Test Credentials

Use these accounts to test the application:

| Username | Role | Password |
|----------|------|----------|
| owner1 | Owner | password123 |
| director1 | Director | password123 |
| asset_admin1 | Asset Admin | password123 |
| supervisor1 | Supervisor | password123 |
| worker1 | Worker | password123 |
| worker2 | Worker | password123 |
| worker3 | Worker | password123 |

## Notes

- The script will **clear all existing data** before inserting new data
- All ObjectIds are properly linked between collections
- Dates are realistic and relative to the current date
- The script connects and closes the MongoDB connection automatically
- Passwords are hashed with bcryptjs before storage

## Sample Data Relationships

```
Projects
├── Work Items
├── Supplies
└── Assigned Users

Inventory
├── Project Tools
├── Tool Requests
├── Tool Logs
└── Tool Usage

Users
├── Requests
├── Attendance
├── Tool Requests
└── Tool Logs
```
