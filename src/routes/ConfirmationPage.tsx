import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { MobileLayout } from '@/components/layouts/MobileLayout';

interface StoreInfo {
  name: string;
  address: string;
  distance: string;
  availability: string;
}

export default function ConfirmationPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const method = searchParams.get('method'); // 'visio' ou 'store'
  const [storeInfo, setStoreInfo] = useState<StoreInfo | null>(null);

  useEffect(() => {
    if (method === 'store') {
      const stored = localStorage.getItem('selected_store');
      if (stored) {
        setStoreInfo(JSON.parse(stored));
      }
    }
  }, [method]);

  const handleFinish = () => {
    // Nettoyer le localStorage
    localStorage.removeItem('diagnostic_data');
    localStorage.removeItem('selected_store');
    localStorage.removeItem('session_id');

    // Retour à l'accueil
    navigate('/');
  };

  if (method === 'visio') {
    return (
      <MobileLayout title="Confirmation">
        <div className="flex flex-col h-full p-4">
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <div className="text-8xl mb-6 animate-bounce">?</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Visio terminée avec succès !
            </h2>
            <p className="text-gray-600 mb-8">
              Nous espérons que votre problème a été résolu
            </p>

            <Card className="p-6 mb-6 w-full bg-green-50 border-green-200">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <span>?</span>
                <span>Conseils pour éviter les pannes</span>
              </h3>
              <ul className="space-y-2 text-sm text-gray-700 text-left">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">?</span>
                  <span>Nettoyez régulièrement les ports de charge</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">?</span>
                  <span>Évitez les températures extrêmes</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">?</span>
                  <span>Utilisez une coque de protection</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">?</span>
                  <span>Maintenez vos logiciels à jour</span>
                </li>
              </ul>
            </Card>
          </div>

          <Button
            onClick={handleFinish}
            className="w-full h-12 bg-blue-600 hover:bg-blue-700 active:scale-95 transition-transform"
          >
            Retour à l'accueil
          </Button>
        </div>
      </MobileLayout>
    );
  }

  if (method === 'store' && storeInfo) {
    return (
      <MobileLayout title="Confirmation">
        <div className="flex flex-col h-full p-4">
          <div className="mb-6 text-center">
            <div className="text-8xl mb-6">?</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Rendez-vous confirmé !
            </h2>
            <p className="text-gray-600">
              Vous recevrez un SMS de confirmation sous peu
            </p>
          </div>

          <Card className="p-6 mb-6">
            <h3 className="font-semibold text-gray-900 mb-4">
              Détails du rendez-vous
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500 mb-1">Atelier</p>
                <p className="font-medium text-gray-900">{storeInfo.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Adresse</p>
                <p className="text-gray-900">{storeInfo.address}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Distance</p>
                <p className="text-gray-900">{storeInfo.distance}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Disponibilité</p>
                <p className="text-green-600 font-medium">
                  {storeInfo.availability}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6 mb-6 bg-blue-50 border-blue-200">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <span>?</span>
              <span>À apporter</span>
            </h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">?</span>
                <span>Votre appareil en panne</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">?</span>
                <span>Chargeur et accessoires</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">?</span>
                <span>Pièce d'identité</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">?</span>
                <span>Preuve d'achat si sous garantie</span>
              </li>
            </ul>
          </Card>

          <Button
            onClick={handleFinish}
            className="w-full h-12 bg-blue-600 hover:bg-blue-700 active:scale-95 transition-transform"
          >
            Retour à l'accueil
          </Button>
        </div>
      </MobileLayout>
    );
  }

  // Fallback si pas de méthode ou erreur
  return (
    <MobileLayout title="Confirmation">
      <div className="flex flex-col h-full p-4 items-center justify-center">
        <div className="text-6xl mb-4">?</div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Erreur de confirmation
        </h2>
        <Button
          onClick={() => navigate('/')}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Retour à l'accueil
        </Button>
      </div>
    </MobileLayout>
  );
}

