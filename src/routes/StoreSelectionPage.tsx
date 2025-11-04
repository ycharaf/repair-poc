import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { MobileLayout } from '@/components/layouts/MobileLayout';

interface Store {
  id: string;
  name: string;
  address: string;
  distance: string;
  rating: number;
  availability: string;
}

const STORES: Store[] = [
  {
    id: '1',
    name: 'Save République',
    address: '12 Rue du Temple, 75003 Paris',
    distance: '5 min',
    rating: 4.6,
    availability: 'aujourd\'hui',
  },
  {
    id: '2',
    name: 'Atelier Mobile Plus',
    address: '45 Boulevard Voltaire, 75011 Paris',
    distance: '12 min',
    rating: 4.8,
    availability: 'demain',
  },
  {
    id: '3',
    name: 'Repair Center Paris',
    address: '8 Avenue de la République, 75011 Paris',
    distance: '15 min',
    rating: 4.5,
    availability: 'après-demain',
  },
];

export default function StoreSelectionPage() {
  const navigate = useNavigate();
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);

  const handleSelectStore = (store: Store) => {
    setSelectedStore(store);
    // Sauvegarder le magasin sélectionné
    localStorage.setItem('selected_store', JSON.stringify(store));
  };

  const handleConfirm = () => {
    if (selectedStore) {
      navigate('/confirmation?method=store');
    }
  };

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
          {STORES.map((store) => (
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
                  <p className="text-sm text-gray-600 mb-2">{store.address}</p>
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
                  <span>?</span>
                  <span>{store.distance}</span>
                </div>
                <div className="flex items-center gap-1 text-gray-700">
                  <span>?</span>
                  <span>{store.rating}</span>
                </div>
                <div className="flex items-center gap-1 text-green-600 font-medium">
                  <span>?</span>
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

