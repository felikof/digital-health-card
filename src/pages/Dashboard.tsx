import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useUserRole } from "@/hooks/useUserRole";
import PatientDashboard from "@/components/dashboards/PatientDashboard";
import MedecinDashboard from "@/components/dashboards/MedecinDashboard";
import PharmacienDashboard from "@/components/dashboards/PharmacienDashboard";

const Dashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const { role, loading: roleLoading } = useUserRole(user?.id);
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  if (authLoading || roleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Chargement...</div>
      </div>
    );
  }

  if (role === "patient") {
    return <PatientDashboard />;
  }

  if (role === "medecin") {
    return <MedecinDashboard />;
  }

  if (role === "pharmacien") {
    return <PharmacienDashboard />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-lg">Rôle non reconnu</div>
    </div>
  );
};

export default Dashboard;
