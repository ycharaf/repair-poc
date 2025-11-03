import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { TimelineStep } from '@/features/tracking/TimelineStep';

interface RepairStep {
  id: string;
  label: string;
  status: 'completed' | 'current' | 'pending';
  timestamp?: string;
  description?: string;
}

interface RepairInfo {
  deviceName: string;
  repairerName: string;
  estimatedCompletion: string;
  currentStatus: string;
}

export default function TrackingPage() {
  const { repairId } = useParams();
  const navigate = useNavigate();
  const [steps, setSteps] = useState<RepairStep[]>([]);
  const [repairInfo, setRepairInfo] = useState<RepairInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRepairStatus() {
      try {
        const { data, error } = await supabase
          .from('reparations')
          .select('*')
          .eq('id', repairId)
          .single();

        if (error || !data) {
          console.error('Error fetching repair status:', error);
          setRepairInfo(null);
          setSteps([]);
        } else {
          setRepairInfo({
            deviceName: data.appareil_nom,
            repairerName: data.reparateur_nom,
            estimatedCompletion: formatEstimatedCompletion(data.date_fin_estimee),
            currentStatus: data.statut,
          });
          setSteps(generateStepsFromStatus(data.statut));
        }
      } catch (err) {
        console.error('Error:', err);
        setRepairInfo(null);
        setSteps([]);
      } finally {
        setLoading(false);
      }
    }

    fetchRepairStatus();
  }, [repairId]);

  function formatEstimatedCompletion(dateString: string | null): string {
    if (!dateString) return 'Non défini';

    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Aujourd\'hui';
    if (diffDays === 1) return 'Demain';
    if (diffDays > 1) return `Dans ${diffDays} jours`;
    return 'Date dépassée';
  }

  function generateStepsFromStatus(statut: string): RepairStep[] {
    const allSteps: RepairStep[] = [
      {
        id: '1',
        label: 'Réparation réservée',
        status: 'completed',
        timestamp: 'Réservation confirmée',
        description: 'Votre demande a été confirmée',
      },
      {
        id: '2',
        label: 'Appareil réceptionné',
        status: 'pending',
        description: 'Le réparateur prend en charge votre appareil',
      },
      {
        id: '3',
        label: 'Diagnostic en cours',
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
        label: 'Tests & contrôle qualité',
        status: 'pending',
        description: 'Vérification complète du fonctionnement',
      },
      {
        id: '6',
        label: 'Prêt à récupérer',
        status: 'pending',
        description: 'Votre appareil est réparé',
      },
    ];

    // Update step status based on current status
    const statusMap: { [key: string]: number } = {
      'en_attente': 1,
      'acceptee': 2,
      'en_cours_diagnostic': 3,
      'en_cours_reparation': 4,
      'en_cours_test': 5,
      'terminee': 6,
      'prete_a_recuperer': 6,
      'recuperee': 6,
    };

    const currentStepIndex = statusMap[statut] || 0;

    return allSteps.map((step, index) => {
      if (index < currentStepIndex - 1) {
        return { ...step, status: 'completed' };
      } else if (index === currentStepIndex - 1) {
        return { ...step, status: 'current', timestamp: 'En cours' };
      }
      return step;
    });
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">Chargement du suivi...</div>
      </div>
    );
  }

  if (!repairInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">Réparation introuvable</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-2">Suivi de réparation</h1>
          <p className="text-gray-600 mb-8">Référence: {repairId}</p>

          <Card className="p-6 mb-8">
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <div className="text-sm text-gray-600 mb-1">Appareil</div>
                <div className="font-semibold">{repairInfo.deviceName}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">Réparateur</div>
                <div className="font-semibold">{repairInfo.repairerName}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">Fin estimée</div>
                <div className="font-semibold">{repairInfo.estimatedCompletion}</div>
              </div>
            </div>
          </Card>

          <Card className="p-8">
            <h2 className="text-2xl font-bold mb-6">Progression de la réparation</h2>

            <div className="space-y-8">
              {steps.map((step, index) => (
                <TimelineStep
                  key={step.id}
                  index={index}
                  label={step.label}
                  status={step.status}
                  timestamp={step.timestamp}
                  description={step.description}
                  isLast={index === steps.length - 1}
                />
              ))}
            </div>
          </Card>

          <div className="mt-6 flex gap-4">
            <Button variant="outline" onClick={() => navigate('/')}>
              Retour à l'accueil
            </Button>
            <Button variant="outline" onClick={() => window.location.reload()}>
              Actualiser le statut
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

