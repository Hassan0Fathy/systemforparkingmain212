import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Camera, CameraOff } from "lucide-react";

interface QRScannerProps {
  onScan: (qrCode: string) => Promise<void>;
}

export default function QRScanner({ onScan }: QRScannerProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const qrCodeRegionId = "qr-reader";

  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        scannerRef.current.stop().catch(console.error);
      }
    };
  }, []);

  const startScanning = async () => {
    try {
      setError(null);
      const scanner = new Html5Qrcode(qrCodeRegionId);
      scannerRef.current = scanner;

      await scanner.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        async (decodedText) => {
          await onScan(decodedText);
          stopScanning();
        },
        () => {}
      );

      setIsScanning(true);
    } catch (err) {
      setError("Failed to start camera. Please check permissions.");
      console.error(err);
    }
  };

  const stopScanning = async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
        scannerRef.current = null;
        setIsScanning(false);
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card className="p-6">
        <div
          id={qrCodeRegionId}
          className="w-full aspect-video rounded-lg overflow-hidden bg-muted"
          data-testid="div-qr-scanner"
        />
        {error && (
          <p className="text-sm text-destructive mt-4" data-testid="text-error">
            {error}
          </p>
        )}
      </Card>

      <div className="flex gap-4">
        {!isScanning ? (
          <Button
            onClick={startScanning}
            className="flex-1"
            data-testid="button-start-scan"
          >
            <Camera className="w-4 h-4 mr-2" />
            Start Scanning
          </Button>
        ) : (
          <Button
            onClick={stopScanning}
            variant="destructive"
            className="flex-1"
            data-testid="button-stop-scan"
          >
            <CameraOff className="w-4 h-4 mr-2" />
            Stop Scanning
          </Button>
        )}
      </div>
    </div>
  );
}
