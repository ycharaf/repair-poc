import { Badge } from '@/components/ui/badge';

interface TimelineStepProps {
  index: number;
  label: string;
  status: 'completed' | 'current' | 'pending';
  timestamp?: string;
  description?: string;
  isLast: boolean;
}

export function TimelineStep({
  index,
  label,
  status,
  timestamp,
  description,
  isLast,
}: TimelineStepProps) {
  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold ${
            status === 'completed' 
              ? 'bg-green-600' 
              : status === 'current'
              ? 'bg-blue-600'
              : 'bg-gray-300'
          }`}
        >
          {status === 'completed' ? '?' : index + 1}
        </div>
        {!isLast && (
          <div
            className={`w-0.5 h-16 ${
              status === 'completed' ? 'bg-green-600' : 'bg-gray-300'
            }`}
          />
        )}
      </div>

      <div className="flex-1 pb-8">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="font-semibold text-lg">{label}</h3>
          {status === 'current' && (
            <Badge variant="default">En cours</Badge>
          )}
        </div>
        {timestamp && (
          <div className="text-sm text-gray-600 mb-2">{timestamp}</div>
        )}
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </div>
  );
}

