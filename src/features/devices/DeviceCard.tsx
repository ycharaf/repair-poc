import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface DeviceCardProps {
  id: string;
  nom: string;
  marque: string;
  type: string;
  image_url?: string;
  onSelect: (id: string) => void;
}

export function DeviceCard({ id, nom, marque, type, onSelect }: DeviceCardProps) {
  return (
    <Card
      className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
      onClick={() => onSelect(id)}
    >
      <div className="flex flex-col h-full">
        <div className="text-5xl mb-4">?</div>
        <h3 className="font-semibold text-lg mb-1">{nom}</h3>
        <p className="text-sm text-gray-600 mb-1">{marque}</p>
        <p className="text-xs text-gray-500 mb-4">{type}</p>
        <Button className="mt-auto" variant="outline">
          Sélectionner
        </Button>
      </div>
    </Card>
  );
}

