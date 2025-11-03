import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { EstimationCard } from '@/features/estimation/EstimationCard';

interface Estimation {
  priceMin: number;
  priceMax: number;
  delayMin: number;
  delayMax: number;
  deviceName: string;
}

export default function EstimationPage() {
  const { deviceId } = useParams();
  const navigate = useNavigate();
  const [estimation, setEstimation] = useState<Estimation | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEstimation();
  }, [deviceId]);

  async function fetchEstimation() {
    try {
      const { data, error } = await supabase
        .from('estimations')
        .select('*')
        .eq('appareil_id', deviceId)
        .single();

      if (error || !data) {
        console.error('Error fetching estimation:', error);
        setEstimation(null);
      } else {
        setEstimation({
          priceMin: data.prix_min,
          priceMax: data.prix_max,
          delayMin: data.delai_min,
          delayMax: data.delai_max,
          deviceName: data.appareil_nom || 'Appareil sélectionné',
        });
      }
    } catch (err) {
      console.error('Error:', err);
      setEstimation(null);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">Calcul de l'estimation...</div>
      </div>
    );
  }

  if (!estimation) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="max-w-md text-center">
          <div className="text-xl text-gray-600 mb-4">Estimation non disponible</div>
          <p className="text-sm text-gray-500 mb-6">
            Aucune estimation n'a été trouvée pour cet appareil
          </p>
          <Button onClick={() => navigate('/devices')}>
            Retour aux appareils
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-2">Estimation de réparation</h1>
          <p className="text-gray-600 mb-8">{estimation.deviceName}</p>

          <EstimationCard
            priceMin={estimation.priceMin}
            priceMax={estimation.priceMax}
            delayMin={estimation.delayMin}
            delayMax={estimation.delayMax}
          />

          <Card className="p-6 mb-6">
            <h3 className="font-semibold text-lg mb-4">Ce qui est inclus</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <span className="text-green-600 mr-2">✓</span>
                <span>Diagnostic complet de l'appareil</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">✓</span>
                <span>Remplacement des pièces défectueuses</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">✓</span>
                <span>Garantie sur la réparation (3-12 mois)</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">✓</span>
                <span>Support après-réparation</span>
              </li>
            </ul>
          </Card>

          <div className="flex gap-4">
            <Button variant="outline" onClick={() => navigate('/devices')}>
              Retour
            </Button>
            <Button 
              className="flex-1"
              onClick={() => navigate(`/repairers/${deviceId}`)}
            >
              Comparer les réparateurs
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
