import { Label } from '../ui/label';
import { Input } from '../ui/input';

interface EnvironmentConditionsProps {
  temperature: string;
  humidity: string;
  pressure: string;
  onTemperatureChange: (value: string) => void;
  onHumidityChange: (value: string) => void;
  onPressureChange: (value: string) => void;
}

export function EnvironmentConditions({
  temperature,
  humidity,
  pressure,
  onTemperatureChange,
  onHumidityChange,
  onPressureChange,
}: EnvironmentConditionsProps) {
  return (
    <div className="space-y-4">
      <div className="border-t-2 border-[#1F2A44] pt-6">
        <h2 className="text-2xl font-bold text-[#1F2A44] mb-4">
          ORTAM ŞARTLARI
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="temperature">Sıcaklık (°C)</Label>
          <Input
            id="temperature"
            type="number"
            step="0.1"
            value={temperature}
            onChange={(e) => onTemperatureChange(e.target.value)}
            className="h-14 text-lg bg-gray-50 rounded-lg"
            placeholder="Örn: 23.5"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="humidity">Nem (%)</Label>
          <Input
            id="humidity"
            type="number"
            step="0.1"
            value={humidity}
            onChange={(e) => onHumidityChange(e.target.value)}
            className="h-14 text-lg bg-gray-50 rounded-lg"
            placeholder="Örn: 45"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="pressure">Basınç (mbar)</Label>
          <Input
            id="pressure"
            type="number"
            step="0.1"
            value={pressure}
            onChange={(e) => onPressureChange(e.target.value)}
            className="h-14 text-lg bg-gray-50 rounded-lg"
            placeholder="Örn: 1013.25"
            required
          />
        </div>
      </div>
    </div>
  );
}
