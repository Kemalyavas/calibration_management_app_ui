import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Home, Download, Loader2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Label } from './ui/label';
import { useUser } from '../contexts/UserContext';
import { devicesApi } from '../services/api';

export function ViewDeviceDetails() {
  const navigate = useNavigate();
  const { userRole } = useUser();
  const [devices, setDevices] = useState<any[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    devicesApi.list({ pageSize: '100' }).then(d => setDevices(d.items));
  }, []);

  const handleDeviceSelect = async (deviceId: string) => {
    setLoading(true);
    try {
      const device = await devicesApi.get(parseInt(deviceId));
      setSelectedDevice(device);
    } catch { /* error */ }
    finally { setLoading(false); }
  };

  const handleBack = () => {
    if (userRole === 'guest') navigate('/guest-dashboard');
    else navigate('/device-list');
  };

  const InfoRow = ({ label, value }: { label: string; value: string }) => (
    <div className="flex items-center py-4 border-b border-gray-200 last:border-b-0">
      <div className="w-1/3"><p className="font-medium text-gray-700">{label}</p></div>
      <div className="w-2/3"><p className="text-gray-900">{value || '-'}</p></div>
    </div>
  );

  const verificationValues = selectedDevice?.verificationValues?.filter((v: any) => v != null) || [];

  return (
    <div className="min-h-screen w-full bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <button onClick={handleBack} className="flex items-center gap-2 text-[#1F2A44] hover:text-[#2d3d5f] transition-colors">
            <ArrowLeft className="w-6 h-6" /><span className="text-lg font-medium">Geri</span>
          </button>
          <h1 className="text-4xl font-bold text-[#1F2A44]">Cihaz Detaylarını Görüntüle</h1>
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 px-6 py-3 bg-[#1F2A44] hover:bg-[#2d3d5f] text-white rounded-xl transition-colors shadow-md">
              <Download className="w-5 h-5" /><span className="font-medium">Sertifika İndir</span>
            </button>
            <button onClick={() => navigate('/')} className="flex items-center justify-center w-12 h-12 bg-[#1F2A44] hover:bg-[#2d3d5f] rounded-full transition-colors">
              <Home className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="space-y-2">
            <Label htmlFor="deviceSelector">Görüntülenecek Cihazı Seçin</Label>
            <Select onValueChange={handleDeviceSelect}>
              <SelectTrigger className="h-12 bg-gray-50 rounded-lg"><SelectValue placeholder="Bir cihaz seçin" /></SelectTrigger>
              <SelectContent>
                {devices.map((d: any) => (
                  <SelectItem key={d.id} value={d.id.toString()}>{d.deviceCode} - {d.deviceName}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {loading && (
          <div className="flex items-center justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-[#1F2A44]" /></div>
        )}

        {selectedDevice && !loading && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h2 className="text-2xl font-bold text-[#1F2A44] mb-6 pb-4 border-b-2 border-[#1F2A44]">Cihaz Bilgileri</h2>
                <InfoRow label="Cihaz Numarası" value={selectedDevice.deviceCode} />
                <InfoRow label="Cihaz Adı" value={selectedDevice.deviceName} />
                <InfoRow label="Marka" value={selectedDevice.brand} />
                <InfoRow label="Model" value={selectedDevice.model} />
                <InfoRow label="Üretici" value={selectedDevice.manufacturer} />
                <InfoRow label="Birim" value={selectedDevice.unit} />
                <InfoRow label="Kullanım Yeri" value={selectedDevice.locationOfUse} />
                <InfoRow label="Makine" value={selectedDevice.machineName} />
                <InfoRow label="Bölüm" value={selectedDevice.departmentName} />
                <InfoRow label="Cihaz Tipi" value={selectedDevice.deviceType === 'test' ? 'Test Cihazı' : 'Referans Cihaz'} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-[#1F2A44] mb-6 pb-4 border-b-2 border-[#1F2A44]">Kalibrasyon Bilgileri</h2>
                <InfoRow label="Prosedür No" value={selectedDevice.procedureNumber} />
                <InfoRow label="Kalibre Eden" value={selectedDevice.calibratedBy} />
                <InfoRow label="Referans Kodu" value={selectedDevice.referenceCode} />
                <InfoRow label="Kalibrasyon Tarihi" value={selectedDevice.calibrationDate ? new Date(selectedDevice.calibrationDate).toLocaleDateString('tr-TR') : '-'} />
                <InfoRow label="Sonraki Kalibrasyon" value={selectedDevice.nextCalibrationDate ? new Date(selectedDevice.nextCalibrationDate).toLocaleDateString('tr-TR') : '-'} />
                <InfoRow label="Frekans" value={selectedDevice.calibrationFrequency} />
                <InfoRow label="Kalan Gün" value={selectedDevice.daysRemaining?.toString()} />
                <InfoRow label="Ölçüm Hassasiyeti" value={selectedDevice.measurementAccuracy} />
              </div>
            </div>

            <div className="mt-8">
              <h2 className="text-2xl font-bold text-[#1F2A44] mb-6 pb-4 border-b-2 border-[#1F2A44]">Ölçüm Özellikleri</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-50 rounded-xl p-6">
                  <p className="text-sm text-gray-600 mb-2">Ölçüm Aralığı</p>
                  <p className="text-lg font-bold text-[#1F2A44]">{selectedDevice.minRange} - {selectedDevice.maxRange} {selectedDevice.unit}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-6">
                  <p className="text-sm text-gray-600 mb-2">Ölçüm Hassasiyeti</p>
                  <p className="text-lg font-bold text-[#1F2A44]">{selectedDevice.measurementAccuracy || '-'}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-6">
                  <p className="text-sm text-gray-600 mb-2">Teknik Tolerans</p>
                  <p className="text-lg font-bold text-[#1F2A44]">{selectedDevice.technicalTolerance || '-'}</p>
                </div>
              </div>
            </div>

            {verificationValues.length > 0 && (
              <div className="mt-8">
                <h2 className="text-2xl font-bold text-[#1F2A44] mb-6 pb-4 border-b-2 border-[#1F2A44]">Doğrulama Değerleri</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {verificationValues.map((val: number, idx: number) => (
                    <div key={idx} className="bg-gray-50 rounded-xl p-6 text-center">
                      <p className="text-sm text-gray-600 mb-2">Değer {idx + 1}</p>
                      <p className="text-2xl font-bold text-[#1F2A44]">{val}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
