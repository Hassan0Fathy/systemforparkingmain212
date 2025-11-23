import { type Car, type InsertCar, type Visit, type InsertVisit } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  createCar(car: InsertCar & { qrValue: string; qrCode: string }): Promise<Car>;
  getCarByPlateNumber(plateNumber: string): Promise<Car | undefined>;
  getCarById(id: string): Promise<Car | undefined>;
  getCarByQRValue(qrValue: string): Promise<Car | undefined>;
  
  createVisit(visit: InsertVisit): Promise<Visit>;
  getVisitByCarId(carId: string): Promise<Visit | undefined>;
  getActiveVisitByCarId(carId: string): Promise<Visit | undefined>;
  getAllVisits(): Promise<Visit[]>;
  updateVisit(id: string, visit: Partial<Visit>): Promise<Visit | undefined>;
}

export class MemStorage implements IStorage {
  private cars: Map<string, Car>;
  private visits: Map<string, Visit>;

  constructor() {
    this.cars = new Map();
    this.visits = new Map();
  }

  async createCar(insertCar: InsertCar & { qrValue: string; qrCode: string }): Promise<Car> {
    const id = randomUUID();
    const car: Car = { ...insertCar, id, createdAt: new Date() };
    this.cars.set(id, car);
    return car;
  }

  async getCarByPlateNumber(plateNumber: string): Promise<Car | undefined> {
    return Array.from(this.cars.values()).find(
      (car) => car.plateNumber === plateNumber,
    );
  }

  async getCarById(id: string): Promise<Car | undefined> {
    return this.cars.get(id);
  }

  async getCarByQRValue(qrValue: string): Promise<Car | undefined> {
    return Array.from(this.cars.values()).find(
      (car) => car.qrValue === qrValue,
    );
  }

  async createVisit(insertVisit: InsertVisit): Promise<Visit> {
    const id = randomUUID();
    const visit: Visit = {
      id,
      carId: insertVisit.carId,
      plateNumber: insertVisit.plateNumber,
      ownerName: insertVisit.ownerName,
      checkInTime: insertVisit.checkInTime,
      checkOutTime: insertVisit.checkOutTime ?? null,
      duration: insertVisit.duration ?? null,
      fee: insertVisit.fee ?? null,
      isCheckedIn: insertVisit.isCheckedIn ?? false,
    };
    this.visits.set(id, visit);
    return visit;
  }

  async getVisitByCarId(carId: string): Promise<Visit | undefined> {
    return Array.from(this.visits.values()).find(
      (visit) => visit.carId === carId,
    );
  }

  async getActiveVisitByCarId(carId: string): Promise<Visit | undefined> {
    return Array.from(this.visits.values()).find(
      (visit) => visit.carId === carId && visit.isCheckedIn,
    );
  }

  async getAllVisits(): Promise<Visit[]> {
    return Array.from(this.visits.values()).sort(
      (a, b) => b.checkInTime.getTime() - a.checkInTime.getTime()
    );
  }

  async updateVisit(id: string, visitUpdate: Partial<Visit>): Promise<Visit | undefined> {
    const visit = this.visits.get(id);
    if (!visit) return undefined;
    
    const updated = { ...visit, ...visitUpdate };
    this.visits.set(id, updated);
    return updated;
  }
}

export const storage = new MemStorage();
