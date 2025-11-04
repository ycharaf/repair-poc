import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { MobileLayout } from '@/components/layouts/MobileLayout';

type SortOption = 'fastest' | 'cheapest' | 'best-rated';
type InterventionType = 'concierge' | 'home';

interface InterventionOption {
  id: InterventionType;
  title: string;
  description: string;
  tag?: string;
  availability: string;
  repairer: {
    name: string;
    rating: number;
    reviews: number;
    avatar: string;
  };
  price: {
    old: number;
    new: number;
  };
}

export default function QuoteInterventionPage() {
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState<SortOption>('fastest');
  const [selectedIntervention, setSelectedIntervention] = useState<InterventionType>('concierge');

  const interventions: InterventionOption[] = [
    {
      id: 'concierge',
      title: 'La conciergerie',
      description:
        "Vous n'avez pas besoin d'être présent. Déposez vos clés dans un point partenaire (ex. Leroy Merlin) ou dans un casier sécurisé. Le technicien intervient dès qu'un créneau est disponible.",
      tag: 'Flexibilité horaire totale',
      availability: 'Dès aujourd\'hui',
      repairer: {
        name: 'Oscar M.',
        rating: 5,
        reviews: 98,
        avatar: '👨‍🔧',
      },
      price: {
        old: 79,
        new: 50,
      },
    },
    {
      id: 'home',
      title: 'Intervention à domicile',
      description:
        'Choisissez un créneau horaire pour que le technicien intervienne à votre domicile.',
      availability: 'Après-demain',
      repairer: {
        name: 'Oscar M.',
        rating: 5,
        reviews: 98,
        avatar: '👨‍🔧',
      },
      price: {
        old: 79,
        new: 50,
      },
    },
  ];

  const handleValidate = () => {
    // Sauvegarder le choix
    localStorage.setItem('selected_intervention', selectedIntervention);
    // Naviguer vers la page de choix de lieu de dépôt des clés
    navigate('/key-drop-location');
  };

  return (
    <MobileLayout title="Devis et intervention">
      <div className="flex flex-col h-full">
        {/* Segmented Control */}
        <div className="p-4 bg-white border-b border-gray-200">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setSortBy('fastest')}
              className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-all ${
                sortBy === 'fastest'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Plus rapide
            </button>
            <button
              onClick={() => setSortBy('cheapest')}
              className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-all ${
                sortBy === 'cheapest'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Moins cher
            </button>
            <button
              onClick={() => setSortBy('best-rated')}
              className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-all ${
                sortBy === 'best-rated'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Mieux noté
            </button>
          </div>
        </div>

        {/* Liste des interventions */}
        <div className="flex-1 overflow-y-auto p-4 pb-4 space-y-4">
          {interventions.map((intervention) => (
            <Card
              key={intervention.id}
              className={`cursor-pointer transition-all ${
                selectedIntervention === intervention.id
                  ? 'border-2 border-blue-600 shadow-lg'
                  : 'border border-gray-200 hover:border-blue-300'
              }`}
              onClick={() => setSelectedIntervention(intervention.id)}
            >
              {/* ...existing code... */}
              {intervention.tag && (
                <div className="px-4 pt-4 pb-2">
                  <span className="inline-block px-3 py-1 text-xs font-semibold text-blue-600 bg-blue-50 rounded-full">
                    {intervention.tag}
                  </span>
                </div>
              )}

              <div className="p-4">
                {/* ...existing code... */}
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-bold text-gray-900">{intervention.title}</h3>
                  {intervention.id !== 'concierge' && (
                    <div className="flex-shrink-0 pt-1">
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          selectedIntervention === intervention.id
                            ? 'border-blue-600 bg-blue-600'
                            : 'border-gray-300'
                        }`}
                      >
                        {selectedIntervention === intervention.id && (
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <p className="text-sm text-gray-600 mb-3 leading-relaxed">
                  {intervention.description}
                </p>

                <button className="text-sm font-bold text-blue-600 underline hover:text-blue-700 mb-4">
                  En savoir plus +
                </button>

                <div className="bg-gray-50 rounded-lg p-3 mb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 mb-1">
                        {intervention.repairer.name}
                      </p>
                      <div className="flex items-center gap-1 text-sm">
                        <span className="text-yellow-500">⭐</span>
                        <span className="font-medium text-gray-900">
                          {intervention.repairer.rating}
                        </span>
                        <span className="text-gray-600">
                          ({intervention.repairer.reviews} avis)
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-2xl">
                        {intervention.repairer.avatar}
                      </div>
                      <svg
                        className="w-5 h-5 text-gray-400"
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
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="inline-block px-3 py-1 text-xs font-semibold text-green-600 bg-green-50 rounded-full">
                    {intervention.availability}
                  </span>
                  <div className="bg-gray-100 rounded-lg px-3 py-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500 line-through">
                        {intervention.price.old}€
                      </span>
                      <span className="text-lg font-bold text-gray-900">
                        {intervention.price.new}€
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}

          {/* Bouton d'action en bas du contenu */}
          <div className="mt-6 pb-4">
            <Button
              onClick={handleValidate}
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 active:scale-95 transition-transform text-base font-semibold"
            >
              Valider et prendre rendez-vous (
              {interventions.find((i) => i.id === selectedIntervention)?.price.new}€)
            </Button>
          </div>
        </div>
      </div>
    </MobileLayout>
  );
}

