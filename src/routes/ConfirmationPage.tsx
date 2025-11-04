import {useEffect, useState} from 'react';
import {useNavigate, useSearchParams} from 'react-router-dom';
import {Button} from '@/components/ui/button';
import {Card} from '@/components/ui/card';
import {MobileLayout} from '@/components/layouts/MobileLayout';
import {supabase} from '@/lib/supabase';

interface StoreInfo {
    name: string;
    address: string;
    distance: string;
    availability: string;
}

export default function ConfirmationPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const method = searchParams.get('method'); // 'visio' ou 'store'
    const [storeInfo, setStoreInfo] = useState<StoreInfo | null>(null);

    // États pour la page visio
    const [showFullTranscription, setShowFullTranscription] = useState(false);
    const [selectedDiagnostic, setSelectedDiagnostic] = useState('recommended');
    const [selectedOption, setSelectedOption] = useState<string | null>(null);

    useEffect(() => {
        const loadAppointmentData = async () => {
            if (method === 'store') {
                const appointmentId = localStorage.getItem('appointment_id');

                if (appointmentId) {
                    try {
                        // Charger depuis Supabase
                        const {data, error} = await supabase
                            .from('appointments')
                            .select(`
                *,
                diagnostic:diagnostics(*),
                store:stores(*)
              `)
                            .eq('id', appointmentId)
                            .single();

                        if (data && !error && data.store) {
                            // Transformer les données pour correspondre à l'interface StoreInfo
                            const storeData: StoreInfo = {
                                name: data.store.name,
                                address: `${data.store.address}, ${data.store.postal_code} ${data.store.city}`,
                                distance: '5 min', // Valeur par défaut
                                availability: 'aujourd\'hui' // Valeur par défaut
                            };
                            setStoreInfo(storeData);
                        } else {
                            // Fallback vers localStorage
                            const stored = localStorage.getItem('selected_store');
                            if (stored) {
                                setStoreInfo(JSON.parse(stored));
                            }
                        }
                    } catch (error) {
                        console.error('Erreur chargement rendez-vous:', error);
                        // Fallback vers localStorage
                        const stored = localStorage.getItem('selected_store');
                        if (stored) {
                            setStoreInfo(JSON.parse(stored));
                        }
                    }
                } else {
                    // Fallback vers localStorage
                    const stored = localStorage.getItem('selected_store');
                    if (stored) {
                        setStoreInfo(JSON.parse(stored));
                    }
                }
            }
        };

        loadAppointmentData();
    }, [method]);

    const handleFinish = async () => {
        // Mettre à jour le statut dans Supabase
        const sessionId = localStorage.getItem('session_id');
        const appointmentId = localStorage.getItem('appointment_id');

        try {
            // Mettre à jour le diagnostic
            if (sessionId) {
                await supabase
                    .from('diagnostics')
                    .update({status: 'termine'})
                    .eq('session_id', sessionId);
            }

            // Mettre à jour le rendez-vous
            if (appointmentId) {
                await supabase
                    .from('appointments')
                    .update({status: 'termine'})
                    .eq('id', appointmentId);
            }
        } catch (error) {
            console.error('Erreur finalisation:', error);
        }

        // Nettoyer le localStorage
        localStorage.removeItem('diagnostic_data');
        localStorage.removeItem('selected_store');
        localStorage.removeItem('session_id');
        localStorage.removeItem('diagnostic_id');
        localStorage.removeItem('appointment_id');

        // Retour à l'accueil
        navigate('/');
    };

    if (method === 'visio') {
        const transcription = "Bonjour, donc, montrez-moi votre chauffe-eau. Je vais avoir besoin que vous me décriviez exactement ce qui ne fonctionne plus : est-ce qu’il ne chauffe plus du tout, chauffe par intermittence, ou fait un bruit inhabituel ?";
        const truncatedTranscription = transcription.split(' ').slice(0, 20).join(' ') + '...';

        const diagnosticOptions = [
            {
                id: 'screen',
                title: 'Organiser la reprise/le recyclage',
                description: 'Un geste simple pour la planète'
            },
            {
                id: 'battery',
                title: 'Acheter un produit neuf',
                description: 'Découvrir nos partenaires éco-responsables'
            },
            {
                id: 'connector',
                title: 'Recevoir un bon d’achat 2nd main',
                description: 'Acheter un produit reconditionné'
            }
        ];

        return (
            <MobileLayout title="Récapitulatif de l'appel">
                <div className="flex flex-col h-full p-4 pb-4 overflow-y-auto">
                    {/* Titre principal */}
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                        Résumé de votre diagnostic
                    </h2>

                    {/* Card Transcription */}
                    <Card className="p-4 mb-6 border-gray-200">
                        <div className="flex items-center gap-2 mb-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                <span className="text-blue-600">🎤</span>
                            </div>
                            <h3 className="font-semibold text-gray-900">Transcription de l'appel</h3>
                        </div>
                        <p className={`text-sm text-gray-700 leading-relaxed ${!showFullTranscription ? 'line-clamp-2' : ''}`}>
                            {showFullTranscription ? transcription : truncatedTranscription}
                        </p>
                        <button
                            onClick={() => setShowFullTranscription(!showFullTranscription)}
                            className="mt-2 text-sm font-bold text-blue-600 underline hover:text-blue-700"
                        >
                            {showFullTranscription ? 'Voir moins' : 'Voir plus'}
                        </button>
                    </Card>

                    {/* Card Diagnostic Recommandé (Sélectionné) */}
                    <Card
                        className={`p-4 mb-6 cursor-pointer transition-all ${
                            selectedDiagnostic === 'recommended'
                                ? 'border-2 border-blue-600 bg-blue-50'
                                : 'border-gray-200 hover:border-blue-300'
                        }`}
                        onClick={() => setSelectedDiagnostic('recommended')}
                    >
                        <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                                <h3 className="font-semibold text-gray-900 mb-1">
                                    Diagnostic recommandé
                                </h3>
                                <p className="text-sm text-gray-600">
                                    Basé sur votre description et notre expertise
                                </p>
                            </div>
                            {selectedDiagnostic === 'recommended' && (
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

                        {/* Applat gris avec détails */}
                        <div className="bg-gray-100 rounded-lg p-3">
                            <div className="flex items-start gap-2">
                <span className="inline-block px-2 py-1 text-xs font-semibold text-blue-600 bg-blue-100 rounded">
                  Recommandé
                </span>
                            </div>
                            <h4 className="font-semibold text-gray-900 mt-2 mb-1">
                                Votre produit est réparable !
                            </h4>
                            <p className="text-sm text-gray-600">
                                Réparer ce produit c’est jusqu’à 5x moins d’émissions de CO₂ qu’un remplacement.
                            </p>
                        </div>
                    </Card>

                    {/* Autres diagnostics possibles */}
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Autres diagnostics possibles
                    </h3>

                    <div className="space-y-3 mb-6">
                        {diagnosticOptions.map((option) => (
                            <Card
                                key={option.id}
                                className={`p-4 cursor-pointer transition-all ${
                                    selectedOption === option.id
                                        ? 'border-2 border-blue-600 bg-blue-50'
                                        : 'border-gray-200 hover:border-blue-300'
                                }`}
                                onClick={() => setSelectedOption(option.id)}
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-semibold text-gray-900 mb-1 truncate">
                                            {option.title}
                                        </h4>
                                        <p className="text-sm text-gray-600 truncate">
                                            {option.description}
                                        </p>
                                    </div>
                                    <div className="flex-shrink-0 pt-1">
                                        <div
                                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                                selectedOption === option.id
                                                    ? 'border-blue-600 bg-blue-600'
                                                    : 'border-gray-300'
                                            }`}>
                                            {selectedOption === option.id && (
                                                <div className="w-2 h-2 bg-white rounded-full"></div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>

                    {/* Bouton en bas du contenu */}
                    <div className="mt-6">
                        <Button
                            onClick={() => navigate('/quote-intervention')}
                            className="w-full h-12 bg-blue-600 hover:bg-blue-700 active:scale-95 transition-transform"
                        >
                            Continuer vers le devis
                        </Button>
                    </div>
                </div>
            </MobileLayout>
        );
    }
    if (method === 'store' && storeInfo) {
        return (
            <MobileLayout title="Confirmation">
                <div className="flex flex-col h-full p-4">
                    <div className="mb-6 text-center">
                        <div className="text-8xl mb-6">✅</div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-3">
                            Rendez-vous confirmé !
                        </h2>
                        <p className="text-gray-600">
                            Vous recevrez un SMS de confirmation sous peu
                        </p>
                    </div>

                    <Card className="p-6 mb-6">
                        <h3 className="font-semibold text-gray-900 mb-4">
                            Détails du rendez-vous
                        </h3>
                        <div className="space-y-3">
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Atelier</p>
                                <p className="font-medium text-gray-900">{storeInfo.name}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Adresse</p>
                                <p className="text-gray-900">{storeInfo.address}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Distance</p>
                                <p className="text-gray-900">{storeInfo.distance}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Disponibilité</p>
                                <p className="text-green-600 font-medium">
                                    {storeInfo.availability}
                                </p>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6 mb-6 bg-blue-50 border-blue-200">
                        <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            <span>📋</span>
                            <span>À apporter</span>
                        </h3>
                        <ul className="space-y-2 text-sm text-gray-700">
                            <li className="flex items-start gap-2">
                                <span className="text-blue-600 mt-0.5">✓</span>
                                <span>Votre appareil en panne</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-blue-600 mt-0.5">✓</span>
                                <span>Chargeur et accessoires</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-blue-600 mt-0.5">✓</span>
                                <span>Pièce d'identité</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-blue-600 mt-0.5">✓</span>
                                <span>Preuve d'achat si sous garantie</span>
                            </li>
                        </ul>
                    </Card>

                    <Button
                        onClick={handleFinish}
                        className="w-full h-12 bg-blue-600 hover:bg-blue-700 active:scale-95 transition-transform"
                    >
                        Retour à l'accueil
                    </Button>
                </div>
            </MobileLayout>
        );
    }

    // Fallback si pas de méthode ou erreur
    return (
        <MobileLayout title="Confirmation">
            <div className="flex flex-col h-full p-4 items-center justify-center">
                <div className="text-6xl mb-4">❌</div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                    Erreur de confirmation
                </h2>
                <Button
                    onClick={() => navigate('/')}
                    className="bg-blue-600 hover:bg-blue-700"
                >
                    Retour à l'accueil
                </Button>
            </div>
        </MobileLayout>
    );
}

