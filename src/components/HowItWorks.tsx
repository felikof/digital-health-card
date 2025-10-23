import { UserPlus, FileText, QrCode, CheckCircle } from "lucide-react";

const steps = [
  {
    icon: UserPlus,
    number: "01",
    title: "Création du compte",
    description: "Patient créé son compte ou reçoit un QR code unique lors de la première consultation.",
  },
  {
    icon: FileText,
    number: "02",
    title: "Consultation médicale",
    description: "Le médecin enregistre la consultation, le diagnostic et crée une ordonnance signée électroniquement.",
  },
  {
    icon: QrCode,
    number: "03",
    title: "Présentation en pharmacie",
    description: "Le patient présente son QR code en pharmacie pour accéder à ses ordonnances validées.",
  },
  {
    icon: CheckCircle,
    number: "04",
    title: "Délivrance sécurisée",
    description: "Le pharmacien vérifie, valide et enregistre la délivrance dans l'historique du patient.",
  },
];

export const HowItWorks = () => {
  return (
    <section className="py-24 bg-gradient-to-b from-muted/50 to-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl font-bold">
            Comment ça <span className="text-primary">fonctionne ?</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Un parcours simplifié de la consultation à la délivrance, entièrement numérique et sécurisé
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {/* Connection line for desktop */}
            <div className="hidden lg:block absolute top-16 left-0 right-0 h-0.5 bg-gradient-to-r from-primary via-secondary to-accent" style={{ width: 'calc(100% - 8rem)', left: '4rem' }} />

            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="relative">
                  <div className="flex flex-col items-center text-center space-y-4">
                    {/* Icon container */}
                    <div className="relative z-10">
                      <div className="w-32 h-32 rounded-2xl bg-gradient-card border-2 border-border shadow-medical flex flex-col items-center justify-center gap-2 group hover:scale-105 transition-transform">
                        <Icon className="w-10 h-10 text-primary" />
                        <span className="text-3xl font-bold text-primary/20">{step.number}</span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold">{step.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};