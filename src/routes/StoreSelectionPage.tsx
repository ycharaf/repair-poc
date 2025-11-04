import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { MobileLayout } from '@/components/layouts/MobileLayout';
import { supabase } from '@/lib/supabase';

interface Store {
  id: string;
  name: string;
  address: string;
  city: string;
  postal_code: string;
  distance?: string;
  rating: number;
  phone?: string;
  availability?: string;
}

export default function StoreSelectionPage() {
  const navigate = useNavigate();
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);

  // Charger les magasins depuis Supabase
  useEffect(() => {
    const loadStores = async () => {
      try {
        const { data, error } = await supabase
          .from('stores')
          .select('*')
          .eq('is_active', true)
          .order('name');

        if (data && !error) {
          // Ajouter des informations temporaires de disponibilité et distance
          const storesWithInfo = data.map((store, index) => ({
            ...store,
            distance: index === 0 ? '5 min' : index === 1 ? '12 min' : '15 min',
            availability: index === 0 ? 'aujourd\'hui' : index === 1 ? 'demain' : 'après-demain'
          }));
          setStores(storesWithInfo);
        } else {
          console.error('Erreur chargement magasins:', error);
        }
      } catch (error) {
        console.error('Erreur Supabase:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStores();
  }, []);

  const handleSelectStore = async (store: Store) => {
    setSelectedStore(store);
    // Sauvegarder le magasin sélectionné
    localStorage.setItem('selected_store', JSON.stringify(store));

    // Créer le rendez-vous en statut "en_attente"
    const diagnosticId = localStorage.getItem('diagnostic_id');
    if (diagnosticId) {
      try {
        const { data, error } = await supabase
          .from('appointments')
          .insert({
            diagnostic_id: diagnosticId,
            store_id: store.id,
            type: 'store',
            status: 'en_attente'
          })
          .select()
          .single();

        if (data && !error) {
          localStorage.setItem('appointment_id', data.id);
        }
      } catch (error) {
        console.error('Erreur création rendez-vous:', error);
      }
    }
  };

  const handleConfirm = async () => {
    if (selectedStore) {
      // Mettre à jour le statut du rendez-vous
      const appointmentId = localStorage.getItem('appointment_id');
      if (appointmentId) {
        try {
          await supabase
            .from('appointments')
            .update({ status: 'confirme' })
            .eq('id', appointmentId);
        } catch (error) {
          console.error('Erreur confirmation rendez-vous:', error);
        }
      }
      navigate('/confirmation?method=store');
    }
  };

  if (loading) {
    return (
      <MobileLayout title="Choisir un magasin">
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="text-4xl mb-4 animate-pulse">⏳</div>
            <p className="text-gray-600">Chargement des ateliers...</p>
          </div>
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout title="Choisir un magasin">
      <div className="flex flex-col h-full p-4">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Ateliers partenaires
          </h2>
          <p className="text-gray-600">
            Sélectionnez un atelier près de chez vous
          </p>
        </div>

        <div className="space-y-4 flex-1 overflow-y-auto">
          {stores.map((store) => (
            <Card
              key={store.id}
              className={`p-4 cursor-pointer transition-all ${
                selectedStore?.id === store.id
                  ? 'border-2 border-blue-600 bg-blue-50'
                  : 'border border-gray-200 hover:border-blue-300'
              }`}
              onClick={() => handleSelectStore(store)}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">{store.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">
                    {store.address}, {store.postal_code} {store.city}
                  </p>
                </div>
                {selectedStore?.id === store.id && (
                  <div className="text-blue-600">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1 text-gray-700">
                  <span>📍</span>
                  <span>{store.distance}</span>
                </div>
                <div className="flex items-center gap-1 text-gray-700">
                  <span>⭐</span>
                  <span>{store.rating}</span>
                </div>
                <div className="flex items-center gap-1 text-green-600 font-medium">
                  <span>✓</span>
                  <span>Disponible {store.availability}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-6 space-y-3">
          <Button
            onClick={handleConfirm}
            disabled={!selectedStore}
            className="w-full h-12 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed active:scale-95 transition-transform"
          >
            {selectedStore
              ? `Confirmer - ${selectedStore.name}`
              : 'Sélectionnez un atelier'}
          </Button>

          <Button
            onClick={() => navigate('/appointment/visio')}
            variant="outline"
            className="w-full h-12 border-gray-300 hover:bg-gray-50 active:scale-95 transition-transform"
          >
            Préférer une visio immédiate
          </Button>
        </div>
      </div>
    </MobileLayout>
  );
}

