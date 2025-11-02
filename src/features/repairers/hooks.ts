import { supabase } from '@/lib/supabase';

export interface Repairer {
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

export async function getRepairers(): Promise<Repairer[]> {
  const { data, error } = await supabase
    .from('profils')
    .select('id, nom, rating, verified, localisation, specialites, garantie_mois, prix_moyen')
    .eq('role', 'reparateur');

  if (error) {
    console.error('Error fetching repairers:', error);
    throw error;
  }

  // Map data and add calculated distance
  return (data || []).map(repairer => ({
    ...repairer,
    distance: calculateDistance(repairer.localisation),
  }));
}

export function calculateDistance(location: string): string {
  // This would use a real geolocation API in production
  const distances = ['0.5 km', '1.2 km', '2.8 km', '3.5 km', '5.0 km'];
  return distances[Math.floor(Math.random() * distances.length)];
}

