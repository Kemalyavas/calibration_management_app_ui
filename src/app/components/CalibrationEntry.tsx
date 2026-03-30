import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Home, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { MeasurementPointCard } from './calibration/MeasurementPointCard';
import { DeviceInfoCard } from './calibration/DeviceInfoCard';
import { EnvironmentConditions } from './calibration/EnvironmentConditions';
import { ReferenceDeviceInfo } from './calibration/ReferenceDeviceInfo';
import { FileUploadSection } from './calibration/FileUploadSection';
import { devicesApi, calibrationsApi, filesApi } from '../services/api';

interface CalibrationFormData {
  deviceNumber: string;
  deviceName: string;
  calibrationFrequency: string;
  lastCalibrationDate: string;
  newCalibrationDate: string;
  minRange: string;
  maxRange: string;
  verificationValue1: string;
  verificationValue2: string;
  verificationValue3: string;
  verificationValue4: string;
  verificationValue5: string;
  verificationValue6: string;
  tolerance1: number;
  tolerance2: number;
  tolerance3: number;
  tolerance4: number;
  tolerance5: number;
  tolerance6: number;
  temperature: string;
  humidity: string;
  pressure: string;
  referenceDevice: string;
  referenceDeviceSerial: string;
  referenceUncertainty1: number;
  referenceUncertainty2: number;
  referenceUncertainty3: number;
  referenceUncertainty4: number;
  referenceUncertainty5: number;
  referenceUncertainty6: number;
  calibratedBy: string;
}

interface MeasurementValues {
  ascending1: string;
  descending1: string;
  ascending2: string;
  descending2: string;
  ascending3: string;
  descending3: string;
  ascending4: string;
  descending4: string;
  ascending5: string;
  descending5: string;
  ascending6: string;
  descending6: string;
}

const INITIAL_FORM_DATA: CalibrationFormData = {
  deviceNumber: '',
  deviceName: '',
  calibrationFrequency: '',
  lastCalibrationDate: '',
  newCalibrationDate: '',
  minRange: '',
  maxRange: '',
  verificationValue1: '',
  verificationValue2: '',
  verificationValue3: '',
  verificationValue4: '',
  verificationValue5: '',
  verificationValue6: '',
  tolerance1: 0,
  tolerance2: 0,
  tolerance3: 0,
  tolerance4: 0,
  tolerance5: 0,
  tolerance6: 0,
  temperature: '',
  humidity: '',
  pressure: '',
  referenceDevice: '',
  referenceDeviceSerial: '',
  referenceUncertainty1: 0,
  referenceUncertainty2: 0,
  referenceUncertainty3: 0,
  referenceUncertainty4: 0,
  referenceUncertainty5: 0,
  referenceUncertainty6: 0,
  calibratedBy: '',
};

const INITIAL_MEASUREMENTS: MeasurementValues = {
  ascending1: '',
  descending1: '',
  ascending2: '',
  descending2: '',
  ascending3: '',
  descending3: '',
  ascending4: '',
  descending4: '',
  ascending5: '',
  descending5: '',
  ascending6: '',
  descending6: '',
};

// Ölçüm noktası renklendirme konfigürasyonu
const MEASUREMENT_POINT_STYLES = [
  { gradient: 'bg-gradient-to-r from-blue-50 to-blue-100', border: 'border-blue-300' },
  { gradient: 'bg-gradient-to-r from-green-50 to-green-100', border: 'border-green-300' },
  { gradient: 'bg-gradient-to-r from-purple-50 to-purple-100', border: 'border-purple-300' },
  { gradient: 'bg-gradient-to-r from-orange-50 to-orange-100', border: 'border-orange-300' },
  { gradient: 'bg-gradient-to-r from-pink-50 to-pink-100', border: 'border-pink-300' },
  { gradient: 'bg-gradient-to-r from-red-50 to-red-100', border: 'border-red-300' },
];

export function CalibrationEntry() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<CalibrationFormData>(INITIAL_FORM_DATA);
  const [measurements, setMeasurements] = useState<MeasurementValues>(INITIAL_MEASUREMENTS);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [testDevices, setTestDevices] = useState<any[]>([]);
  const [referenceDevices, setReferenceDevices] = useState<any[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<number | null>(null);
  const [selectedRefDeviceId, setSelectedRefDeviceId] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    devicesApi.list({ deviceType: 'test', pageSize: '100' }).then(d => setTestDevices(d.items));
    devicesApi.list({ deviceType: 'reference', pageSize: '100' }).then(d => setReferenceDevices(d.items));
  }, []);

  const handleDeviceSelection = (deviceId: string) => {
    const device = testDevices.find((d: any) => d.id === parseInt(deviceId));
    const defaultRef = referenceDevices[0];

    if (device) {
      setSelectedDeviceId(device.id);
      setSelectedRefDeviceId(defaultRef?.id || null);
      setFormData({
        ...formData,
        deviceNumber: device.deviceCode,
        deviceName: device.deviceName,
        calibrationFrequency: device.calibrationFrequency || '',
        lastCalibrationDate: device.calibrationDate ? new Date(device.calibrationDate).toISOString().split('T')[0] : '',
        minRange: device.minRange?.toString() || '0',
        maxRange: device.maxRange?.toString() || '0',
        verificationValue1: device.verificationValues?.[0]?.toString() || '',
        verificationValue2: device.verificationValues?.[1]?.toString() || '',
        verificationValue3: device.verificationValues?.[2]?.toString() || '',
        verificationValue4: device.verificationValues?.[3]?.toString() || '',
        verificationValue5: device.verificationValues?.[4]?.toString() || '',
        verificationValue6: device.verificationValues?.[5]?.toString() || '',
        tolerance1: device.toleranceValues?.[0] || 0,
        tolerance2: device.toleranceValues?.[1] || 0,
        tolerance3: device.toleranceValues?.[2] || 0,
        tolerance4: device.toleranceValues?.[3] || 0,
        tolerance5: device.toleranceValues?.[4] || 0,
        tolerance6: device.toleranceValues?.[5] || 0,
        referenceDevice: defaultRef?.deviceName || '',
        referenceDeviceSerial: defaultRef?.deviceCode || '',
        referenceUncertainty1: defaultRef?.uncertaintyValues?.[0] || 0,
        referenceUncertainty2: defaultRef?.uncertaintyValues?.[1] || 0,
        referenceUncertainty3: defaultRef?.uncertaintyValues?.[2] || 0,
        referenceUncertainty4: defaultRef?.uncertaintyValues?.[3] || 0,
        referenceUncertainty5: defaultRef?.uncertaintyValues?.[4] || 0,
        referenceUncertainty6: defaultRef?.uncertaintyValues?.[5] || 0,
      });
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setUploadedFiles([...uploadedFiles, ...newFiles]);
    }
  };

  const handleFileRemove = (index: number) => {
    setUploadedFiles(uploadedFiles.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDeviceId || !selectedRefDeviceId) return;
    setSubmitting(true);

    try {
      const points = [];
      for (let i = 1; i <= 6; i++) {
        const asc = measurements[`ascending${i}` as keyof MeasurementValues];
        const desc = measurements[`descending${i}` as keyof MeasurementValues];
        if (!asc || !desc) continue;
        points.push({
          pointNumber: i,
          verificationValue: parseFloat(formData[`verificationValue${i}` as keyof CalibrationFormData] as string) || 0,
          ascendingValue: parseFloat(asc),
          descendingValue: parseFloat(desc),
          tolerance: (formData as any)[`tolerance${i}`] || 0,
          uncertainty: (formData as any)[`referenceUncertainty${i}`] || 0,
        });
      }

      const calibration = await calibrationsApi.create({
        deviceId: selectedDeviceId,
        referenceDeviceId: selectedRefDeviceId,
        calibrationDate: formData.newCalibrationDate ? new Date(formData.newCalibrationDate).toISOString() : new Date().toISOString(),
        temperature: formData.temperature ? parseFloat(formData.temperature) : null,
        humidity: formData.humidity ? parseFloat(formData.humidity) : null,
        pressure: formData.pressure ? parseFloat(formData.pressure) : null,
        calibratedBy: formData.calibratedBy,
        measurementPoints: points,
      });

      // Upload files if any
      for (const file of uploadedFiles) {
        await filesApi.upload(calibration.id, file);
      }

      alert('Kalibrasyon verisi başarıyla kaydedildi ve onaya gönderildi!');
      navigate('/dashboard');
    } catch (err: any) {
      alert('Hata: ' + (err.message || 'Kayıt başarısız'));
    } finally {
      setSubmitting(false);
    }
  };

  const updateMeasurement = (field: keyof MeasurementValues, value: string) => {
    setMeasurements({ ...measurements, [field]: value });
  };

  return (
    <div className="min-h-screen w-full bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate('/device-list')}
            className="flex items-center gap-2 text-[#1F2A44] hover:text-[#2d3d5f] transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
            <span className="text-lg font-medium">Geri</span>
          </button>

          <h1 className="text-4xl font-bold text-[#1F2A44]">Kalibrasyon Girişi</h1>

          <button
            onClick={() => navigate('/')}
            className="flex items-center justify-center w-12 h-12 bg-[#1F2A44] hover:bg-[#2d3d5f] rounded-full transition-colors"
          >
            <Home className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-8">
          <div className="space-y-6">
            {/* Device Selector */}
            <div className="space-y-2">
              <Label htmlFor="deviceSelector">Cihaz Seçin</Label>
              <Select onValueChange={handleDeviceSelection}>
                <SelectTrigger id="deviceSelector" className="h-14 text-lg bg-gray-50 rounded-lg">
                  <SelectValue placeholder="Kalibrasyon yapılacak cihazı seçin" />
                </SelectTrigger>
                <SelectContent>
                  {testDevices.map((device: any) => (
                    <SelectItem key={device.id} value={device.id.toString()}>
                      {device.deviceCode} - {device.deviceName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Device Info Card */}
            {formData.deviceNumber && (
              <DeviceInfoCard
                deviceNumber={formData.deviceNumber}
                deviceName={formData.deviceName}
                calibrationFrequency={formData.calibrationFrequency}
                lastCalibrationDate={formData.lastCalibrationDate}
                newCalibrationDate={formData.newCalibrationDate}
                minRange={formData.minRange}
                maxRange={formData.maxRange}
                onNewCalibrationDateChange={(date) =>
                  setFormData({ ...formData, newCalibrationDate: date })
                }
              />
            )}

            {/* Measurement Points */}
            {formData.deviceNumber && (
              <div className="space-y-6 mt-8">
                <div className="border-t-2 border-[#1F2A44] pt-6">
                  <h2 className="text-2xl font-bold text-[#1F2A44] mb-4">ÖLÇÜM NOKTALARI</h2>
                </div>

                <MeasurementPointCard
                  pointNumber={1}
                  verificationValue={formData.verificationValue1}
                  ascendingValue={measurements.ascending1}
                  descendingValue={measurements.descending1}
                  uncertainty={formData.referenceUncertainty1}
                  tolerance={formData.tolerance1}
                  onAscendingChange={(val) => updateMeasurement('ascending1', val)}
                  onDescendingChange={(val) => updateMeasurement('descending1', val)}
                  gradientColors={MEASUREMENT_POINT_STYLES[0].gradient}
                  borderColor={MEASUREMENT_POINT_STYLES[0].border}
                />

                <MeasurementPointCard
                  pointNumber={2}
                  verificationValue={formData.verificationValue2}
                  ascendingValue={measurements.ascending2}
                  descendingValue={measurements.descending2}
                  uncertainty={formData.referenceUncertainty2}
                  tolerance={formData.tolerance2}
                  onAscendingChange={(val) => updateMeasurement('ascending2', val)}
                  onDescendingChange={(val) => updateMeasurement('descending2', val)}
                  gradientColors={MEASUREMENT_POINT_STYLES[1].gradient}
                  borderColor={MEASUREMENT_POINT_STYLES[1].border}
                />

                <MeasurementPointCard
                  pointNumber={3}
                  verificationValue={formData.verificationValue3}
                  ascendingValue={measurements.ascending3}
                  descendingValue={measurements.descending3}
                  uncertainty={formData.referenceUncertainty3}
                  tolerance={formData.tolerance3}
                  onAscendingChange={(val) => updateMeasurement('ascending3', val)}
                  onDescendingChange={(val) => updateMeasurement('descending3', val)}
                  gradientColors={MEASUREMENT_POINT_STYLES[2].gradient}
                  borderColor={MEASUREMENT_POINT_STYLES[2].border}
                />

                <MeasurementPointCard
                  pointNumber={4}
                  verificationValue={formData.verificationValue4}
                  ascendingValue={measurements.ascending4}
                  descendingValue={measurements.descending4}
                  uncertainty={formData.referenceUncertainty4}
                  tolerance={formData.tolerance4}
                  onAscendingChange={(val) => updateMeasurement('ascending4', val)}
                  onDescendingChange={(val) => updateMeasurement('descending4', val)}
                  gradientColors={MEASUREMENT_POINT_STYLES[3].gradient}
                  borderColor={MEASUREMENT_POINT_STYLES[3].border}
                />

                <MeasurementPointCard
                  pointNumber={5}
                  verificationValue={formData.verificationValue5}
                  ascendingValue={measurements.ascending5}
                  descendingValue={measurements.descending5}
                  uncertainty={formData.referenceUncertainty5}
                  tolerance={formData.tolerance5}
                  onAscendingChange={(val) => updateMeasurement('ascending5', val)}
                  onDescendingChange={(val) => updateMeasurement('descending5', val)}
                  gradientColors={MEASUREMENT_POINT_STYLES[4].gradient}
                  borderColor={MEASUREMENT_POINT_STYLES[4].border}
                />

                <MeasurementPointCard
                  pointNumber={6}
                  verificationValue={formData.verificationValue6}
                  ascendingValue={measurements.ascending6}
                  descendingValue={measurements.descending6}
                  uncertainty={formData.referenceUncertainty6}
                  tolerance={formData.tolerance6}
                  onAscendingChange={(val) => updateMeasurement('ascending6', val)}
                  onDescendingChange={(val) => updateMeasurement('descending6', val)}
                  gradientColors={MEASUREMENT_POINT_STYLES[5].gradient}
                  borderColor={MEASUREMENT_POINT_STYLES[5].border}
                />
              </div>
            )}

            {/* Environment Conditions */}
            {formData.deviceNumber && (
              <EnvironmentConditions
                temperature={formData.temperature}
                humidity={formData.humidity}
                pressure={formData.pressure}
                onTemperatureChange={(val) => setFormData({ ...formData, temperature: val })}
                onHumidityChange={(val) => setFormData({ ...formData, humidity: val })}
                onPressureChange={(val) => setFormData({ ...formData, pressure: val })}
              />
            )}

            {/* Reference Device Info */}
            {formData.deviceNumber && (
              <ReferenceDeviceInfo
                deviceName={formData.referenceDevice}
                deviceSerial={formData.referenceDeviceSerial}
                uncertainties={[
                  formData.referenceUncertainty1,
                  formData.referenceUncertainty2,
                  formData.referenceUncertainty3,
                  formData.referenceUncertainty4,
                  formData.referenceUncertainty5,
                  formData.referenceUncertainty6,
                ]}
              />
            )}

            {/* Calibrated By */}
            {formData.deviceNumber && (
              <div className="mt-8 space-y-4">
                <div className="border-t-2 border-[#1F2A44] pt-6">
                  <h2 className="text-2xl font-bold text-[#1F2A44] mb-4">
                    KALİBRASYONU YAPAN
                  </h2>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="calibratedBy">İsim Soyisim / Unvan</Label>
                  <Input
                    id="calibratedBy"
                    type="text"
                    value={formData.calibratedBy}
                    onChange={(e) => setFormData({ ...formData, calibratedBy: e.target.value })}
                    className="h-14 text-lg bg-gray-50 rounded-lg"
                    placeholder="Örn: Mehmet Yılmaz / Kalibrasyon Teknisyeni"
                    required
                  />
                </div>
              </div>
            )}

            {/* File Upload */}
            {formData.deviceNumber && (
              <FileUploadSection
                uploadedFiles={uploadedFiles}
                onFileUpload={handleFileUpload}
                onFileRemove={handleFileRemove}
              />
            )}

            {/* Submit Button */}
            {formData.deviceNumber && (
              <div className="flex justify-end pt-6">
                <Button type="submit" disabled={submitting} className="h-14 px-12 text-lg bg-[#1F2A44] hover:bg-[#2d3d5f]">
                  {submitting ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
                  {submitting ? 'Kaydediliyor...' : 'Kalibrasyon Kaydını Tamamla'}
                </Button>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
