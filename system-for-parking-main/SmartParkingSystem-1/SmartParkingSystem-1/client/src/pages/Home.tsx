import { useLocation } from "wouter";
import NavigationCard from "@/components/NavigationCard";
import { Car, ScanLine, ClipboardList } from "lucide-react";

export default function Home() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-2" data-testid="text-app-title">
            Smart Parking System
          </h1>
          <p className="text-muted-foreground">
            Manage your parking efficiently with QR code technology
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <NavigationCard
            title="Register Car"
            description="Add a new vehicle to the system"
            icon={Car}
            onClick={() => setLocation("/register")}
          />
          <NavigationCard
            title="Scan QR"
            description="Check in or check out vehicles"
            icon={ScanLine}
            onClick={() => setLocation("/scan")}
          />
          <NavigationCard
            title="Visits Log"
            description="View and export parking history"
            icon={ClipboardList}
            onClick={() => setLocation("/visits")}
          />
        </div>
      </div>
    </div>
  );
}
