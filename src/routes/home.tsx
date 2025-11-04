import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { MobileLayout } from '@/components/layouts/MobileLayout';
export default function HomePage() {
  const navigate = useNavigate();
  return (
    <MobileLayout title="Répare & Vous">
      <div className="flex flex-col h-full p-4">
        {/* Hero Section */}
        <div className="text-center py-12 flex-1 flex flex-col justify-center">
          <div className="text-8xl mb-6">💛</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            Répare & Vous
          </h1>
          <p className="text-xl text-gray-700 mb-8">
            On répare avant de remplacer.
          </p>
          <div className="space-y-3 text-base text-gray-600 mb-12">
            <div className="flex items-center justify-center gap-2">
              <span>✓</span>
              <span>Diagnostic en 2 minutes</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <span>✓</span>
              <span>Réparation immédiate ou en magasin</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <span>✓</span>
              <span>Sans inscription, 100% gratuit</span>
            </div>
          </div>
          <Button
            onClick={() => navigate('/diagnostic')}
            className="w-full h-14 text-lg font-semibold bg-blue-600 hover:bg-blue-700 active:scale-95 transition-transform shadow-lg"
          >
            Commencer le diagnostic
          </Button>
        </div>
        {/* Info Cards */}
        <div className="space-y-3 pb-4">
          <Card className="p-4 bg-gray-50">
            <div className="flex items-start gap-3">
              <div className="text-2xl flex-shrink-0">🎥</div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Visio immédiate</h3>
                <p className="text-sm text-gray-600">
                  Réparez avec un technicien en 10 minutes
                </p>
              </div>
            </div>
          </Card>
          <Card className="p-4 bg-gray-50">
            <div className="flex items-start gap-3">
              <div className="text-2xl flex-shrink-0">🏪</div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Ateliers partenaires</h3>
                <p className="text-sm text-gray-600">
                  Réseau d'artisans certifiés près de chez vous
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </MobileLayout>
  );
}
