import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { MobileLayout } from '@/components/layouts/MobileLayout';

export default function AppointmentConfirmedPage() {
  const navigate = useNavigate();

  const handleViewAppointment = () => {
    // Naviguer vers l'onglet Rendez-vous
    navigate('/appointments');
  };

  return (
    <MobileLayout title="Rendez-vous validé">
      <div className="flex flex-col h-full bg-[#F8F8FF]">
        {/* Contenu principal centré verticalement et horizontalement */}
        <div className="flex-1 flex flex-col items-center justify-center p-6">
          {/* Icône de succès - Checkmark dans cercle violet */}
          <div className="mb-8">
            <div className="relative w-32 h-32 flex items-center justify-center">
              {/* Cercle violet */}
              <svg
                className="w-full h-full"
                viewBox="0 0 120 120"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  cx="60"
                  cy="60"
                  r="55"
                  stroke="#6200EE"
                  strokeWidth="8"
                  fill="none"
                />
                {/* Checkmark blanc */}
                <path
                  d="M35 60 L52 77 L85 44"
                  stroke="#6200EE"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
              </svg>
            </div>
          </div>

          {/* Titre principal */}
          <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            C'est confirmé !
          </h1>

          {/* Message descriptif */}
          <p className="text-base text-gray-700 text-center leading-relaxed max-w-md px-4">
            Il ne vous reste plus qu'à déposer vos clés dans le magasin partenaire de votre choix.
            Besoin de changer la date ? Gérez tout depuis la partie "Rendez-vous".
          </p>
        </div>

        {/* Bouton d'action en bas */}
        <div className="p-6 pb-4">
          <Button
            onClick={handleViewAppointment}
            className="w-full h-14 bg-[#6200EE] hover:bg-[#4A00B8] text-white font-bold rounded-full text-base shadow-lg active:scale-95 transition-transform flex items-center justify-center gap-3"
          >
            {/* Icône calendrier */}
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            Voir mon rendez-vous
          </Button>
        </div>
      </div>
    </MobileLayout>
  );
}

