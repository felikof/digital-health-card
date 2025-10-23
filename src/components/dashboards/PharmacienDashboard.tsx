import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Package, QrCode, FileText, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PharmacienDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    delivrances: 0,
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
        const { count: delivrancesCount } = await supabase
          .from("delivrances")
          .select("*", { count: "exact", head: true })
          .eq("pharmacien_id", profile.id);

        setStats({
          delivrances: delivrancesCount || 0,
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
          <h1 className="text-2xl font-bold text-primary">Espace Pharmacien</h1>
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
                <Package className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">{stats.delivrances}</h3>
                <p className="text-sm text-muted-foreground">Délivrances</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-secondary/10 rounded-lg">
                <FileText className="w-6 h-6 text-secondary" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">0</h3>
                <p className="text-sm text-muted-foreground">En attente</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-accent/10 rounded-lg">
                <QrCode className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">0</h3>
                <p className="text-sm text-muted-foreground">Scans aujourd'hui</p>
              </div>
            </div>
          </Card>
        </div>

        <Card className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Actions rapides</h2>
          </div>
          <div className="space-y-4">
            <Button className="w-full" onClick={() => navigate("/scan-qr")}>
              <QrCode className="w-4 h-4 mr-2" />
              Scanner QR Code
            </Button>
            <Button variant="outline" className="w-full">
              <FileText className="w-4 h-4 mr-2" />
              Rechercher ordonnance
            </Button>
            <Button variant="outline" className="w-full">
              <Package className="w-4 h-4 mr-2" />
              Historique délivrances
            </Button>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default PharmacienDashboard;
