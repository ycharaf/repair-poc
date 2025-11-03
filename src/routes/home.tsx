import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { MobileLayout } from '@/components/layouts/MobileLayout';

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <MobileLayout title="Accueil">
      <div className="flex flex-col min-h-full">
        {/* Hero Section */}
        <div className="text-center py-8">
          <div className="text-6xl mb-4">🛠️</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Répare & Vous
          </h1>
          <p className="text-base text-gray-600 mb-1">
            Votre SAMU de la panne
          </p>
          <p className="text-sm text-gray-500">
            Transformez chaque panne en solution simple et rapide
          </p>
        </div>

        {/* Value Propositions */}
        <div className="space-y-3 pb-6">
          <Card className="p-4 bg-white">
            <div className="flex items-start gap-3">
              <div className="text-xl flex-shrink-0">✓</div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Diagnostic intelligent</h3>
                <p className="text-sm text-gray-600">
                  Notre assistant IA identifie votre problème
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-white">
            <div className="flex items-start gap-3">
              <div className="text-xl flex-shrink-0">✓</div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Réparateurs vérifiés</h3>
                <p className="text-sm text-gray-600">
                  Artisans certifiés avec notes et garanties
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-white">
            <div className="flex items-start gap-3">
              <div className="text-xl flex-shrink-0">✓</div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Suivi temps réel</h3>
                <p className="text-sm text-gray-600">
                  Suivez chaque étape en toute transparence
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-white">
            <div className="flex items-start gap-3">
              <div className="text-xl flex-shrink-0">✓</div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Prix fixe garanti</h3>
                <p className="text-sm text-gray-600">
                  Pas de surprise, le prix annoncé est final
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="mt-auto pt-6">
          <Button
            onClick={() => navigate('/diagnostic')}
            className="w-full h-12 text-base font-semibold bg-blue-600 hover:bg-blue-700 active:scale-95 transition-transform"
          >
            Démarrer le diagnostic
          </Button>

          <p className="text-center text-xs text-gray-500 mt-3">
            Gratuit et sans engagement
          </p>
        </div>
      </div>
    </MobileLayout>
  );
}

