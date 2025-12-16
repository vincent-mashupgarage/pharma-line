/**
 * Prescription Badge Component
 * Displays prominent badge for prescription-required products
 * Server component
 */

import { Badge } from '@/components/ui/badge';
import { AlertCircle } from 'lucide-react';

interface PrescriptionBadgeProps {
  isControlled?: boolean;
  scheduleType?: string | null;
  className?: string;
}

export function PrescriptionBadge({
  isControlled,
  scheduleType,
  className = '',
}: PrescriptionBadgeProps) {
  return (
    <Badge variant="destructive" className={`gap-1 ${className}`}>
      <AlertCircle className="h-3 w-3" />
      {isControlled && scheduleType ? `Rx - ${scheduleType.replace('_', ' ')}` : 'Prescription Required'}
    </Badge>
  );
}
