import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, QrCode } from "lucide-react";

const ScanQR = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [qrCode, setQrCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [patientInfo, setPatientInfo] = useState<any>(null);

  const handleScan = async () => {
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*, ordonnances(*)")
        .eq("qr_id", qrCode)
        .single();

      if (error) throw error;

      setPatientInfo(data);
      toast({
        title: "Succès",
        description: "Patient trouvé",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Code QR invalide ou patient non trouvé",
        variant: "destructive",
      });
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <header className="bg-card border-b">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <Card className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-primary/10 rounded-lg">
              <QrCode className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold">Scanner QR Code</h1>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="qrCode">Code QR du patient</Label>
              <div className="flex gap-2">
                <Input
                  id="qrCode"
                  value={qrCode}
                  onChange={(e) => setQrCode(e.target.value)}
                  placeholder="QR-XXXXXXXXXXXX"
                />
                <Button onClick={handleScan} disabled={loading}>
                  {loading ? "Scan..." : "Scanner"}
                </Button>
              </div>
            </div>

            {patientInfo && (
              <Card className="p-4 bg-muted">
                <h3 className="font-semibold mb-2">Informations Patient</h3>
                <div className="space-y-2 text-sm">
                  <p>
                    <span className="font-medium">Nom:</span> {patientInfo.nom}{" "}
                    {patientInfo.prenom}
                  </p>
                  {patientInfo.date_naissance && (
                    <p>
                      <span className="font-medium">Date de naissance:</span>{" "}
                      {new Date(patientInfo.date_naissance).toLocaleDateString()}
                    </p>
                  )}
                  {patientInfo.allergies && (
                    <p>
                      <span className="font-medium">Allergies:</span>{" "}
                      {patientInfo.allergies}
                    </p>
                  )}
                  <p>
                    <span className="font-medium">Ordonnances actives:</span>{" "}
                    {patientInfo.ordonnances?.length || 0}
                  </p>
                </div>
              </Card>
            )}
          </div>
        </Card>
      </main>
    </div>
  );
};

export default ScanQR;
