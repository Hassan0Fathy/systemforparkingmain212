# Smart Parking System

A modern web application for managing parking operations using QR code technology.

## Overview

This Smart Parking System allows parking lot operators to register vehicles, generate unique QR codes, and track parking sessions with automatic fee calculation.

## Features

### 1. Car Registration
- Register vehicles with plate number and owner name
- Automatically generates a unique QR code for each vehicle
- QR code contains a unique identifier (e.g., "CAR-1731099234567-xy3abc")
- Download QR codes for printing or digital display

### 2. QR Code Scanning
- Use device camera to scan vehicle QR codes
- Automatic check-in/check-out detection
- Check-in: Creates new parking session
- Check-out: Calculates duration and applies 20 EGP fee
- Real-time toast notifications for scan results

### 3. Visits Management
- View complete parking history
- Display plate number, owner, entry/exit times, duration, and fees
- Real-time status indicators (Checked In / Checked Out)
- Refresh data on demand
- Export visits to Excel for reporting

## Technical Architecture

### Frontend
- **Framework**: React with TypeScript
- **Routing**: Wouter
- **State Management**: TanStack Query
- **UI Components**: Shadcn UI with Tailwind CSS
- **QR Scanning**: html5-qrcode library
- **Notifications**: react-hot-toast

### Backend
- **Framework**: Express.js with TypeScript
- **QR Generation**: qrcode library
- **Excel Export**: ExcelJS
- **Storage**: In-memory (MemStorage)

### Data Model

#### Cars
\`\`\`typescript
{
  id: string;              // UUID
  plateNumber: string;     // Unique vehicle identifier
  ownerName: string;       // Vehicle owner name
  qrValue: string;         // Unique QR code value (e.g., "CAR-123456789-abc")
  qrCode: string;          // Base64 encoded QR code image
}
\`\`\`

#### Visits
\`\`\`typescript
{
  id: string;              // UUID
  carId: string;           // Reference to car
  plateNumber: string;     // Vehicle plate
  ownerName: string;       // Owner name
  checkInTime: Date;       // Entry timestamp
  checkOutTime: Date | null; // Exit timestamp
  duration: number | null; // Minutes parked
  fee: number | null;      // Parking fee in EGP
  isCheckedIn: boolean;    // Current status
}
\`\`\`

## API Endpoints

### POST /api/cars
Register a new vehicle
\`\`\`json
Request: { "plateNumber": "ABC-1234", "ownerName": "John Doe" }
Response: { "car": {...}, "qrCode": "data:image/png;base64,..." }
\`\`\`

### POST /api/scan
Scan QR code for check-in/check-out
\`\`\`json
Request: { "qrCode": "CAR-1731099234567-xy3abc" }
Response: { "message": "✅ Car checked in!", "type": "checkin" }
\`\`\`

### GET /api/visits
Retrieve all parking visits
\`\`\`json
Response: [{ "id": "...", "plateNumber": "ABC-1234", ... }]
\`\`\`

### GET /api/visits/export
Download Excel file with all visits

## Pages

- **/** - Home page with navigation cards
- **/register** - Car registration form
- **/scan** - QR code scanner (requires camera permissions)
- **/visits** - Visits log and Excel export

## Recent Changes

### 2025-11-08
- Implemented complete Smart Parking System
- Added real QR code generation with unique identifiers for each car
- Fixed QR code lookup to use decoded values instead of base64 images
- Integrated html5-qrcode for camera-based scanning
- Added Excel export functionality for visits
- Implemented automatic fee calculation (20 EGP per visit)
- Created responsive UI with toast notifications
- Added comprehensive error handling

## User Preferences

None specified yet.

## Project Status

✅ Fully functional parking management system
✅ Real QR code generation and scanning
✅ Visit tracking with fee calculation
✅ Excel export capability
✅ Responsive design for mobile and desktop

## Known Limitations

1. **Storage**: Uses in-memory storage - data resets on server restart. For production, migrate to PostgreSQL.
2. **Camera Access**: QR scanning requires browser camera permissions and HTTPS in production.
3. **Fee Structure**: Currently fixed at 20 EGP per visit. Consider implementing duration-based pricing.

## Future Enhancements

- Database persistence (PostgreSQL)
- User authentication for attendants/administrators
- Dynamic pricing based on vehicle type and duration
- Real-time parking occupancy dashboard
- Payment integration
- SMS/email notifications
- Mobile app version
