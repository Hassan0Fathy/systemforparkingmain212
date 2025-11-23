import QRScanner from '../QRScanner';

export default function QRScannerExample() {
  return (
    <QRScanner
      onScan={async (qrCode) => {
        console.log('QR Code scanned:', qrCode);
      }}
    />
  );
}
