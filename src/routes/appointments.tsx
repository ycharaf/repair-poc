import { useState, useEffect } from 'react';
import { MobileLayout } from '@/components/layouts/MobileLayout';
import { Card } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';

interface Appointment {
  id: string;
  type: string;
  status: string;
  visio_link?: string;
  scheduled_at: string;
  created_at: string;
  diagnostic: {
    appareil: string;
    modele: string;
    symptome: string;
  };
  store?: {
    name: string;
    address: string;
    city: string;
    postal_code: string;
  };
}

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAppointments = async () => {
      try {
        // Pour l'instant, on récupère tous les rendez-vous récents
        // À terme, filtrer par user_email quand l'authentification sera implémentée
        const { data, error } = await supabase
          .from('appointments')
          .select(`
            *,
            diagnostic:diagnostics(*),
            store:stores(*)
          `)
          .order('created_at', { ascending: false })
          .limit(10);

        if (data && !error) {
          setAppointments(data);
        } else {
          console.error('Erreur chargement rendez-vous:', error);
        }
      } catch (error) {
        console.error('Erreur Supabase:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAppointments();
  }, []);

  if (loading) {
    return (
      <MobileLayout title="Rendez-vous">
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="text-4xl mb-4 animate-pulse">⏳</div>
            <p className="text-gray-600">Chargement...</p>
          </div>
        </div>
      </MobileLayout>
    );
  }

  if (appointments.length === 0) {
    return (
      <MobileLayout title="Rendez-vous">
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="text-6xl mb-4">📅</div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            Aucun rendez-vous
          </h2>
          <p className="text-sm text-gray-600 max-w-xs">
            Vous n'avez pas encore de rendez-vous de réparation prévu
          </p>
        </div>
      </MobileLayout>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirme':
        return 'bg-green-100 text-green-800';
      case 'en_attente':
        return 'bg-yellow-100 text-yellow-800';
      case 'termine':
        return 'bg-gray-100 text-gray-800';
      case 'annule':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'confirme':
        return 'Confirmé';
      case 'en_attente':
        return 'En attente';
      case 'termine':
        return 'Terminé';
      case 'annule':
        return 'Annulé';
      default:
        return status;
    }
  };

  return (
    <MobileLayout title="Rendez-vous">
      <div className="flex flex-col h-full p-4">
        <div className="mb-4">
          <h2 className="text-xl font-bold text-gray-900">Vos rendez-vous</h2>
          <p className="text-sm text-gray-600">Historique de vos réparations</p>
        </div>

        <div className="space-y-4">
          {appointments.map((appointment) => (
            <Card key={appointment.id} className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">
                    {appointment.type === 'visio' ? '🎥' : '🏪'}
                  </span>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {appointment.type === 'visio' ? 'Visio' : appointment.store?.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {new Date(appointment.created_at).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(appointment.status)}`}>
                  {getStatusLabel(appointment.status)}
                </span>
              </div>

              {appointment.diagnostic && (
                <div className="space-y-1 text-sm text-gray-700 mb-3">
                  <p><strong>Appareil:</strong> {appointment.diagnostic.appareil}</p>
                  {appointment.diagnostic.modele && (
                    <p><strong>Modèle:</strong> {appointment.diagnostic.modele}</p>
                  )}
                  <p><strong>Problème:</strong> {appointment.diagnostic.symptome}</p>
                </div>
              )}

              {appointment.type === 'store' && appointment.store && (
                <div className="text-sm text-gray-600 mt-2 pt-2 border-t">
                  <p>📍 {appointment.store.address}, {appointment.store.postal_code} {appointment.store.city}</p>
                </div>
              )}

              {appointment.type === 'visio' && appointment.visio_link && (
                <div className="mt-2 pt-2 border-t">
                  <a
                    href={appointment.visio_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline"
                  >
                    🔗 Lien de visio
                  </a>
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>
    </MobileLayout>
  );
}

