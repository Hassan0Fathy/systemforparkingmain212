import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import VisitsTable from "@/components/VisitsTable";
import toast from "react-hot-toast";
import { getVisits, exportVisits } from "@/lib/api";

export default function VisitsLog() {
  const [, setLocation] = useLocation();

  const { data: visits = [], refetch, isLoading } = useQuery({
    queryKey: ["/api/visits"],
    queryFn: getVisits,
  });

  const handleRefresh = async () => {
    try {
      await refetch();
      toast.success("Data refreshed successfully!");
    } catch (error) {
      toast.error("Failed to refresh data");
    }
  };

  const handleExport = () => {
    try {
      exportVisits();
      toast.success("Excel file download started!");
    } catch (error) {
      toast.error("Failed to export data");
    }
  };

  const formattedVisits = visits.map(visit => ({
    ...visit,
    checkInTime: new Date(visit.checkInTime),
    checkOutTime: visit.checkOutTime ? new Date(visit.checkOutTime) : null,
  }));

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

        <VisitsTable
          visits={formattedVisits}
          onRefresh={handleRefresh}
          onExport={handleExport}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
