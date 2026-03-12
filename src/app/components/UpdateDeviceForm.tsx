import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Home, Plus, Trash2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

export function UpdateDeviceForm() {
  const navigate = useNavigate();
  const [selectedDevice, setSelectedDevice] = useState('');
  const [verificationValues, setVerificationValues] = useState<string[]>(['25', '50', '75']);
  const [uncertaintyValues, setUncertaintyValues] = useState<string[]>(['', '', '']);
  const [formData, setFormData] = useState({
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
    calibrationDate: '2024-06-01',
    nextCalibrationDate: '2024-12-01',
    deviceType: 'test',
    minMeasurementRange: '0',
    maxMeasurementRange: '100',
    technicalTolerance: '±1%',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Device updated and submitted for approval!');
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen w-full bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate('/device-list')}
            className="flex items-center gap-2 text-[#1F2A44] hover:text-[#2d3d5f] transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
            <span className="text-lg font-medium">Geri</span>
          </button>
          
          <h1 className="text-4xl font-bold text-[#1F2A44]">
            Cihaz Güncelle
          </h1>
          
          <button
            onClick={() => navigate('/')}
            className="flex items-center justify-center w-12 h-12 bg-[#1F2A44] hover:bg-[#2d3d5f] rounded-full transition-colors"
          >
            <Home className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Device Selector */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="space-y-2">
            <Label htmlFor="deviceSelector">Güncellenecek Cihazı Seçin</Label>
            <Select value={selectedDevice} onValueChange={setSelectedDevice}>
              <SelectTrigger className="h-12 bg-gray-50 rounded-lg">
                <SelectValue placeholder="Bir cihaz seçin" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dev1">DEV-001 - Basınç Ölçer A</SelectItem>
                <SelectItem value="dev2">DEV-002 - Sıcaklık Sensörü B</SelectItem>
                <SelectItem value="dev3">DEV-003 - Terazi Ünitesi C</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-8">
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
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="deviceName">Cihaz Adı</Label>
                <Input
                  id="deviceName"
                  value={formData.deviceName}
                  onChange={(e) => setFormData({...formData, deviceName: e.target.value})}
                  className="h-12 bg-gray-50 rounded-lg"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="brand">Marka</Label>
                <Input
                  id="brand"
                  value={formData.brand}
                  onChange={(e) => setFormData({...formData, brand: e.target.value})}
                  className="h-12 bg-gray-50 rounded-lg"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="model">Model</Label>
                <Input
                  id="model"
                  value={formData.model}
                  onChange={(e) => setFormData({...formData, model: e.target.value})}
                  className="h-12 bg-gray-50 rounded-lg"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="manufacturer">Üretici</Label>
                <Input
                  id="manufacturer"
                  value={formData.manufacturer}
                  onChange={(e) => setFormData({...formData, manufacturer: e.target.value})}
                  className="h-12 bg-gray-50 rounded-lg"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="unit">Birim</Label>
                <Input
                  id="unit"
                  value={formData.unit}
                  onChange={(e) => setFormData({...formData, unit: e.target.value})}
                  className="h-12 bg-gray-50 rounded-lg"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="locationOfUse">Kullanım Yeri</Label>
                <Input
                  id="locationOfUse"
                  value={formData.locationOfUse}
                  onChange={(e) => setFormData({...formData, locationOfUse: e.target.value})}
                  className="h-12 bg-gray-50 rounded-lg"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="machineName">Makine Adı</Label>
                <Input
                  id="machineName"
                  value={formData.machineName}
                  onChange={(e) => setFormData({...formData, machineName: e.target.value})}
                  className="h-12 bg-gray-50 rounded-lg"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="procedureNumber">Prosedür Numarası</Label>
                <Input
                  id="procedureNumber"
                  value={formData.procedureNumber}
                  onChange={(e) => setFormData({...formData, procedureNumber: e.target.value})}
                  className="h-12 bg-gray-50 rounded-lg"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="calibratedBy">Kalibrasyonu Yapan</Label>
                <Input
                  id="calibratedBy"
                  value={formData.calibratedBy}
                  onChange={(e) => setFormData({...formData, calibratedBy: e.target.value})}
                  className="h-12 bg-gray-50 rounded-lg"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="measurementAccuracy">Ölçüm Hassasiyeti</Label>
                <Input
                  id="measurementAccuracy"
                  value={formData.measurementAccuracy}
                  onChange={(e) => setFormData({...formData, measurementAccuracy: e.target.value})}
                  className="h-12 bg-gray-50 rounded-lg"
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
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="initialCalibrationFrequency">Başlangıç Kalibrasyon Frekansı</Label>
                <Input
                  id="initialCalibrationFrequency"
                  value={formData.initialCalibrationFrequency}
                  onChange={(e) => setFormData({...formData, initialCalibrationFrequency: e.target.value})}
                  className="h-12 bg-gray-50 rounded-lg"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="calibrationFrequency">Kalibrasyon Frekansı</Label>
                <Input
                  id="calibrationFrequency"
                  value={formData.calibrationFrequency}
                  onChange={(e) => setFormData({...formData, calibrationFrequency: e.target.value})}
                  className="h-12 bg-gray-50 rounded-lg"
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
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="reference">Referans Cihaz</SelectItem>
                    <SelectItem value="test">Test Cihaz</SelectItem>
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
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxMeasurementRange">Maksimum Ölçüm Aralığı</Label>
                <Input
                  id="maxMeasurementRange"
                  value={formData.maxMeasurementRange}
                  onChange={(e) => setFormData({...formData, maxMeasurementRange: e.target.value})}
                  className="h-12 bg-gray-50 rounded-lg"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="technicalTolerance">Teknik Tolerans</Label>
                <Input
                  id="technicalTolerance"
                  value={formData.technicalTolerance}
                  onChange={(e) => setFormData({...formData, technicalTolerance: e.target.value})}
                  className="h-12 bg-gray-50 rounded-lg"
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

              {/* Belirsizlik Değerleri (Referans Cihaz için) */}
              {formData.deviceType === 'reference' && (
                <div className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border-2 border-purple-300 space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
                    <h3 className="text-xl font-bold text-[#1F2A44]">Referans Cihaz Belirsizlik Değerleri</h3>
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
              Onaya Gönder
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}