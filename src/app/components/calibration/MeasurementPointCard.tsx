import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { calculateHysteresis, calculateAbsoluteDifference, getCalibrationStatus } from '../../utils/calibrationCalculations';

interface MeasurementPointCardProps {
  pointNumber: number;
  verificationValue: string;
  ascendingValue: string;
  descendingValue: string;
  uncertainty: number;
  tolerance: number;
  onAscendingChange: (value: string) => void;
  onDescendingChange: (value: string) => void;
  gradientColors: string;
  borderColor: string;
}

export function MeasurementPointCard({
  pointNumber,
  verificationValue,
  ascendingValue,
  descendingValue,
  uncertainty,
  tolerance,
  onAscendingChange,
  onDescendingChange,
  gradientColors,
  borderColor,
}: MeasurementPointCardProps) {
  const hysteresis = calculateHysteresis(ascendingValue, descendingValue);
  const absoluteDifference = calculateAbsoluteDifference(
    ascendingValue,
    descendingValue,
    verificationValue,
    uncertainty
  );
  const status = getCalibrationStatus(absoluteDifference, tolerance);

  return (
    <div className={`p-6 ${gradientColors} rounded-xl border-2 ${borderColor}`}>
      <h3 className="text-lg font-bold text-[#1F2A44] mb-4">
        Ölçüm Noktası {pointNumber}
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
        {/* Doğrulama Değeri */}
        <div className="space-y-2">
          <Label className="text-sm font-bold">DOĞRULAMA DEĞERİ</Label>
          <Input
            value={verificationValue}
            readOnly
            className="h-12 text-lg bg-gray-100 rounded-lg font-medium cursor-not-allowed"
          />
        </div>

        {/* Artan */}
        <div className="space-y-2">
          <Label className="text-sm font-bold">ARTAN</Label>
          <Input
            type="number"
            step="any"
            value={ascendingValue}
            onChange={(e) => onAscendingChange(e.target.value)}
            className="h-12 text-lg bg-white rounded-lg font-medium"
            placeholder="0.0"
            required
          />
        </div>

        {/* Azalan */}
        <div className="space-y-2">
          <Label className="text-sm font-bold">AZALAN</Label>
          <Input
            type="number"
            step="any"
            value={descendingValue}
            onChange={(e) => onDescendingChange(e.target.value)}
            className="h-12 text-lg bg-white rounded-lg font-medium"
            placeholder="0.0"
            required
          />
        </div>

        {/* Histerisis */}
        <div className="space-y-2">
          <Label className="text-sm font-bold">HİSTERİSİS</Label>
          <div className="h-12 flex items-center px-4 bg-yellow-100 border-2 border-yellow-400 rounded-lg">
            <span className="text-lg font-bold text-gray-900">
              {hysteresis || '0.0000000'}
            </span>
          </div>
        </div>

        {/* Mutlak Fark */}
        <div className="space-y-2">
          <Label className="text-sm font-bold">MUTLAK FARK</Label>
          <div className="h-12 flex items-center px-4 bg-orange-100 border-2 border-orange-400 rounded-lg">
            <span className="text-lg font-bold text-gray-900">
              {absoluteDifference || '0.0000000'}
            </span>
          </div>
        </div>

        {/* Tolerans */}
        <div className="space-y-2">
          <Label className="text-sm font-bold">TOLERANS</Label>
          <div className="h-12 flex items-center justify-center px-4 bg-purple-100 border-2 border-purple-400 rounded-lg">
            <span className="text-lg font-bold text-gray-900">
              {tolerance || '0.0'}
            </span>
          </div>
        </div>

        {/* Durum */}
        <div className="space-y-2">
          <Label className="text-sm font-bold">DURUM</Label>
          <div
            className={`h-12 flex flex-col items-center justify-center rounded-lg border-2 ${status.bgColor} ${status.borderColor}`}
          >
            <span className="text-2xl">{status.icon}</span>
            <span className="text-xs font-bold mt-0.5">{status.text}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
