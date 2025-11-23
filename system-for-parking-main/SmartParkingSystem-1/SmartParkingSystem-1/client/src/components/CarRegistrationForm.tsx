import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Download } from "lucide-react";

const formSchema = z.object({
  plateNumber: z.string().min(1, "Plate number is required"),
  ownerName: z.string().min(1, "Owner name is required"),
});

interface CarRegistrationFormProps {
  onSubmit: (data: z.infer<typeof formSchema>) => Promise<{ qrCode: string }>;
}

export default function CarRegistrationForm({ onSubmit }: CarRegistrationFormProps) {
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      plateNumber: "",
      ownerName: "",
    },
  });

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      const result = await onSubmit(values);
      setQrCode(result.qrCode);
      form.reset();
    } catch (error) {
      console.error("Registration failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (!qrCode) return;
    const link = document.createElement("a");
    link.href = qrCode;
    link.download = `qr-${form.getValues("plateNumber") || "code"}.png`;
    link.click();
  };

  return (
    <div className="max-w-md mx-auto space-y-6">
      <Card className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="plateNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Plate Number</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="ABC-1234"
                      {...field}
                      data-testid="input-plate-number"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="ownerName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Owner Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="John Doe"
                      {...field}
                      data-testid="input-owner-name"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
              data-testid="button-register"
            >
              {isLoading ? "Registering..." : "Register Car"}
            </Button>
          </form>
        </Form>
      </Card>

      {qrCode && (
        <Card className="p-8">
          <div className="flex flex-col items-center gap-4">
            <h3 className="text-lg font-semibold">QR Code Generated</h3>
            <img
              src={qrCode}
              alt="QR Code"
              className="w-64 h-64 border border-border rounded-lg"
              data-testid="img-qr-code"
            />
            <Button
              onClick={handleDownload}
              className="w-full"
              data-testid="button-download-qr"
            >
              <Download className="w-4 h-4 mr-2" />
              Download QR Code
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
