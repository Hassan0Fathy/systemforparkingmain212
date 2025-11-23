import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import CarRegistrationForm from "@/components/CarRegistrationForm";
import toast from "react-hot-toast";
import { registerCar } from "@/lib/api";

export default function RegisterCar() {
  const [, setLocation] = useLocation();

  const handleSubmit = async (data: { plateNumber: string; ownerName: string }) => {
    try {
      const result = await registerCar(data);
      toast.success(`Car ${data.plateNumber} registered successfully!`);
      return { qrCode: result.qrCode };
    } catch (error: any) {
      toast.error(error.message || "Failed to register car");
      throw error;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Button
          onClick={() => setLocation("/")}
          variant="ghost"
          className="mb-6"
          data-testid="button-back"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Register New Car</h1>
          <p className="text-muted-foreground">
            Enter vehicle details to generate a QR code
          </p>
        </div>

        <CarRegistrationForm onSubmit={handleSubmit} />
      </div>
    </div>
  );
}
