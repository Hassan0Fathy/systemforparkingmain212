import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import QRScanner from "@/components/QRScanner";
import toast from "react-hot-toast";
import { scanQRCode } from "@/lib/api";

export default function ScanQR() {
  const [, setLocation] = useLocation();

  const handleScan = async (qrCode: string) => {
    try {
      const result = await scanQRCode(qrCode);
      
      if (result.type === "checkin") {
        toast.success(result.message);
      } else if (result.type === "checkout") {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to scan QR code");
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
          <h1 className="text-3xl font-bold mb-2">Scan QR Code</h1>
          <p className="text-muted-foreground">
            Point your camera at the QR code to check in or check out
          </p>
        </div>

        <QRScanner onScan={handleScan} />
      </div>
    </div>
  );
}
