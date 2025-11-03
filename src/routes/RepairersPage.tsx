import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { RepairerCard } from '@/features/repairers/RepairerCard';

interface Repairer {
  id: string;
  nom: string;
  rating: number;
  verified: boolean;
  distance: string;
  localisation: string;
  specialites: string[];
  garantie_mois: number;
  prix_moyen: number;
}

export default function RepairersPage() {
  const { deviceId } = useParams();
  const navigate = useNavigate();
  const [repairers, setRepairers] = useState<Repairer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRepairers();
  }, []);

  async function fetchRepairers() {
    try {
      const { data, error } = await supabase
        .from('profils')
        .select('id, nom, rating, verified, localisation, specialites, garantie_mois, prix_moyen')
        .eq('role', 'reparateur')
        .eq('verified', true)
        .order('rating', { ascending: false });

      if (error) {
        console.error('Error fetching repairers:', error);
        setRepairers([]);
      } else {
        setRepairers((data || []).map(r => ({
          ...r,
          distance: calculateDistance(r.localisation),
        })));
      }
    } catch (err) {
      console.error('Error:', err);
      setRepairers([]);
    } finally {
      setLoading(false);
    }
  }

  function calculateDistance(_location: string): string {
    // This would use a real geolocation API in production
    const distances = ['0.5 km', '1.2 km', '2.8 km', '3.5 km', '5.0 km'];
    return distances[Math.floor(Math.random() * distances.length)];
  }

  async function handleSelectRepairer(repairerId: string) {
    try {
      // Get device info
      const { data: device, error: deviceError } = await supabase
        .from('appareils')
        .select('nom')
        .eq('id', deviceId)
        .single();

      if (deviceError) {
        console.error('Error fetching device:', deviceError);
        alert('Erreur lors de la récupération des informations de l\'appareil');
        return;
      }

      // Get repairer info
      const { data: repairer, error: repairerError } = await supabase
        .from('profils')
        .select('nom')
        .eq('id', repairerId)
        .single();

      if (repairerError) {
        console.error('Error fetching repairer:', repairerError);
        alert('Erreur lors de la récupération des informations du réparateur');
        return;
      }

      // Create repair entry
      const { data: repair, error: repairError } = await supabase
        .from('reparations')
        .insert({
          appareil_id: deviceId,
          reparateur_id: repairerId,
          appareil_nom: device?.nom || 'Appareil',
          reparateur_nom: repairer?.nom || 'Réparateur',
          statut: 'en_attente',
          date_fin_estimee: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
          description_probleme: 'À définir',
        })
        .select()
        .single();

      if (repairError) {
        console.error('Error creating repair:', repairError);
        alert('Erreur lors de la création de la réparation. Veuillez vérifier que l\'authentification est configurée.');
        // Fallback: navigate with mock ID for demo purposes
        const mockRepairId = `repair_${Date.now()}`;
        navigate(`/tracking/${mockRepairId}`, { state: { repairerId, deviceId } });
        return;
      }

      // Navigate to tracking page with real repair ID
      navigate(`/tracking/${repair.id}`);
    } catch (err) {
      console.error('Error:', err);
      alert('Une erreur est survenue');
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">Recherche de réparateurs...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-2">Choisissez votre réparateur</h1>
          <p className="text-gray-600 mb-8">
            Comparez les réparateurs vérifiés près de chez vous
          </p>

          {repairers.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-xl text-gray-600 mb-4">Aucun réparateur disponible pour le moment</p>
              <p className="text-sm text-gray-500 mb-6">
                Veuillez vérifier votre configuration Supabase ou ajouter des réparateurs
              </p>
              <Button variant="outline" onClick={() => navigate(`/estimation/${deviceId}`)}>
                Retour à l'estimation
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {repairers.map((repairer) => (
                <RepairerCard
                  key={repairer.id}
                  id={repairer.id}
                  nom={repairer.nom}
                  rating={repairer.rating}
                  verified={repairer.verified}
                  distance={repairer.distance}
                  localisation={repairer.localisation}
                  specialites={repairer.specialites}
                  garantie_mois={repairer.garantie_mois}
                  prix_moyen={repairer.prix_moyen}
                  onSelect={handleSelectRepairer}
                />
              ))}
            </div>
          )}

          <div className="mt-6">
            <Button variant="outline" onClick={() => navigate(`/estimation/${deviceId}`)}>
              Retour à l'estimation
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
