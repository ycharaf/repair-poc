import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { MobileLayout } from '@/components/layouts/MobileLayout';

export default function EstimationPage() {
  const navigate = useNavigate();

  // Récupérer les données du diagnostic depuis localStorage ou state management
  const diagnosticData = JSON.parse(localStorage.getItem('diagnostic_data') || '{}');

  return (
    <MobileLayout title="Estimation" showBack={true}>
      <div className="flex flex-col h-full p-4">
        {/* Résultat */}
        <Card className="p-6 mb-4 bg-green-50 border-green-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="text-3xl">✓</div>
            <h2 className="text-lg font-semibold text-green-800">
              Probablement réparable
            </h2>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-2xl">💶</span>
              <div>
                <p className="font-medium text-gray-700">Estimation</p>
                <p className="text-lg font-bold text-gray-900">39€ – 79€</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-2xl">⏱</span>
              <div>
                <p className="font-medium text-gray-700">Durée</p>
                <p className="text-lg font-bold text-gray-900">45 min – 2h</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Récapitulatif */}
        <Card className="p-4 mb-4">
          <h3 className="font-semibold mb-3 text-gray-900">Récapitulatif</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Appareil :</span>
              <span className="font-medium">{diagnosticData.appareil || 'Smartphone'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Modèle :</span>
              <span className="font-medium">{diagnosticData.modele || 'iPhone 12'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Problème :</span>
              <span className="font-medium">{diagnosticData.symptome || 'Ne s\'allume plus'}</span>
            </div>
          </div>
        </Card>

        {/* CTA */}
        <div className="mt-auto">
          <Button
            onClick={() => navigate('/choose-method')}
            className="w-full h-12 text-base font-semibold bg-blue-600 hover:bg-blue-700 active:scale-95 transition-transform"
          >
            Continuer
          </Button>
        </div>
      </div>
    </MobileLayout>
  );
}

