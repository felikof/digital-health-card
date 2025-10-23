import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft } from "lucide-react";

const Consultation = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    patientQr: "",
    symptomes: "",
    examens: "",
    diagnostic: "",
    notes: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Get doctor profile
      const { data: doctorProfile } = await supabase
        .from("profiles")
        .select("id")
        .eq("user_id", user?.id)
        .single();

      // Get patient profile by QR
      const { data: patientProfile } = await supabase
        .from("profiles")
        .select("id")
        .eq("qr_id", formData.patientQr)
        .single();

      if (!patientProfile) {
        toast({
          title: "Erreur",
          description: "Patient non trouvé avec ce QR code",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      // Create consultation
      const { error } = await supabase.from("consultations").insert({
        patient_id: patientProfile.id,
        medecin_id: doctorProfile?.id,
        symptomes: formData.symptomes,
        examens: formData.examens,
        diagnostic: formData.diagnostic,
        notes: formData.notes,
      });

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Consultation enregistrée avec succès",
      });

      navigate("/dashboard");
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer la consultation",
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
          <h1 className="text-2xl font-bold mb-6">Nouvelle Consultation</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="patientQr">Code QR du patient</Label>
              <Input
                id="patientQr"
                value={formData.patientQr}
                onChange={(e) =>
                  setFormData({ ...formData, patientQr: e.target.value })
                }
                placeholder="QR-XXXXXXXXXXXX"
                required
              />
            </div>

            <div>
              <Label htmlFor="symptomes">Symptômes</Label>
              <Textarea
                id="symptomes"
                value={formData.symptomes}
                onChange={(e) =>
                  setFormData({ ...formData, symptomes: e.target.value })
                }
                required
                rows={4}
              />
            </div>

            <div>
              <Label htmlFor="examens">Examens effectués</Label>
              <Textarea
                id="examens"
                value={formData.examens}
                onChange={(e) =>
                  setFormData({ ...formData, examens: e.target.value })
                }
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="diagnostic">Diagnostic</Label>
              <Textarea
                id="diagnostic"
                value={formData.diagnostic}
                onChange={(e) =>
                  setFormData({ ...formData, diagnostic: e.target.value })
                }
                required
                rows={4}
              />
            </div>

            <div>
              <Label htmlFor="notes">Notes additionnelles</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                rows={3}
              />
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? "Enregistrement..." : "Enregistrer consultation"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/ordonnance")}
                className="flex-1"
              >
                Créer une ordonnance
              </Button>
            </div>
          </form>
        </Card>
      </main>
    </div>
  );
};

export default Consultation;
