import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { QrCode, FileText, Calendar, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface Profile {
  id: string;
  nom: string;
  prenom: string;
  qr_id: string;
  date_naissance: string | null;
  telephone: string | null;
  antecedents: string | null;
  allergies: string | null;
}

const PatientDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error) {
        toast({
          title: "Erreur",
          description: "Impossible de charger votre profil",
          variant: "destructive",
        });
      } else {
        setProfile(data);
      }
      setLoading(false);
    };

    fetchProfile();
  }, [user, toast]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Chargement...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <header className="bg-card border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary">Espace Patient</h1>
          <Button onClick={handleLogout} variant="outline" size="sm">
            <LogOut className="w-4 h-4 mr-2" />
            Déconnexion
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <QrCode className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Mon QR Code</h3>
                <p className="text-sm text-muted-foreground">Code unique</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-secondary/10 rounded-lg">
                <FileText className="w-6 h-6 text-secondary" />
              </div>
              <div>
                <h3 className="font-semibold">Ordonnances</h3>
                <p className="text-sm text-muted-foreground">Mes prescriptions</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-accent/10 rounded-lg">
                <Calendar className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h3 className="font-semibold">Consultations</h3>
                <p className="text-sm text-muted-foreground">Historique</p>
              </div>
            </div>
          </Card>
        </div>

        {profile && (
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Mes Informations</h2>
            <div className="space-y-3">
              <div>
                <span className="font-medium">Nom complet:</span>{" "}
                {profile.prenom} {profile.nom}
              </div>
              <div>
                <span className="font-medium">Code QR:</span>{" "}
                <code className="bg-muted px-2 py-1 rounded">{profile.qr_id}</code>
              </div>
              {profile.date_naissance && (
                <div>
                  <span className="font-medium">Date de naissance:</span>{" "}
                  {new Date(profile.date_naissance).toLocaleDateString()}
                </div>
              )}
              {profile.telephone && (
                <div>
                  <span className="font-medium">Téléphone:</span> {profile.telephone}
                </div>
              )}
              {profile.allergies && (
                <div>
                  <span className="font-medium">Allergies:</span> {profile.allergies}
                </div>
              )}
            </div>
          </Card>
        )}
      </main>
    </div>
  );
};

export default PatientDashboard;
