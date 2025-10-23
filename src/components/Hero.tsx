import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, QrCode, Activity } from "lucide-react";
import heroImage from "@/assets/hero-medical.jpg";

export const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-background via-background to-muted">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="container relative z-10 px-4 py-20 mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8 animate-in fade-in slide-in-from-left duration-700">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full border border-primary/20">
              <Shield className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Solution médicale sécurisée</span>
            </div>

            <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
              Digitalisation des
              <span className="block bg-gradient-hero bg-clip-text text-transparent">
                Dossiers Médicaux
              </span>
            </h1>

            <p className="text-lg text-muted-foreground leading-relaxed max-w-xl">
              Transformez la prise en charge des patients avec notre plateforme QR sécurisée. 
              Centralisez consultations, prescriptions et délivrances en toute conformité.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" variant="hero" className="group" onClick={() => window.location.href = '/auth'}>
                Commencer
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button size="lg" variant="outline" className="border-primary/30 hover:border-primary" onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}>
                En savoir plus
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-border">
              <div>
                <div className="text-3xl font-bold text-primary">100%</div>
                <div className="text-sm text-muted-foreground">Sécurisé</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-secondary">24/7</div>
                <div className="text-sm text-muted-foreground">Disponible</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-accent">RGPD</div>
                <div className="text-sm text-muted-foreground">Conforme</div>
              </div>
            </div>
          </div>

          {/* Right Content - Image */}
          <div className="relative animate-in fade-in slide-in-from-right duration-700 delay-200">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img 
                src={heroImage} 
                alt="Équipe médicale utilisant des technologies numériques" 
                className="w-full h-auto"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent" />
            </div>

            {/* Floating cards */}
            <div className="absolute -bottom-6 -left-6 bg-card p-4 rounded-xl shadow-medical border border-border animate-in fade-in slide-in-from-bottom duration-700 delay-500">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <QrCode className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="text-sm font-semibold">QR Code Patient</div>
                  <div className="text-xs text-muted-foreground">Accès instantané</div>
                </div>
              </div>
            </div>

            <div className="absolute -top-6 -right-6 bg-card p-4 rounded-xl shadow-medical border border-border animate-in fade-in slide-in-from-top duration-700 delay-700">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-secondary/10 rounded-lg">
                  <Activity className="w-5 h-5 text-secondary" />
                </div>
                <div>
                  <div className="text-sm font-semibold">Suivi en temps réel</div>
                  <div className="text-xs text-muted-foreground">Historique complet</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};