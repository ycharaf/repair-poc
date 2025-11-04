import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { MobileLayout } from '@/components/layouts/MobileLayout';

type TabOption = 'partnerStore' | 'locker';

interface Store {
  id: string;
  name: string;
  hours: string;
  logoColor: string;
}

const STORES: Store[] = [
  {
    id: '1',
    name: 'Leroy Merlin Lesquin',
    hours: 'Lundi-Dim : 9h00-20h00',
    logoColor: 'bg-green-500',
  },
  {
    id: '2',
    name: 'Decathlon Villeneuve D\'Ascq',
    hours: 'Lundi-Sam : 9h30-19h30',
    logoColor: 'bg-blue-500',
  },
];

export default function KeyDropLocationPage() {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState<TabOption>('partnerStore');
  const [selectedStore, setSelectedStore] = useState<string | null>(null);
  const [address, setAddress] = useState('');

  const handleConfirm = () => {
    // Pour l'instant, navigation vers une page de paiement (à créer)
    console.log('Confirmation', { selectedTab, selectedStore, address });
    // navigate('/payment'); // À implémenter plus tard
  };

  return (
    <MobileLayout title="Choix du lieu de dépôt des clés">
      <div className="flex flex-col h-full bg-[#F8F8FF]">
        {/* Segmented Control */}
        <div className="p-4 bg-white border-b border-gray-200">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setSelectedTab('partnerStore')}
              className={`flex-1 py-3 px-4 text-sm font-medium rounded-md transition-all ${
                selectedTab === 'partnerStore'
                  ? 'bg-[#6200EE] text-white shadow-md'
                  : 'bg-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Enseigne partenaire
            </button>
            <button
              onClick={() => setSelectedTab('locker')}
              className={`flex-1 py-3 px-4 text-sm font-medium rounded-md transition-all ${
                selectedTab === 'locker'
                  ? 'bg-[#6200EE] text-white shadow-md'
                  : 'bg-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Locker sécurisé
            </button>
          </div>
        </div>

        {/* Contenu scrollable */}
        <div className="flex-1 overflow-y-auto p-4 pb-4 space-y-4">
          {/* Carte (Image statique) */}
          <div className="w-full">
            <img
              src="/image/map_lille.jpg"
              alt="Carte de Lille"
              className="w-full h-48 object-cover rounded-lg shadow-md"
              onError={(e) => {
                // Fallback si l'image n'existe pas
                e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="200"%3E%3Crect fill="%23e5e7eb" width="400" height="200"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" fill="%239ca3af" font-family="sans-serif" font-size="16"%3ECarte de Lille%3C/text%3E%3C/svg%3E';
              }}
            />
          </div>

          {/* Champ Adresse */}
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
              Saisissez votre adresse
            </label>
            <Input
              id="address"
              type="text"
              placeholder="18 place Leclerc, 59800, Lille"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full"
            />
          </div>

          {/* Liste des magasins (si tab = partnerStore) */}
          {selectedTab === 'partnerStore' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Les magasins les plus proches de chez vous
              </h3>

              <div className="space-y-3">
                {STORES.map((store) => (
                  <Card
                    key={store.id}
                    className={`cursor-pointer transition-all ${
                      selectedStore === store.id
                        ? 'border-2 border-[#6200EE] shadow-lg'
                        : 'border border-gray-200 hover:border-[#6200EE]/50'
                    }`}
                    onClick={() => setSelectedStore(store.id)}
                  >
                    <div className="p-4 flex items-center justify-between">
                      {/* Logo + Textes */}
                      <div className="flex items-center gap-3 flex-1">
                        {/* Logo placeholder (cercle coloré) */}
                        <div
                          className={`w-12 h-12 rounded-full ${store.logoColor} flex-shrink-0`}
                        ></div>

                        {/* Infos magasin */}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-900 mb-1">
                            {store.name}
                          </h4>
                          <p className="text-sm text-gray-600">{store.hours}</p>
                        </div>
                      </div>

                      {/* Chevron */}
                      <svg
                        className="w-5 h-5 text-gray-400 flex-shrink-0 ml-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Lien "Voir plus de magasins" */}
              <div className="flex justify-end">
                <button className="text-sm font-bold text-[#6200EE] underline hover:text-[#4A00B8]">
                  Voir plus de magasins +
                </button>
              </div>
            </div>
          )}

          {/* Message pour les lockers (quand tab = locker) */}
          {selectedTab === 'locker' && (
            <div className="bg-white rounded-lg p-6 text-center">
              <div className="text-4xl mb-4">🔐</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Lockers sécurisés
              </h3>
              <p className="text-sm text-gray-600">
                Les lockers sécurisés seront bientôt disponibles dans votre région.
              </p>
            </div>
          )}

          {/* Footer CTA */}
          <div className="mt-6 pb-4">
            <Button
              onClick={handleConfirm}
              className="w-full h-14 bg-[#6200EE] hover:bg-[#4A00B8] text-white font-bold rounded-lg text-base shadow-lg active:scale-95 transition-transform"
            >
              Confirmer et passer au paiement (50€)
            </Button>
          </div>
        </div>
      </div>
    </MobileLayout>
  );
}

