import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertCarSchema } from "@shared/schema";
import QRCode from "qrcode";
import ExcelJS from "exceljs";

export async function registerRoutes(app: Express): Promise<Server> {
  app.post("/api/cars", async (req, res) => {
    try {
      const validatedData = insertCarSchema.parse(req.body);
      
      const existingCar = await storage.getCarByPlateNumber(validatedData.plateNumber);
      if (existingCar) {
        return res.status(400).json({ error: "Car with this plate number already exists" });
      }

      const qrValue = `CAR-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const qrCodeData = await QRCode.toDataURL(qrValue);

      const car = await storage.createCar({
        ...validatedData,
        qrValue,
        qrCode: qrCodeData,
      });

      res.json({ car, qrCode: qrCodeData });
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Invalid request" });
    }
  });

  app.post("/api/scan", async (req, res) => {
    try {
      const { qrCode } = req.body;
      
      if (!qrCode) {
        return res.status(400).json({ error: "QR code is required" });
      }

      const car = await storage.getCarByQRValue(qrCode);
      
      if (!car) {
        return res.status(404).json({ error: "Car not found" });
      }

      const activeVisit = await storage.getActiveVisitByCarId(car.id);

      if (activeVisit) {
        const checkOutTime = new Date();
        const duration = Math.floor((checkOutTime.getTime() - activeVisit.checkInTime.getTime()) / 60000);
        const fee = 20;

        await storage.updateVisit(activeVisit.id, {
          checkOutTime,
          duration,
          fee,
          isCheckedIn: false,
        });

        return res.json({
          message: `🚗 Car checked out — Fee: ${fee} EGP`,
          type: "checkout",
          fee,
        });
      } else {
        const newVisit = await storage.createVisit({
          carId: car.id,
          plateNumber: car.plateNumber,
          ownerName: car.ownerName,
          checkInTime: new Date(),
          checkOutTime: null,
          duration: null,
          fee: null,
          isCheckedIn: true,
        });

        return res.json({
          message: "✅ Car checked in successfully!",
          type: "checkin",
          visit: newVisit,
        });
      }
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Server error" });
    }
  });

  app.get("/api/visits", async (req, res) => {
    try {
      const visits = await storage.getAllVisits();
      res.json(visits);
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Server error" });
    }
  });

  app.get("/api/visits/export", async (req, res) => {
    try {
      const visits = await storage.getAllVisits();

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Visits");

      worksheet.columns = [
        { header: "Plate Number", key: "plateNumber", width: 15 },
        { header: "Owner Name", key: "ownerName", width: 20 },
        { header: "Check In Time", key: "checkInTime", width: 20 },
        { header: "Check Out Time", key: "checkOutTime", width: 20 },
        { header: "Duration (minutes)", key: "duration", width: 18 },
        { header: "Fee (EGP)", key: "fee", width: 12 },
        { header: "Status", key: "status", width: 12 },
      ];

      visits.forEach((visit) => {
        worksheet.addRow({
          plateNumber: visit.plateNumber,
          ownerName: visit.ownerName,
          checkInTime: visit.checkInTime.toLocaleString(),
          checkOutTime: visit.checkOutTime ? visit.checkOutTime.toLocaleString() : "-",
          duration: visit.duration || "-",
          fee: visit.fee || "-",
          status: visit.isCheckedIn ? "Checked In" : "Checked Out",
        });
      });

      worksheet.getRow(1).font = { bold: true };

      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=parking-visits-${Date.now()}.xlsx`
      );

      await workbook.xlsx.write(res);
      res.end();
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Export failed" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
