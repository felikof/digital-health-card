import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Users, FileText, Calendar, LogOut, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

const MedecinDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    patients: 0,
    consultations: 0,
    ordonnances: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      if (!user) return;

      const { data: profile } = await supabase
        .from("profiles")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (profile) {
        const { count: consultationsCount } = await supabase
          .from("consultations")
          .select("*", { count: "exact", head: true })
          .eq("medecin_id", profile.id);

        const { count: ordonnancesCount } = await supabase
          .from("ordonnances")
          .select("*", { count: "exact", head: true })
          .eq("prescripteur_id", profile.id);

        setStats({
          patients: 0,
          consultations: consultationsCount || 0,
          ordonnances: ordonnancesCount || 0,
        });
      }
    };

    fetchStats();
  }, [user]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <header className="bg-card border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary">Espace Médecin</h1>
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
                <Users className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">{stats.patients}</h3>
                <p className="text-sm text-muted-foreground">Patients</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-secondary/10 rounded-lg">
                <Calendar className="w-6 h-6 text-secondary" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">{stats.consultations}</h3>
                <p className="text-sm text-muted-foreground">Consultations</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-accent/10 rounded-lg">
                <FileText className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">{stats.ordonnances}</h3>
                <p className="text-sm text-muted-foreground">Ordonnances</p>
              </div>
            </div>
          </Card>
        </div>

        <Card className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Actions rapides</h2>
          </div>
          <div className="space-y-4">
            <Button className="w-full" onClick={() => navigate("/consultation")}>
              <Plus className="w-4 h-4 mr-2" />
              Nouvelle consultation
            </Button>
            <Button variant="outline" className="w-full">
              <Users className="w-4 h-4 mr-2" />
              Rechercher un patient
            </Button>
            <Button variant="outline" className="w-full">
              <FileText className="w-4 h-4 mr-2" />
              Voir toutes les ordonnances
            </Button>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default MedecinDashboard;
