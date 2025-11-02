import { Card } from '@/components/ui/card';

interface EstimationCardProps {
  priceMin: number;
  priceMax: number;
  delayMin: number;
  delayMax: number;
}

export function EstimationCard({ priceMin, priceMax, delayMin, delayMax }: EstimationCardProps) {
  return (
    <Card className="p-8">
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <div className="text-sm text-gray-600 mb-2">Prix estimé</div>
          <div className="text-4xl font-bold text-blue-600">
            {priceMin} - {priceMax}
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Prix TTC, pièces et main d'œuvre incluses
          </p>
        </div>

        <div>
          <div className="text-sm text-gray-600 mb-2">Délai estimé</div>
          <div className="text-4xl font-bold text-green-600">
            {delayMin}-{delayMax} jours
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Selon disponibilité du réparateur
          </p>
        </div>
      </div>
    </Card>
  );
}

