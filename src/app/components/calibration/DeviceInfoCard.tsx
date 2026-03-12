import { Label } from '../ui/label';
import { Input } from '../ui/input';

interface DeviceInfoCardProps {
  deviceNumber: string;
  deviceName: string;
  calibrationFrequency: string;
  lastCalibrationDate: string;
  newCalibrationDate: string;
  minRange: string;
  maxRange: string;
  onNewCalibrationDateChange: (date: string) => void;
}

export function DeviceInfoCard({
  deviceNumber,
  deviceName,
  calibrationFrequency,
  lastCalibrationDate,
  newCalibrationDate,
  minRange,
  maxRange,
  onNewCalibrationDateChange,
}: DeviceInfoCardProps) {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6 border-2 border-blue-300">
      <h2 className="text-2xl font-bold text-[#1F2A44] mb-4">CİHAZ BİLGİLERİ</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label className="text-sm font-bold">Cihaz Numarası</Label>
          <Input
            value={deviceNumber}
            readOnly
            className="h-12 text-lg bg-white rounded-lg font-medium cursor-not-allowed"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-bold">Cihaz Adı</Label>
          <Input
            value={deviceName}
            readOnly
            className="h-12 text-lg bg-white rounded-lg font-medium cursor-not-allowed"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-bold">Kalibrasyon Sıklığı</Label>
          <Input
            value={calibrationFrequency}
            readOnly
            className="h-12 text-lg bg-white rounded-lg font-medium cursor-not-allowed"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-bold">Son Kalibrasyon Tarihi</Label>
          <Input
            value={lastCalibrationDate}
            readOnly
            className="h-12 text-lg bg-white rounded-lg font-medium cursor-not-allowed"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-bold">Yeni Kalibrasyon Tarihi</Label>
          <Input
            type="date"
            value={newCalibrationDate}
            onChange={(e) => onNewCalibrationDateChange(e.target.value)}
            className="h-12 text-lg bg-white rounded-lg font-medium"
            required
          />
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-bold">Ölçüm Aralığı</Label>
          <div className="h-12 flex items-center px-4 bg-white rounded-lg border border-gray-300">
            <span className="text-lg font-medium text-gray-900">
              {minRange} - {maxRange}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
