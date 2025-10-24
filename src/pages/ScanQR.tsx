import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, QrCode } from "lucide-react";

const ScanQR = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [qrCode, setQrCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [patientInfo, setPatientInfo] = useState<any>(null);
  const [ordonnances, setOrdonnances] = useState<any[]>([]);
  const [selectedOrdonnance, setSelectedOrdonnance] = useState<string | null>(null);
  const [delivranceLoading, setDelivranceLoading] = useState(false);

  const handleScan = async () => {
    setLoading(true);

    try {
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("qr_id", qrCode)
        .single();

      if (error) throw error;

      // Get active ordonnances
      const { data: ordonnancesData } = await supabase
        .from("ordonnances")
        .select("*, profiles!ordonnances_prescripteur_id_fkey(nom, prenom)")
        .eq("patient_id", profile.id)
        .eq("statut", "active");

      setPatientInfo(profile);
      setOrdonnances(ordonnancesData || []);
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

  const handleDelivrance = async () => {
    if (!selectedOrdonnance) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner une ordonnance",
        variant: "destructive",
      });
      return;
    }

    setDelivranceLoading(true);

    try {
      // Get pharmacien profile
      const { data: pharmacienProfile } = await supabase
        .from("profiles")
        .select("id")
        .eq("user_id", user?.id)
        .single();

      if (!pharmacienProfile) throw new Error("Pharmacien non trouvé");

      // Create delivrance
      const { error } = await supabase.from("delivrances").insert({
        ordonnance_id: selectedOrdonnance,
        pharmacien_id: pharmacienProfile.id,
        quantite: 1,
      });

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Délivrance enregistrée",
      });

      // Refresh ordonnances
      handleScan();
      setSelectedOrdonnance(null);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer la délivrance",
        variant: "destructive",
      });
    }

    setDelivranceLoading(false);
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
              <div className="space-y-4">
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
                      {ordonnances.length}
                    </p>
                  </div>
                </Card>

                {ordonnances.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-3">Ordonnances actives</h3>
                    <div className="space-y-3">
                      {ordonnances.map((ord) => (
                        <Card
                          key={ord.id}
                          className={`p-4 cursor-pointer transition-colors ${
                            selectedOrdonnance === ord.id
                              ? "border-primary bg-primary/5"
                              : "hover:bg-muted/50"
                          }`}
                          onClick={() => setSelectedOrdonnance(ord.id)}
                        >
                          <div className="space-y-2">
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="font-medium">
                                  Dr. {ord.profiles?.nom} {ord.profiles?.prenom}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {new Date(ord.date).toLocaleDateString()}
                                </p>
                              </div>
                              {selectedOrdonnance === ord.id && (
                                <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded">
                                  Sélectionnée
                                </span>
                              )}
                            </div>
                            <div className="text-sm">
                              <p className="font-medium mb-1">Médicaments:</p>
                              <ul className="list-disc list-inside space-y-1">
                                {ord.contenu?.medicaments?.map((med: any, idx: number) => (
                                  <li key={idx}>
                                    {med.nom} - {med.posologie}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>

                    <Button
                      className="w-full mt-4"
                      onClick={handleDelivrance}
                      disabled={!selectedOrdonnance || delivranceLoading}
                    >
                      {delivranceLoading ? "Enregistrement..." : "Délivrer les médicaments"}
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </Card>
      </main>
    </div>
  );
};

export default ScanQR;
