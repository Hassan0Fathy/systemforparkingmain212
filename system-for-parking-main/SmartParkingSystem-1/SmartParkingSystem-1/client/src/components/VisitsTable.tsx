import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { RefreshCw, Download } from "lucide-react";

interface Visit {
  id: string;
  plateNumber: string;
  ownerName: string;
  checkInTime: Date;
  checkOutTime: Date | null;
  duration: number | null;
  fee: number | null;
  isCheckedIn: boolean;
}

interface VisitsTableProps {
  visits: Visit[];
  onRefresh: () => void;
  onExport: () => void;
  isLoading?: boolean;
}

export default function VisitsTable({ visits, onRefresh, onExport, isLoading }: VisitsTableProps) {
  const formatDuration = (minutes: number | null) => {
    if (!minutes) return "-";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4 justify-between">
        <h2 className="text-2xl font-bold">Visits Log</h2>
        <div className="flex gap-2">
          <Button
            onClick={onRefresh}
            variant="outline"
            disabled={isLoading}
            data-testid="button-refresh"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button
            onClick={onExport}
            data-testid="button-export"
          >
            <Download className="w-4 h-4 mr-2" />
            Export to Excel
          </Button>
        </div>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Plate Number</TableHead>
                <TableHead>Owner Name</TableHead>
                <TableHead>Check In</TableHead>
                <TableHead>Check Out</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Fee (EGP)</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visits.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No visits recorded yet
                  </TableCell>
                </TableRow>
              ) : (
                visits.map((visit) => (
                  <TableRow key={visit.id} data-testid={`row-visit-${visit.id}`}>
                    <TableCell className="font-medium" data-testid={`text-plate-${visit.id}`}>
                      {visit.plateNumber}
                    </TableCell>
                    <TableCell>{visit.ownerName}</TableCell>
                    <TableCell>
                      {format(visit.checkInTime, "MMM dd, yyyy HH:mm")}
                    </TableCell>
                    <TableCell>
                      {visit.checkOutTime
                        ? format(visit.checkOutTime, "MMM dd, yyyy HH:mm")
                        : "-"}
                    </TableCell>
                    <TableCell>{formatDuration(visit.duration)}</TableCell>
                    <TableCell>{visit.fee !== null ? visit.fee : "-"}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex px-2 py-1 rounded-md text-xs font-medium ${
                          visit.isCheckedIn
                            ? "bg-primary/10 text-primary"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {visit.isCheckedIn ? "Checked In" : "Checked Out"}
                      </span>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
