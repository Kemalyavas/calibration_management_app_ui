import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, CheckCircle, XCircle, AlertCircle, FileText, Eye, Loader2 } from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import { approvalsApi } from '../services/api';

type ApprovalType = 'calibration' | 'device_update';
type ApprovalStatus = 'pending' | 'approved' | 'rejected';

interface MeasurementPoint {
  verificationValue: string;
  ascending: string;
  descending: string;
  hysteresis: string;
  absoluteDifference: string;
  uncertainty: number;
  status: 'UYGUN' | 'UYGUNSUZ' | 'BEKLİYOR';
}

interface ApprovalItem {
  id: number;
  type: ApprovalType;
  deviceCode: string;
  deviceName: string;
  machineCode: string;
  submittedBy: string;
  submittedDate: string;
  status: ApprovalStatus;
  changes?: string;
  calibrationResult?: string;
  measurements?: MeasurementPoint[];
  environmentalConditions?: {
    temperature: string;
    humidity: string;
    pressure: string;
  };
  referenceDevice?: string;
  referenceDeviceSerial?: string;
  calibratedBy?: string;
}

const mockApprovals: ApprovalItem[] = [
  {
    id: 1,
    type: 'calibration',
    deviceCode: 'A002',
    deviceName: 'BASINÇ ÖLÇER',
    machineCode: 'BANBURY 9',
    submittedBy: 'Operator Mehmet',
    submittedDate: '23.02.2026',
    status: 'pending',
    calibrationResult: 'BAŞARILI - Tüm test noktaları tolerans içinde',
    measurements: [
      { verificationValue: '10',  ascending: '10.3',  descending: '10.1',  hysteresis: '0.2000000', absoluteDifference: '0.8000000', uncertainty: 0.5, status: 'UYGUN' },
      { verificationValue: '25',  ascending: '25.2',  descending: '25.3',  hysteresis: '0.1000000', absoluteDifference: '0.8000000', uncertainty: 0.5, status: 'UYGUN' },
      { verificationValue: '40',  ascending: '40.4',  descending: '40.2',  hysteresis: '0.2000000', absoluteDifference: '0.9000000', uncertainty: 0.5, status: 'UYGUN' },
      { verificationValue: '60',  ascending: '60.1',  descending: '60.3',  hysteresis: '0.2000000', absoluteDifference: '0.8000000', uncertainty: 0.5, status: 'UYGUN' },
      { verificationValue: '80',  ascending: '80.2',  descending: '80.4',  hysteresis: '0.2000000', absoluteDifference: '0.9000000', uncertainty: 0.5, status: 'UYGUN' },
      { verificationValue: '100', ascending: '100.1', descending: '100.3', hysteresis: '0.2000000', absoluteDifference: '0.8000000', uncertainty: 0.5, status: 'UYGUN' },
    ],
    environmentalConditions: { temperature: '21.5', humidity: '48.2', pressure: '1005.3' },
    referenceDevice: 'GE / Druck DPI 620 Gemi 35 bar (0,001 bar çözünürlük)',
    referenceDeviceSerial: 'DR01',
    calibratedBy: 'Mehmet Yılmaz / Kalibrasyon Teknisyeni',
  },
  {
    id: 2,
    type: 'device_update',
    deviceCode: 'B007',
    deviceName: 'Uzunluk Ölçer',
    machineCode: '3 TRAFILA',
    submittedBy: 'Operator Ayşe',
    submittedDate: '22.02.2026',
    status: 'pending',
    changes: 'Kalibrasyon frekansı 6 aydan 3 aya güncellendi',
  },
  {
    id: 3,
    type: 'calibration',
    deviceCode: 'C005',
    deviceName: 'BASINÇ ÖLÇER',
    machineCode: 'MIXER 02',
    submittedBy: 'Operator Can',
    submittedDate: '21.02.2026',
    status: 'pending',
    calibrationResult: 'DİKKAT - Bir test noktası tolerans sınırında',
    measurements: [
      { verificationValue: '10',  ascending: '10.2',  descending: '10.1',  hysteresis: '0.1000000', absoluteDifference: '0.7000000', uncertainty: 0.5, status: 'UYGUN' },
      { verificationValue: '25',  ascending: '26.2',  descending: '26.0',  hysteresis: '0.2000000', absoluteDifference: '1.7000000', uncertainty: 0.5, status: 'UYGUNSUZ' },
      { verificationValue: '40',  ascending: '40.3',  descending: '40.1',  hysteresis: '0.2000000', absoluteDifference: '0.8000000', uncertainty: 0.5, status: 'UYGUN' },
      { verificationValue: '60',  ascending: '60.2',  descending: '60.0',  hysteresis: '0.2000000', absoluteDifference: '0.7000000', uncertainty: 0.5, status: 'UYGUN' },
      { verificationValue: '80',  ascending: '80.4',  descending: '80.1',  hysteresis: '0.3000000', absoluteDifference: '0.9000000', uncertainty: 0.5, status: 'UYGUN' },
      { verificationValue: '100', ascending: '100.2', descending: '100.0', hysteresis: '0.2000000', absoluteDifference: '0.7000000', uncertainty: 0.5, status: 'UYGUN' },
    ],
  },
  {
    id: 4,
    type: 'device_update',
    deviceCode: 'A003',
    deviceName: 'SICAKLIK SENSÖRÜ',
    machineCode: 'BANBURY 9',
    submittedBy: 'Operator Mehmet',
    submittedDate: '20.02.2026',
    status: 'pending',
    changes: 'Cihaz konumu değiştirildi: Hat 2 → Hat 3',
  },
  {
    id: 5,
    type: 'calibration',
    deviceCode: 'C001',
    deviceName: 'pH Ölçer',
    machineCode: 'MIXER 01',
    submittedBy: 'Operator Ayşe',
    submittedDate: '19.02.2026',
    status: 'pending',
    calibrationResult: 'OLUMSUZ - Test noktası tolerans dışında, cihaz bakıma alınmalı',
    measurements: [
      { verificationValue: '2',  ascending: '2.1',  descending: '2.0',  hysteresis: '0.1000000', absoluteDifference: '0.4000000', uncertainty: 0.3, status: 'UYGUN' },
      { verificationValue: '4',  ascending: '4.1',  descending: '4.0',  hysteresis: '0.1000000', absoluteDifference: '0.4000000', uncertainty: 0.3, status: 'UYGUN' },
      { verificationValue: '7',  ascending: '8.5',  descending: '8.3',  hysteresis: '0.2000000', absoluteDifference: '1.8000000', uncertainty: 0.3, status: 'UYGUNSUZ' },
      { verificationValue: '10', ascending: '10.1', descending: '10.0', hysteresis: '0.1000000', absoluteDifference: '0.4000000', uncertainty: 0.3, status: 'UYGUN' },
      { verificationValue: '12', ascending: '12.2', descending: '12.1', hysteresis: '0.1000000', absoluteDifference: '0.5000000', uncertainty: 0.3, status: 'UYGUN' },
      { verificationValue: '14', ascending: '14.1', descending: '14.0', hysteresis: '0.1000000', absoluteDifference: '0.4000000', uncertainty: 0.3, status: 'UYGUN' },
    ],
  },
];

export function ApprovalList() {
  const navigate = useNavigate();
  const { userRole } = useUser();
  const [approvals, setApprovals] = useState<ApprovalItem[]>([]);
  const [selectedType, setSelectedType] = useState<'all' | ApprovalType>('all');
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userRole !== 'manager') {
      navigate('/dashboard');
      return;
    }
    loadApprovals();
  }, [userRole, navigate]);

  const loadApprovals = async () => {
    setLoading(true);
    try {
      const data = await approvalsApi.list();
      setApprovals(data.map((a: any) => ({
        id: a.id,
        type: a.type as ApprovalType,
        deviceCode: a.deviceCode || '',
        deviceName: a.deviceName || '',
        machineCode: a.machineName || '',
        submittedBy: a.submittedBy,
        submittedDate: new Date(a.submittedAt).toLocaleDateString('tr-TR'),
        status: a.status as ApprovalStatus,
        changes: a.changes,
        calibrationResult: a.calibration?.overallStatus === 'Uygun' ? 'BAŞARILI - Tüm test noktaları tolerans içinde' :
                          a.calibration?.overallStatus === 'Uygunsuz' ? 'OLUMSUZ - Test noktası tolerans dışında' : undefined,
        measurements: a.calibration?.measurementPoints?.map((m: any) => ({
          verificationValue: m.verificationValue?.toString() || '',
          ascending: m.ascendingValue?.toString() || '',
          descending: m.descendingValue?.toString() || '',
          hysteresis: m.hysteresis?.toFixed(7) || '',
          absoluteDifference: m.absoluteDifference?.toFixed(7) || '',
          uncertainty: m.uncertainty || 0,
          status: m.status === 'Uygun' ? 'UYGUN' as const : m.status === 'Uygunsuz' ? 'UYGUNSUZ' as const : 'BEKLİYOR' as const,
        })),
        environmentalConditions: a.calibration ? {
          temperature: a.calibration.temperature?.toString() || '',
          humidity: a.calibration.humidity?.toString() || '',
          pressure: a.calibration.pressure?.toString() || '',
        } : undefined,
        referenceDevice: a.calibration?.referenceDeviceName,
        referenceDeviceSerial: a.calibration?.referenceDeviceSerial,
        calibratedBy: a.calibration?.calibratedBy,
      })));
    } catch {
      // error
    } finally {
      setLoading(false);
    }
  };

  if (userRole !== 'manager') {
    return null;
  }

  const handleApprove = async (id: number) => {
    try {
      await approvalsApi.approve(id);
      setApprovals(prev => prev.filter(item => item.id !== id));
    } catch (err: any) {
      alert('Onaylama başarısız: ' + (err.message || 'Bilinmeyen hata'));
    }
  };

  const handleReject = async (id: number) => {
    try {
      await approvalsApi.reject(id);
      setApprovals(prev => prev.filter(item => item.id !== id));
    } catch (err: any) {
      alert('Reddetme başarısız: ' + (err.message || 'Bilinmeyen hata'));
    }
  };

  const filteredApprovals = approvals.filter(item => {
    if (item.status !== 'pending') return false;
    if (selectedType === 'all') return true;
    return item.type === selectedType;
  });

  const getTypeLabel = (type: ApprovalType) =>
    type === 'calibration' ? 'Kalibrasyon' : 'Cihaz Güncelleme';

  const getTypeBadgeColor = (type: ApprovalType) =>
    type === 'calibration' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800';

  const getCalibrationResultColor = (result?: string) => {
    if (!result) return 'text-gray-700';
    if (result.includes('BAŞARILI')) return 'text-green-700';
    if (result.includes('DİKKAT')) return 'text-yellow-700';
    if (result.includes('OLUMSUZ')) return 'text-red-700';
    return 'text-gray-700';
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-[#1F2A44] text-white px-8 py-5 flex items-center gap-4 shadow-lg">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-white hover:text-gray-300 transition-colors"
        >
          <ArrowLeft size={22} />
          <span className="text-sm">Geri</span>
        </button>
        <div className="h-6 w-px bg-white/30" />
        <AlertCircle size={24} className="text-yellow-400" />
        <div>
          <h1 className="text-xl font-bold">Onay Bekleyenler</h1>
          <p className="text-xs text-gray-300">Manager onay paneli</p>
        </div>
        <div className="ml-auto bg-yellow-400 text-[#1F2A44] rounded-full px-4 py-1 font-bold text-sm">
          {filteredApprovals.length} bekleyen
        </div>
      </div>

      <div className="p-8 max-w-6xl mx-auto">
        {/* Filter Tabs */}
        <div className="flex gap-3 mb-6">
          {(['all', 'calibration', 'device_update'] as const).map(type => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-5 py-2 rounded-lg font-semibold text-sm transition-colors ${
                selectedType === type
                  ? 'bg-[#1F2A44] text-white shadow'
                  : 'bg-white text-gray-600 hover:bg-gray-200 border border-gray-200'
              }`}
            >
              {type === 'all' ? 'Tümü' : type === 'calibration' ? 'Kalibrasyonlar' : 'Cihaz Güncellemeleri'}
            </button>
          ))}
        </div>

        {filteredApprovals.length === 0 ? (
          <div className="bg-white rounded-2xl p-16 text-center shadow">
            <CheckCircle size={56} className="text-green-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">Bekleyen onay bulunmuyor.</p>
          </div>
        ) : (
          <div className="space-y-5">
            {filteredApprovals.map(item => (
              <div key={item.id} className="bg-white rounded-2xl shadow overflow-hidden border border-gray-100">
                {/* Card Header */}
                <div className="px-6 py-5 flex items-center gap-4">
                  <div className={`p-3 rounded-xl ${item.type === 'calibration' ? 'bg-blue-50' : 'bg-purple-50'}`}>
                    {item.type === 'calibration'
                      ? <FileText size={24} className="text-blue-600" />
                      : <AlertCircle size={24} className="text-purple-600" />
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${getTypeBadgeColor(item.type)}`}>
                        {getTypeLabel(item.type)}
                      </span>
                      <span className="font-bold text-[#1F2A44] text-base">{item.deviceName}</span>
                      <span className="text-gray-400 text-sm">· {item.deviceCode}</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>Makine: <span className="font-semibold text-gray-700">{item.machineCode}</span></span>
                      <span>·</span>
                      <span>Gönderen: <span className="font-semibold text-gray-700">{item.submittedBy}</span></span>
                      <span>·</span>
                      <span>{item.submittedDate}</span>
                    </div>
                    {item.calibrationResult && (
                      <p className={`text-sm font-semibold mt-1 ${getCalibrationResultColor(item.calibrationResult)}`}>
                        {item.calibrationResult}
                      </p>
                    )}
                    {item.changes && (
                      <p className="text-sm text-gray-600 mt-1">Değişiklik: {item.changes}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {item.type === 'calibration' && (
                      <button
                        onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 text-sm font-semibold transition-colors"
                      >
                        <Eye size={16} />
                        {expandedId === item.id ? 'Gizle' : 'Detay'}
                      </button>
                    )}
                    <button
                      onClick={() => handleApprove(item.id)}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 text-sm font-semibold transition-colors"
                    >
                      <CheckCircle size={16} />
                      Onayla
                    </button>
                    <button
                      onClick={() => handleReject(item.id)}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 text-sm font-semibold transition-colors"
                    >
                      <XCircle size={16} />
                      Reddet
                    </button>
                  </div>
                </div>

                {/* Expanded Detail */}
                {expandedId === item.id && item.measurements && (
                  <div className="border-t border-gray-100 px-6 pb-6 pt-4 bg-gray-50">
                    <h3 className="font-bold text-[#1F2A44] mb-3 text-base">Ölçüm Değerleri</h3>

                    {/* Table Header */}
                    <div className="grid grid-cols-7 gap-2 mb-2 px-3">
                      {['#', 'DOĞRULAMA DEĞERİ', 'ARTAN', 'AZALAN', 'HİSTERİSİS', 'MUTLAK FARK', 'DURUM'].map(h => (
                        <div key={h} className="text-xs font-bold text-gray-500 uppercase">{h}</div>
                      ))}
                    </div>

                    <div className="space-y-2">
                      {item.measurements.map((m, idx) => (
                        <div
                          key={idx}
                          className={`grid grid-cols-7 gap-2 px-3 py-3 rounded-xl border-2 ${
                            m.status === 'UYGUNSUZ'
                              ? 'bg-red-50 border-red-200'
                              : 'bg-white border-blue-100'
                          }`}
                        >
                          <div className="font-bold text-gray-500 text-sm">{idx + 1}</div>
                          <div className="font-bold text-gray-900 text-sm">{m.verificationValue}</div>
                          <div className="font-semibold text-gray-800 text-sm">{m.ascending}</div>
                          <div className="font-semibold text-gray-800 text-sm">{m.descending}</div>
                          <div className="font-semibold text-yellow-700 text-sm">{m.hysteresis}</div>
                          <div className="font-bold text-amber-600 text-sm bg-amber-50 rounded px-1">{m.absoluteDifference}</div>
                          <div>
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-bold ${
                              m.status === 'UYGUN' ? 'bg-green-100 text-green-800' :
                              m.status === 'UYGUNSUZ' ? 'bg-red-100 text-red-800' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {m.status === 'UYGUN' && '✓'}
                              {m.status === 'UYGUNSUZ' && '✗'}
                              {m.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Environmental Conditions */}
                    {item.environmentalConditions && (
                      <div className="mt-4 p-4 bg-teal-50 rounded-xl border-2 border-teal-200">
                        <h4 className="font-bold text-[#1F2A44] mb-3 text-sm">Ortam Şartları</h4>
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <p className="text-xs font-bold text-gray-500 mb-1">SICAKLIK</p>
                            <p className="font-bold text-gray-900">{item.environmentalConditions.temperature}°C</p>
                            <p className="text-xs text-gray-400">Standart: 20±5°C</p>
                          </div>
                          <div>
                            <p className="text-xs font-bold text-gray-500 mb-1">NEM</p>
                            <p className="font-bold text-gray-900">{item.environmentalConditions.humidity}%RH</p>
                            <p className="text-xs text-gray-400">Standart: 50±15%RH</p>
                          </div>
                          <div>
                            <p className="text-xs font-bold text-gray-500 mb-1">BASINÇ</p>
                            <p className="font-bold text-gray-900">{item.environmentalConditions.pressure} mBar</p>
                            <p className="text-xs text-gray-400">Standart: 1000±15 mBar</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Reference Device */}
                    {item.referenceDevice && (
                      <div className="mt-3 p-4 bg-purple-50 rounded-xl border-2 border-purple-200">
                        <h4 className="font-bold text-[#1F2A44] mb-1 text-sm">Referans Cihaz</h4>
                        <p className="font-semibold text-gray-900 text-sm">{item.referenceDevice}</p>
                        <p className="text-xs text-gray-500 mt-1">Seri No: {item.referenceDeviceSerial}</p>
                      </div>
                    )}

                    {item.calibratedBy && (
                      <div className="mt-3 p-3 bg-gray-100 rounded-xl">
                        <p className="text-xs text-gray-500">Kalibrasyon Yapan: <span className="font-semibold text-gray-700">{item.calibratedBy}</span></p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
