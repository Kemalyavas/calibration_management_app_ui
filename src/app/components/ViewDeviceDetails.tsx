import { useNavigate } from 'react-router';
import { ArrowLeft, Home, Download } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Label } from './ui/label';
import { useUser } from '../contexts/UserContext';

const deviceData = {
  deviceNumber: 'DEV-001',
  deviceName: 'Pressure Gauge A',
  brand: 'Omega',
  model: 'PGT-100',
  manufacturer: 'Omega Engineering',
  unit: 'PSI',
  locationOfUse: 'Production Line 1',
  machineName: 'Mixer 01',
  procedureNumber: 'PROC-2024-001',
  calibratedBy: 'John Smith',
  measurementAccuracy: '±0.5%',
  referenceCode: 'REF-001',
  initialCalibrationFrequency: '6 months',
  calibrationFrequency: '6 months',
  calibrationDate: 'June 1, 2024',
  nextCalibrationDate: 'December 1, 2024',
  deviceType: 'Test Device',
  minMeasurementRange: '0 PSI',
  maxMeasurementRange: '100 PSI',
  technicalTolerance: '±1%',
  verificationValue1: '25 PSI',
  verificationValue2: '50 PSI',
  verificationValue3: '75 PSI',
  status: 'Active',
  lastCalibrationResult: 'Passed',
};

export function ViewDeviceDetails() {
  const navigate = useNavigate();
  const { userRole } = useUser();

  const handleBack = () => {
    if (userRole === 'guest') {
      navigate('/guest-dashboard');
    } else {
      navigate('/device-list');
    }
  };

  const handleDownloadCertificate = () => {
    // Sertifika indirme fonksiyonu - şimdilik sadece buton olarak
    console.log('Sertifika indirilecek');
  };

  const InfoRow = ({ label, value }: { label: string; value: string }) => (
    <div className="flex items-center py-4 border-b border-gray-200 last:border-b-0">
      <div className="w-1/3">
        <p className="font-medium text-gray-700">{label}</p>
      </div>
      <div className="w-2/3">
        <p className="text-gray-900">{value}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen w-full bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-[#1F2A44] hover:text-[#2d3d5f] transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
            <span className="text-lg font-medium">Geri</span>
          </button>
          
          <h1 className="text-4xl font-bold text-[#1F2A44]">
            Cihaz Detaylarını Görüntüle
          </h1>
          
          <div className="flex items-center gap-4">
            <button
              onClick={handleDownloadCertificate}
              className="flex items-center gap-2 px-6 py-3 bg-[#1F2A44] hover:bg-[#2d3d5f] text-white rounded-xl transition-colors shadow-md"
            >
              <Download className="w-5 h-5" />
              <span className="font-medium">Sertifika İndir</span>
            </button>
            <button
              onClick={() => navigate('/')}
              className="flex items-center justify-center w-12 h-12 bg-[#1F2A44] hover:bg-[#2d3d5f] rounded-full transition-colors"
            >
              <Home className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>

        {/* Device Selector */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="space-y-2">
            <Label htmlFor="deviceSelector">Görüntülenecek Cihazı Seçin</Label>
            <Select defaultValue="dev1">
              <SelectTrigger className="h-12 bg-gray-50 rounded-lg">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dev1">DEV-001 - Basınç Ölçer A</SelectItem>
                <SelectItem value="dev2">DEV-002 - Sıcaklık Sensörü B</SelectItem>
                <SelectItem value="dev3">DEV-003 - Terazi Ünitesi C</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Device Details */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column */}
            <div>
              <h2 className="text-2xl font-bold text-[#1F2A44] mb-6 pb-4 border-b-2 border-[#1F2A44]">
                Device Information
              </h2>
              <div className="space-y-0">
                <InfoRow label="Device Number" value={deviceData.deviceNumber} />
                <InfoRow label="Device Name" value={deviceData.deviceName} />
                <InfoRow label="Brand" value={deviceData.brand} />
                <InfoRow label="Model" value={deviceData.model} />
                <InfoRow label="Manufacturer" value={deviceData.manufacturer} />
                <InfoRow label="Unit" value={deviceData.unit} />
                <InfoRow label="Location of Use" value={deviceData.locationOfUse} />
                <InfoRow label="Machine Name" value={deviceData.machineName} />
                <InfoRow label="Status" value={deviceData.status} />
              </div>
            </div>

            {/* Right Column */}
            <div>
              <h2 className="text-2xl font-bold text-[#1F2A44] mb-6 pb-4 border-b-2 border-[#1F2A44]">
                Calibration Details
              </h2>
              <div className="space-y-0">
                <InfoRow label="Procedure Number" value={deviceData.procedureNumber} />
                <InfoRow label="Calibrated By" value={deviceData.calibratedBy} />
                <InfoRow label="Reference Code" value={deviceData.referenceCode} />
                <InfoRow label="Device Type" value={deviceData.deviceType} />
                <InfoRow label="Calibration Date" value={deviceData.calibrationDate} />
                <InfoRow label="Next Calibration" value={deviceData.nextCalibrationDate} />
                <InfoRow label="Frequency" value={deviceData.calibrationFrequency} />
                <InfoRow label="Last Result" value={deviceData.lastCalibrationResult} />
              </div>
            </div>
          </div>

          {/* Measurement Specifications */}
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-[#1F2A44] mb-6 pb-4 border-b-2 border-[#1F2A44]">
              Measurement Specifications
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-gray-50 rounded-xl p-6">
                <p className="text-sm text-gray-600 mb-2">Measurement Range</p>
                <p className="text-lg font-bold text-[#1F2A44]">
                  {deviceData.minMeasurementRange} - {deviceData.maxMeasurementRange}
                </p>
              </div>
              <div className="bg-gray-50 rounded-xl p-6">
                <p className="text-sm text-gray-600 mb-2">Measurement Accuracy</p>
                <p className="text-lg font-bold text-[#1F2A44]">{deviceData.measurementAccuracy}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-6">
                <p className="text-sm text-gray-600 mb-2">Technical Tolerance</p>
                <p className="text-lg font-bold text-[#1F2A44]">{deviceData.technicalTolerance}</p>
              </div>
            </div>
          </div>

          {/* Verification Values */}
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-[#1F2A44] mb-6 pb-4 border-b-2 border-[#1F2A44]">
              Verification Values
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-50 rounded-xl p-6 text-center">
                <p className="text-sm text-gray-600 mb-2">Value 1</p>
                <p className="text-2xl font-bold text-[#1F2A44]">{deviceData.verificationValue1}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-6 text-center">
                <p className="text-sm text-gray-600 mb-2">Value 2</p>
                <p className="text-2xl font-bold text-[#1F2A44]">{deviceData.verificationValue2}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-6 text-center">
                <p className="text-sm text-gray-600 mb-2">Value 3</p>
                <p className="text-2xl font-bold text-[#1F2A44]">{deviceData.verificationValue3}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}