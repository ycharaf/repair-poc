import { supabase } from '@/lib/supabase';

export interface RepairStep {
  id: string;
  label: string;
  status: 'completed' | 'current' | 'pending';
  timestamp?: string;
  description?: string;
}

export interface RepairInfo {
  deviceName: string;
  repairerName: string;
  estimatedCompletion: string;
  currentStatus: string;
}

export async function getRepairStatus(repairId: string): Promise<{ info: RepairInfo; steps: RepairStep[] } | null> {
  const { data, error } = await supabase
    .from('reparations')
    .select('*')
    .eq('id', repairId)
    .single();

  if (error) {
    console.error('Error fetching repair status:', error);
    return null;
  }

  return {
    info: {
      deviceName: data.appareil_nom,
      repairerName: data.reparateur_nom,
      estimatedCompletion: data.date_fin_estimee,
      currentStatus: data.statut,
    },
    steps: generateStepsFromStatus(data.statut),
  };
}

function generateStepsFromStatus(status: string): RepairStep[] {
  // This would be more sophisticated in production
  // For now, return a basic timeline
  return [
    {
      id: '1',
      label: 'Réparation réservée',
      status: 'completed',
      timestamp: 'Aujourd\'hui, 10:30',
      description: 'Votre demande a été confirmée',
    },
    {
      id: '2',
      label: 'Appareil réceptionné',
      status: 'current',
      timestamp: 'En cours',
      description: 'Le réparateur a pris en charge votre appareil',
    },
    {
      id: '3',
      label: 'Diagnostic',
      status: 'pending',
      description: 'Analyse des problèmes détectés',
    },
    {
      id: '4',
      label: 'Réparation',
      status: 'pending',
      description: 'Remplacement des pièces défectueuses',
    },
    {
      id: '5',
      label: 'Prêt à récupérer',
      status: 'pending',
      description: 'Votre appareil est réparé',
    },
  ];
}

