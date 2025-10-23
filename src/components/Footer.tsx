import { Heart } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="py-12 bg-card border-t border-border">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-4">
            <h3 className="font-bold text-lg flex items-center gap-2">
              <Heart className="w-5 h-5 text-primary fill-primary" />
              MediQR
            </h3>
            <p className="text-sm text-muted-foreground">
              Plateforme de digitalisation des dossiers médicaux et ordonnances par QR code.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold">Portails</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">Patients</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Médecins</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Pharmaciens</a></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold">Ressources</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">Documentation</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Guide utilisateur</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">FAQ</a></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold">Légal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">Mentions légales</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Politique de confidentialité</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">CGU</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-border text-center text-sm text-muted-foreground">
          <p>© 2025 MediQR. Tous droits réservés. Solution conforme RGPD.</p>
        </div>
      </div>
    </footer>
  );
};