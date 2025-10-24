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
import { ArrowLeft, Plus, Trash2 } from "lucide-react";

interface Medicament {
  nom: string;
  posologie: string;
  duree: string;
}

const Ordonnance = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    patientQr: "",
    consultationId: "",
  });

  const [medicaments, setMedicaments] = useState<Medicament[]>([
    { nom: "", posologie: "", duree: "" },
  ]);

  const ajouterMedicament = () => {
    setMedicaments([...medicaments, { nom: "", posologie: "", duree: "" }]);
  };

  const supprimerMedicament = (index: number) => {
    setMedicaments(medicaments.filter((_, i) => i !== index));
  };

  const updateMedicament = (index: number, field: keyof Medicament, value: string) => {
    const newMedicaments = [...medicaments];
    newMedicaments[index][field] = value;
    setMedicaments(newMedicaments);
  };

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

      // Create ordonnance
      const ordonnanceData: any = {
        patient_id: patientProfile.id,
        prescripteur_id: doctorProfile?.id,
        contenu: { medicaments },
        signature_electronique: `DR-${doctorProfile?.id}-${Date.now()}`,
        qr_code: `ORD-${Date.now()}`,
      };

      if (formData.consultationId) {
        ordonnanceData.consultation_id = formData.consultationId;
      }

      const { error } = await supabase.from("ordonnances").insert(ordonnanceData);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Ordonnance créée avec succès",
      });

      navigate("/dashboard");
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de créer l'ordonnance",
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
          <h1 className="text-2xl font-bold mb-6">Nouvelle Ordonnance</h1>

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
              <Label htmlFor="consultationId">
                ID Consultation (optionnel)
              </Label>
              <Input
                id="consultationId"
                value={formData.consultationId}
                onChange={(e) =>
                  setFormData({ ...formData, consultationId: e.target.value })
                }
                placeholder="UUID de la consultation"
              />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label>Médicaments</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={ajouterMedicament}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Ajouter
                </Button>
              </div>

              {medicaments.map((med, index) => (
                <Card key={index} className="p-4 relative">
                  {medicaments.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => supprimerMedicament(index)}
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  )}

                  <div className="space-y-3">
                    <div>
                      <Label htmlFor={`med-nom-${index}`}>Nom du médicament</Label>
                      <Input
                        id={`med-nom-${index}`}
                        value={med.nom}
                        onChange={(e) =>
                          updateMedicament(index, "nom", e.target.value)
                        }
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor={`med-posologie-${index}`}>Posologie</Label>
                      <Input
                        id={`med-posologie-${index}`}
                        value={med.posologie}
                        onChange={(e) =>
                          updateMedicament(index, "posologie", e.target.value)
                        }
                        placeholder="Ex: 1 comprimé 3 fois par jour"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor={`med-duree-${index}`}>Durée</Label>
                      <Input
                        id={`med-duree-${index}`}
                        value={med.duree}
                        onChange={(e) =>
                          updateMedicament(index, "duree", e.target.value)
                        }
                        placeholder="Ex: 7 jours"
                        required
                      />
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Création..." : "Créer l'ordonnance"}
            </Button>
          </form>
        </Card>
      </main>
    </div>
  );
};

export default Ordonnance;
