import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6 text-gray-900">
            Réparation de confiance, simple et transparente
          </h1>
          <p className="text-xl text-gray-600 mb-12">
            Réparer votre appareil devrait être aussi simple que d'en acheter un nouveau.
            Découvrez une expérience de réparation fluide et digne de confiance.
          </p>

          <Button
            size="lg"
            className="text-lg px-8 py-6"
            onClick={() => navigate('/devices')}
          >
            Commencer ma réparation
          </Button>

          <div className="grid md:grid-cols-3 gap-6 mt-16">
            <Card className="p-6">
              <div className="text-4xl mb-4">?</div>
              <h3 className="font-semibold text-lg mb-2">Estimation claire</h3>
              <p className="text-sm text-gray-600">
                Prix et délais transparents dès le départ
              </p>
            </Card>

            <Card className="p-6">
              <div className="text-4xl mb-4">?</div>
              <h3 className="font-semibold text-lg mb-2">Réparateurs vérifiés</h3>
              <p className="text-sm text-gray-600">
                Comparez les professionnels certifiés près de chez vous
              </p>
            </Card>

            <Card className="p-6">
              <div className="text-4xl mb-4">?</div>
              <h3 className="font-semibold text-lg mb-2">Suivi en temps réel</h3>
              <p className="text-sm text-gray-600">
                Suivez l'avancement de votre réparation étape par étape
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

