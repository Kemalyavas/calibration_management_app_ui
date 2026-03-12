import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Home, Copy, Plus, Trash2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';

// Mock cihaz verileri - kopyalama için
const existingDevices = [
  {
    deviceNumber: 'A002',
    deviceName: 'BASINÇ ÖLÇER',
    brand: 'Wika',
    model: 'P-30',
    manufacturer: 'Wika Instruments',
    unit: 'PSI',
    locationOfUse: 'Hat 2',
    machineName: 'BANBURY 9',
    procedureNumber: 'PR-001',
    calibratedBy: 'Kalibrasyon Lab',
    measurementAccuracy: '±0.5 PSI',
    referenceCode: 'REF-PRESS-001',
    initialCalibrationFrequency: '6 ay',
    calibrationFrequency: '6 ay',
    calibrationDate: '2025-08-23',
    nextCalibrationDate: '2026-02-23',
    deviceType: 'test',
    minMeasurementRange: '0',
    maxMeasurementRange: '100',
    technicalTolerance: '±1%',
    verificationValue1: '25',
    verificationValue2: '50',
    verificationValue3: '75',
  },
  {
    deviceNumber: 'B007',
    deviceName: 'Uzunluk Ölçer',
    brand: 'Mitutoyo',
    model: 'CD-15DCX',
    manufacturer: 'Mitutoyo Corporation',
    unit: 'mm',
    locationOfUse: 'Hat 3',
    machineName: '3 TRAFILA',
    procedureNumber: 'PR-005',
    calibratedBy: 'Kalibrasyon Lab',
    measurementAccuracy: '±0.01 mm',
    referenceCode: 'REF-LEN-003',
    initialCalibrationFrequency: '12 ay',
    calibrationFrequency: '6 ay',
    calibrationDate: '2025-09-15',
    nextCalibrationDate: '2026-03-15',
    deviceType: 'test',
    minMeasurementRange: '0',
    maxMeasurementRange: '150',
    technicalTolerance: '±0.02 mm',
    verificationValue1: '50',
    verificationValue2: '100',
    verificationValue3: '150',
  },
  {
    deviceNumber: 'C001',
    deviceName: 'pH Ölçer',
    brand: 'Mettler Toledo',
    model: 'SevenCompact S220',
    manufacturer: 'Mettler Toledo',
    unit: 'pH',
    locationOfUse: 'Kimya Lab',
    machineName: 'MIXER 01',
    procedureNumber: 'PR-008',
    calibratedBy: 'Kalibrasyon Lab',
    measurementAccuracy: '±0.01 pH',
    referenceCode: 'REF-PH-001',
    initialCalibrationFrequency: '6 ay',
    calibrationFrequency: '6 ay',
    calibrationDate: '2025-08-19',
    nextCalibrationDate: '2026-02-19',
    deviceType: 'test',
    minMeasurementRange: '0',
    maxMeasurementRange: '14',
    technicalTolerance: '±0.02 pH',
    verificationValue1: '4',
    verificationValue2: '7',
    verificationValue3: '10',
  },
];

export function AddDeviceForm() {
  const navigate = useNavigate();
  const [isReferenceDevice, setIsReferenceDevice] = useState(false);
  const [verificationValues, setVerificationValues] = useState<string[]>(['', '', '']);
  const [uncertaintyValues, setUncertaintyValues] = useState<string[]>(['', '', '']);
  const [formData, setFormData] = useState({
    deviceNumber: '',
    deviceName: '',
    brand: '',
    model: '',
    manufacturer: '',
    unit: '',
    locationOfUse: '',
    machineName: '',
    procedureNumber: '',
    calibratedBy: '',
    measurementAccuracy: '',
    referenceCode: '',
    initialCalibrationFrequency: '',
    calibrationFrequency: '',
    calibrationDate: '',
    nextCalibrationDate: '',
    deviceType: '',
    minMeasurementRange: '',
    maxMeasurementRange: '',
    technicalTolerance: '',
    uncertainty1: '',
    uncertainty2: '',
    uncertainty3: '',
  });

  const handleCopyDevice = (deviceCode: string) => {
    const device = existingDevices.find(d => d.deviceNumber === deviceCode);
    if (device) {
      setVerificationValues([device.verificationValue1, device.verificationValue2, device.verificationValue3]);
      setUncertaintyValues(['', '', '']);
      setIsReferenceDevice(device.deviceType === 'reference');
      setFormData({
        deviceNumber: '',
        deviceName: device.deviceName,
        brand: device.brand,
        model: device.model,
        manufacturer: device.manufacturer,
        unit: device.unit,
        locationOfUse: device.locationOfUse,
        machineName: device.machineName,
        procedureNumber: device.procedureNumber,
        calibratedBy: device.calibratedBy,
        measurementAccuracy: device.measurementAccuracy,
        referenceCode: device.referenceCode,
        initialCalibrationFrequency: device.initialCalibrationFrequency,
        calibrationFrequency: device.calibrationFrequency,
        calibrationDate: device.calibrationDate,
        nextCalibrationDate: device.nextCalibrationDate,
        deviceType: device.deviceType,
        minMeasurementRange: device.minMeasurementRange,
        maxMeasurementRange: device.maxMeasurementRange,
        technicalTolerance: device.technicalTolerance,
        uncertainty1: '',
        uncertainty2: '',
        uncertainty3: '',
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Cihaz başarıyla eklendi!');
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen w-full bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-[#1F2A44] hover:text-[#2d3d5f] transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
            <span className="text-lg font-medium">Geri</span>
          </button>
          
          <h1 className="text-4xl font-bold text-[#1F2A44]">
            Cihaz Ekle
          </h1>
          
          <button
            onClick={() => navigate('/')}
            className="flex items-center justify-center w-12 h-12 bg-[#1F2A44] hover:bg-[#2d3d5f] rounded-full transition-colors"
          >
            <Home className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-8">
          {/* Copy Device Section */}
          <div className="mb-8 p-6 bg-blue-50 rounded-xl border-2 border-blue-200">
            <div className="flex items-center gap-3 mb-4">
              <Copy className="w-6 h-6 text-[#1F2A44]" />
              <h3 className="text-xl font-bold text-[#1F2A44]">
                Mevcut Cihazdan Kopyala (İsteğe Bağlı)
              </h3>
            </div>
            <p className="text-gray-600 mb-4">
              Mevcut bir cihazın tüm bilgilerini kopyalayın, sadece cihaz kodunu değiştirin.
            </p>
            <Select onValueChange={handleCopyDevice}>
              <SelectTrigger className="h-14 bg-white rounded-lg text-lg">
                <SelectValue placeholder="Kopyalanacak cihazı seçin..." />
              </SelectTrigger>
              <SelectContent>
                {existingDevices.map((device) => (
                  <SelectItem key={device.deviceNumber} value={device.deviceNumber}>
                    {device.deviceNumber} - {device.deviceName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="deviceNumber">Cihaz Numarası</Label>
                <Input
                  id="deviceNumber"
                  value={formData.deviceNumber}
                  onChange={(e) => setFormData({...formData, deviceNumber: e.target.value})}
                  className="h-12 bg-gray-50 rounded-lg"
                  placeholder="Cihaz numarasını girin"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="deviceName">Cihaz Adı</Label>
                <Input
                  id="deviceName"
                  value={formData.deviceName}
                  onChange={(e) => setFormData({...formData, deviceName: e.target.value})}
                  className="h-12 bg-gray-50 rounded-lg"
                  placeholder="Cihaz adını girin"
                />
              </div>

              {/* Cihaz Tipi Checkbox - Referans Cihaz */}
              <div className="p-4 bg-amber-50 rounded-lg border-2 border-amber-300">
                <div className="flex items-center space-x-3">
                  <Checkbox 
                    id="isReferenceDevice"
                    checked={isReferenceDevice}
                    onCheckedChange={(checked) => setIsReferenceDevice(checked as boolean)}
                    className="w-6 h-6"
                  />
                  <div>
                    <Label 
                      htmlFor="isReferenceDevice" 
                      className="text-lg font-bold text-[#1F2A44] cursor-pointer"
                    >
                      Bu bir Referans Cihaz
                    </Label>
                    <p className="text-sm text-gray-600 mt-1">
                      {isReferenceDevice 
                        ? "✓ Referans Cihaz - Belirsizlik değerleri girilecek" 
                        : "Test Cihazı - Normal kalibrasyon cihazı"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="brand">Marka</Label>
                <Input
                  id="brand"
                  value={formData.brand}
                  onChange={(e) => setFormData({...formData, brand: e.target.value})}
                  className="h-12 bg-gray-50 rounded-lg"
                  placeholder="Marka girin"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="model">Model</Label>
                <Input
                  id="model"
                  value={formData.model}
                  onChange={(e) => setFormData({...formData, model: e.target.value})}
                  className="h-12 bg-gray-50 rounded-lg"
                  placeholder="Model girin"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="manufacturer">Üretici</Label>
                <Input
                  id="manufacturer"
                  value={formData.manufacturer}
                  onChange={(e) => setFormData({...formData, manufacturer: e.target.value})}
                  className="h-12 bg-gray-50 rounded-lg"
                  placeholder="Üretici firma girin"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="unit">Birim</Label>
                <Input
                  id="unit"
                  value={formData.unit}
                  onChange={(e) => setFormData({...formData, unit: e.target.value})}
                  className="h-12 bg-gray-50 rounded-lg"
                  placeholder="Ölçüm birimini girin"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="locationOfUse">Kullanım Yeri</Label>
                <Input
                  id="locationOfUse"
                  value={formData.locationOfUse}
                  onChange={(e) => setFormData({...formData, locationOfUse: e.target.value})}
                  className="h-12 bg-gray-50 rounded-lg"
                  placeholder="Kullanım yerini girin"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="machineName">Makine Adı</Label>
                <Input
                  id="machineName"
                  value={formData.machineName}
                  onChange={(e) => setFormData({...formData, machineName: e.target.value})}
                  className="h-12 bg-gray-50 rounded-lg"
                  placeholder="Makine adını girin"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="procedureNumber">Prosedür Numarası</Label>
                <Input
                  id="procedureNumber"
                  value={formData.procedureNumber}
                  onChange={(e) => setFormData({...formData, procedureNumber: e.target.value})}
                  className="h-12 bg-gray-50 rounded-lg"
                  placeholder="Prosedür numarasını girin"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="calibratedBy">Kalibre Eden</Label>
                <Input
                  id="calibratedBy"
                  value={formData.calibratedBy}
                  onChange={(e) => setFormData({...formData, calibratedBy: e.target.value})}
                  className="h-12 bg-gray-50 rounded-lg"
                  placeholder="Kalibre eden kişiyi girin"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="measurementAccuracy">Ölçüm Hassasiyeti</Label>
                <Input
                  id="measurementAccuracy"
                  value={formData.measurementAccuracy}
                  onChange={(e) => setFormData({...formData, measurementAccuracy: e.target.value})}
                  className="h-12 bg-gray-50 rounded-lg"
                  placeholder="Ölçüm hassasiyetini girin"
                />
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="referenceCode">Referans Kodu</Label>
                <Input
                  id="referenceCode"
                  value={formData.referenceCode}
                  onChange={(e) => setFormData({...formData, referenceCode: e.target.value})}
                  className="h-12 bg-gray-50 rounded-lg"
                  placeholder="Referans kodunu girin"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="initialCalibrationFrequency">İlk Kalibrasyon Frekansı</Label>
                <Input
                  id="initialCalibrationFrequency"
                  value={formData.initialCalibrationFrequency}
                  onChange={(e) => setFormData({...formData, initialCalibrationFrequency: e.target.value})}
                  className="h-12 bg-gray-50 rounded-lg"
                  placeholder="Frekans girin"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="calibrationFrequency">Kalibrasyon Frekansı</Label>
                <Input
                  id="calibrationFrequency"
                  value={formData.calibrationFrequency}
                  onChange={(e) => setFormData({...formData, calibrationFrequency: e.target.value})}
                  className="h-12 bg-gray-50 rounded-lg"
                  placeholder="Frekans girin"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="calibrationDate">Kalibrasyon Tarihi</Label>
                <Input
                  id="calibrationDate"
                  type="date"
                  value={formData.calibrationDate}
                  onChange={(e) => setFormData({...formData, calibrationDate: e.target.value})}
                  className="h-12 bg-gray-50 rounded-lg"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="nextCalibrationDate">Sonraki Kalibrasyon Tarihi</Label>
                <Input
                  id="nextCalibrationDate"
                  type="date"
                  value={formData.nextCalibrationDate}
                  onChange={(e) => setFormData({...formData, nextCalibrationDate: e.target.value})}
                  className="h-12 bg-gray-50 rounded-lg"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="deviceType">Cihaz Tipi</Label>
                <Select value={formData.deviceType} onValueChange={(value) => setFormData({...formData, deviceType: value})}>
                  <SelectTrigger className="h-12 bg-gray-50 rounded-lg">
                    <SelectValue placeholder="Cihaz tipi seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="reference">Referans Cihaz</SelectItem>
                    <SelectItem value="test">Test Cihazı</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="minMeasurementRange">Minimum Ölçüm Aralığı</Label>
                <Input
                  id="minMeasurementRange"
                  value={formData.minMeasurementRange}
                  onChange={(e) => setFormData({...formData, minMeasurementRange: e.target.value})}
                  className="h-12 bg-gray-50 rounded-lg"
                  placeholder="Minimum aralığı girin"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxMeasurementRange">Maksimum Ölçüm Aralığı</Label>
                <Input
                  id="maxMeasurementRange"
                  value={formData.maxMeasurementRange}
                  onChange={(e) => setFormData({...formData, maxMeasurementRange: e.target.value})}
                  className="h-12 bg-gray-50 rounded-lg"
                  placeholder="Maksimum aralığı girin"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="technicalTolerance">Teknik Tolerans</Label>
                <Input
                  id="technicalTolerance"
                  value={formData.technicalTolerance}
                  onChange={(e) => setFormData({...formData, technicalTolerance: e.target.value})}
                  className="h-12 bg-gray-50 rounded-lg"
                  placeholder="Tolerans değerini girin"
                />
              </div>

              {/* Dinamik Doğrulama Değerleri */}
              <div className="p-5 bg-blue-50 rounded-xl border-2 border-blue-200 space-y-3">
                <div className="flex items-center justify-between mb-1">
                  <div>
                    <h4 className="font-bold text-[#1F2A44]">Doğrulama Değerleri</h4>
                    <p className="text-xs text-gray-500 mt-0.5">Kalibrasyon sırasında kullanılacak referans noktaları</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setVerificationValues(prev => [...prev, '']);
                      setUncertaintyValues(prev => [...prev, '']);
                    }}
                    className="flex items-center gap-1.5 px-3 py-2 bg-[#1F2A44] text-white rounded-lg hover:bg-[#2d3d5f] transition-colors text-sm font-semibold"
                  >
                    <Plus size={16} />
                    Değer Ekle
                  </button>
                </div>
                {verificationValues.map((val, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="w-7 h-7 flex items-center justify-center bg-[#1F2A44] text-white rounded-full text-xs font-bold flex-shrink-0">
                      {idx + 1}
                    </span>
                    <Input
                      value={val}
                      onChange={(e) => {
                        const updated = [...verificationValues];
                        updated[idx] = e.target.value;
                        setVerificationValues(updated);
                      }}
                      className="h-11 bg-white rounded-lg flex-1"
                      placeholder={`Doğrulama değeri ${idx + 1}`}
                    />
                    {verificationValues.length > 1 && (
                      <button
                        type="button"
                        onClick={() => {
                          setVerificationValues(prev => prev.filter((_, i) => i !== idx));
                          setUncertaintyValues(prev => prev.filter((_, i) => i !== idx));
                        }}
                        className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Belirsizlik Değerleri - Sadece Referans Cihaz İçin */}
              {isReferenceDevice && (
                <div className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border-2 border-purple-300 space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
                    <h3 className="text-xl font-bold text-[#1F2A44]">
                      Referans Cihaz Belirsizlik Değerleri
                    </h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    Her doğrulama noktasına karşılık gelen belirsizlik değeri. Doğrulama değeri eklendiğinde otomatik eklenir.
                  </p>

                  {uncertaintyValues.map((uVal, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="w-7 h-7 flex items-center justify-center bg-purple-600 text-white rounded-full text-xs font-bold flex-shrink-0">
                        {idx + 1}
                      </span>
                      <div className="flex-1">
                        <Label className="text-xs text-gray-500 mb-1 block">
                          Belirsizlik Değeri {idx + 1}
                          {verificationValues[idx] ? ` (${verificationValues[idx]}'de)` : ''}
                        </Label>
                        <Input
                          type="number"
                          step="0.0000001"
                          value={uVal}
                          onChange={(e) => {
                            const updated = [...uncertaintyValues];
                            updated[idx] = e.target.value;
                            setUncertaintyValues(updated);
                          }}
                          className="h-11 bg-white rounded-lg"
                          placeholder="Örn: 0.5"
                          required={isReferenceDevice}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-8 flex justify-center">
            <Button
              type="submit"
              className="h-14 px-12 text-lg bg-[#1F2A44] hover:bg-[#2d3d5f] rounded-xl"
            >
              Cihaz Ekle
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}