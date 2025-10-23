import { Shield, Lock, Database, FileCheck, Clock, Users } from "lucide-react";
import qrConcept from "@/assets/qr-concept.jpg";

const features = [
  {
    icon: Shield,
    title: "Sécurité maximale",
    description: "Chiffrement AES-256 et conformité RGPD pour protéger les données de santé.",
  },
  {
    icon: Lock,
    title: "Authentification forte",
    description: "Authentification multi-facteurs pour tous les professionnels de santé.",
  },
  {
    icon: Database,
    title: "Centralisation",
    description: "Tous les dossiers patients accessibles via un QR code unique et sécurisé.",
  },
  {
    icon: FileCheck,
    title: "Signature électronique",
    description: "Ordonnances numériques signées et vérifiables en temps réel.",
  },
  {
    icon: Clock,
    title: "Disponibilité 24/7",
    description: "Accès permanent aux dossiers médicaux avec sauvegarde automatique.",
  },
  {
    icon: Users,
    title: "Traçabilité complète",
    description: "Audit trail de tous les accès et modifications pour la conformité.",
  },
];

export const Features = () => {
  return (
    <section id="features" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left - Features Grid */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-4xl font-bold">
                Pourquoi choisir notre <span className="text-primary">plateforme ?</span>
              </h2>
              <p className="text-lg text-muted-foreground">
                Une solution complète pensée pour la sécurité, l'efficacité et la conformité réglementaire.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={index}
                    className="space-y-3 p-6 rounded-xl bg-gradient-card border border-border hover:shadow-card-soft transition-all duration-300"
                  >
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-semibold text-lg">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right - QR Concept Image */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-medical border border-border bg-gradient-to-br from-primary/5 to-accent/5 p-8">
              <img
                src={qrConcept}
                alt="Concept de QR code médical sur smartphone"
                className="w-full h-auto rounded-xl"
              />
            </div>

            {/* Decorative elements */}
            <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-hero opacity-10 blur-3xl rounded-full" />
          </div>
        </div>
      </div>
    </section>
  );
};