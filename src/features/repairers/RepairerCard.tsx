import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface RepairerCardProps {
  id: string;
  nom: string;
  rating: number;
  verified: boolean;
  distance: string;
  localisation: string;
  specialites: string[];
  garantie_mois: number;
  prix_moyen: number;
  onSelect: (id: string) => void;
}

export function RepairerCard({
  id,
  nom,
  rating,
  verified,
  distance,
  localisation,
  specialites,
  garantie_mois,
  prix_moyen,
  onSelect,
}: RepairerCardProps) {
  return (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-semibold text-xl">{nom}</h3>
            {verified && (
              <Badge variant="default" className="bg-green-600">
                ? Vérifié
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
            <span className="flex items-center">
              ? {rating.toFixed(1)}
            </span>
            <span className="flex items-center">
              ? {distance}
            </span>
            <span className="flex items-center">
              ? {localisation}
            </span>
          </div>

          <div className="flex gap-2 mb-3">
            {specialites.map((spec, i) => (
              <Badge key={i} variant="secondary">
                {spec}
              </Badge>
            ))}
          </div>

          <div className="text-sm text-gray-600">
            <span className="font-medium">Garantie:</span> {garantie_mois} mois
            <span className="mx-2"></span>
            <span className="font-medium">Prix moyen:</span> {prix_moyen}
          </div>
        </div>

        <div className="flex flex-col justify-center md:items-end">
          <Button onClick={() => onSelect(id)}>
            Sélectionner
          </Button>
        </div>
      </div>
    </Card>
  );
}

