import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserCircle, Stethoscope, Pill, ArrowRight } from "lucide-react";

const roles = [
  {
    icon: UserCircle,
    title: "Patients",
    description: "Accédez à votre dossier médical, consultations et ordonnances via votre QR code personnel.",
    color: "from-primary to-primary-glow",
    features: ["Dossier médical complet", "Historique des consultations", "QR code personnel"],
  },
  {
    icon: Stethoscope,
    title: "Médecins",
    description: "Enregistrez consultations, diagnostics et créez des ordonnances numériques sécurisées.",
    color: "from-secondary to-emerald-400",
    features: ["Création ordonnances", "Suivi patients", "Signature électronique"],
  },
  {
    icon: Pill,
    title: "Pharmaciens",
    description: "Vérifiez et validez les ordonnances, enregistrez les délivrances en toute conformité.",
    color: "from-accent to-cyan-400",
    features: ["Scan QR ordonnances", "Validation sécurisée", "Traçabilité complète"],
  },
];

export const RoleCards = () => {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl font-bold">
            Une solution pour tous les <span className="text-primary">acteurs de santé</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Choisissez votre profil et découvrez comment notre plateforme révolutionne votre parcours de soin
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {roles.map((role, index) => {
            const Icon = role.icon;
            return (
              <Card
                key={index}
                className="relative overflow-hidden bg-gradient-card border-border hover:shadow-medical transition-all duration-300 hover:-translate-y-2 group"
              >
                <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${role.color}`} />
                
                <div className="p-8 space-y-6">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${role.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-2xl font-bold">{role.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {role.description}
                    </p>
                  </div>

                  <ul className="space-y-2">
                    {role.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm">
                        <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${role.color}`} />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button variant="ghost" className="w-full group/btn">
                    Accéder au portail
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};