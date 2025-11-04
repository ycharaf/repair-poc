import {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {Button} from '@/components/ui/button';
import {Card} from '@/components/ui/card';
import {MobileLayout} from '@/components/layouts/MobileLayout';

export default function VisioPage() {
    const navigate = useNavigate();
    const [isGenerating, setIsGenerating] = useState(true);
    const [meetLink, setMeetLink] = useState('');

    useEffect(() => {
        // Simuler la génération d'un lien Google Meet
        setTimeout(() => {
            const sessionId = crypto.randomUUID().slice(0, 10);
            setMeetLink(`https://meet.google.com/rep-${sessionId}`);
            setIsGenerating(false);
        }, 2000);
    }, []);

    const handleJoinVisio = () => {
        // Ouvrir le lien Meet dans un nouvel onglet
        window.open(meetLink, '_blank');
        // Rediriger vers la confirmation
        setTimeout(() => {
            navigate('/confirmation?method=visio');
        }, 1000);
    };

    return (
        <MobileLayout title="Visio immédiate">
            <div className="flex flex-col h-full p-4">
                {isGenerating ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-center">
                        <div className="text-6xl mb-4 animate-pulse">🎥</div>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">
                            Préparation de votre visio...
                        </h2>
                        <p className="text-gray-600">
                            Génération du lien de connexion sécurisé
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="mb-6">
                            <div className="text-6xl text-center mb-4">✅</div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">
                                Votre visio est prête !
                            </h2>
                            <p className="text-gray-600 text-center">
                                Un technicien va vous rejoindre dans quelques instants
                            </p>
                        </div>

                        <Card className="p-6 mb-6 bg-blue-50 border-blue-200">
                            <h3 className="font-semibold text-gray-900 mb-3">
                                Lien de connexion
                            </h3>
                            <div className="bg-white p-3 rounded-lg border border-blue-200 mb-4">
                                <code className="text-sm text-blue-600 break-all">
                                    {meetLink}
                                </code>
                            </div>
                            <Button
                                onClick={handleJoinVisio}
                                className="w-full h-12 bg-blue-600 hover:bg-blue-700 active:scale-95 transition-transform"
                            >
                                Rejoindre la visio
                            </Button>
                        </Card>

                        <Card className="p-6 mb-6">
                            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                <span>💡</span>
                                <span>Avant de commencer</span>
                            </h3>
                            <ul className="space-y-2 text-sm text-gray-700">
                                <li className="flex items-start gap-2">
                                    <span className="text-green-600 mt-0.5">✓</span>
                                    <span>Vérifiez que votre caméra et micro sont activés</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-green-600 mt-0.5">✓</span>
                                    <span>Assurez-vous d'avoir une bonne connexion internet</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-green-600 mt-0.5">✓</span>
                                    <span>Préparez votre appareil en panne à portée de main</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-green-600 mt-0.5">✓</span>
                                    <span>Le technicien vous guidera étape par étape</span>
                                </li>
                            </ul>
                        </Card>

                        <div className="mt-auto">
                            <Button
                                onClick={() => navigate('/appointment/store')}
                                variant="outline"
                                className="w-full h-12 border-gray-300 hover:bg-gray-50 active:scale-95 transition-transform"
                            >
                                Préférer un rendez-vous en magasin
                            </Button>
                        </div>
                    </>
                )}
            </div>
        </MobileLayout>
    );
}
