import { MobileLayout } from '@/components/layouts/MobileLayout';

export default function AppointmentsPage() {
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

