import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase';
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
                <Card key={repairer.id} className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex flex-col md:flex-row justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-xl">{repairer.nom}</h3>
                        {repairer.verified && (
                          <Badge variant="default" className="bg-green-600">
                            ✓ Vérifié
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                        <span className="flex items-center">
                          ⭐ {repairer.rating.toFixed(1)}
                        </span>
                        <span className="flex items-center">
                          📍 {repairer.distance}
                        </span>
                        <span className="flex items-center">
                          📍 {repairer.localisation}
                        </span>
                      </div>
                      <div className="flex gap-2 mb-3">
                        {repairer.specialites.map((spec, i) => (
                          <Badge key={i} variant="secondary">
                            {spec}
                          </Badge>
                        ))}
                      </div>
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">Garantie:</span> {repairer.garantie_mois} mois
                        <span className="mx-2">•</span>
                        <span className="font-medium">Prix moyen:</span> {repairer.prix_moyen}€
                      </div>
                    </div>
                    <div className="flex flex-col justify-center md:items-end">
                      <Button onClick={() => handleSelectRepairer(repairer.id)}>
                        Sélectionner
                      </Button>
                    </div>
                  </div>
                </Card>
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
