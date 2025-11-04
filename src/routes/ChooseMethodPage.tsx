import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { MobileLayout } from '@/components/layouts/MobileLayout';
export default function ChooseMethodPage() {
  const navigate = useNavigate();
  return (
    <MobileLayout title="Choisir une méthode">
      <div className="flex flex-col h-full p-4">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Comment souhaitez-vous procéder ?
          </h2>
          <p className="text-gray-600">
            Choisissez la méthode qui vous convient le mieux
          </p>
        </div>
        <div className="space-y-4 flex-1">
          {/* Option Visio - Recommandée */}
          <Card className="p-6 border-2 border-blue-600 bg-blue-50">
            <div className="flex items-start justify-between mb-4">
              <div className="text-4xl">🎥</div>
              <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                Recommandé
              </span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Visio immédiate
            </h3>
            <p className="text-gray-700 mb-4">
              Connectez-vous avec un technicien maintenant
            </p>
            <ul className="space-y-2 mb-6">
              <li className="flex items-center gap-2 text-sm text-gray-700">
                <span className="text-green-600">✓</span>
                <span>Sans déplacement</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-700">
                <span className="text-green-600">✓</span>
                <span>Sans créer de compte</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-700">
                <span className="text-green-600">✓</span>
                <span>Résolution immédiate possible</span>
              </li>
            </ul>
            <Button
              onClick={() => navigate('/appointment/visio')}
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 active:scale-95 transition-transform"
            >
              Commencer la visio
            </Button>
          </Card>
          {/* Option Magasin */}
          <Card className="p-6 border border-gray-200">
            <div className="text-4xl mb-4">🏪</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Rendez-vous en magasin
            </h3>
            <p className="text-gray-700 mb-4">
              Prenez rendez-vous dans un de nos ateliers partenaires
            </p>
            <ul className="space-y-2 mb-6">
              <li className="flex items-center gap-2 text-sm text-gray-700">
                <span className="text-green-600">✓</span>
                <span>Intervention professionnelle</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-700">
                <span className="text-green-600">✓</span>
                <span>Réparateurs certifiés</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-700">
                <span className="text-green-600">✓</span>
                <span>Garantie sur les réparations</span>
              </li>
            </ul>
            <Button
              onClick={() => navigate('/appointment/store')}
              variant="outline"
              className="w-full h-12 border-gray-300 hover:bg-gray-50 active:scale-95 transition-transform"
            >
              Voir les magasins
            </Button>
          </Card>
        </div>
      </div>
    </MobileLayout>
  );
}
