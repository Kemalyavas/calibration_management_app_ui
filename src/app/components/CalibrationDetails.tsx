import { useNavigate, useLocation } from 'react-router';
import { ArrowLeft, Disc, Download, Image as ImageIcon } from 'lucide-react';

// Mock kalibrasyon detayları
const calibrationDetails = {
  1: {
    deviceCode: 'A002',
    deviceName: 'BASINÇ ÖLÇER',
    machineCode: 'BANBURY 9',
    calibrationDate: '23.02.2026',
    calibratedBy: 'Operator Mehmet',
    nextCalibrationDate: '23.08.2026',
    referenceStandard: 'REF-PRESS-001',
    environmentTemp: '22°C',
    environmentHumidity: '45%',
    testPoints: [
      { point: '0 PSI', measured: '0.1 PSI', reference: '0 PSI', deviation: '+0.1', status: 'pass' },
      { point: '25 PSI', measured: '25.2 PSI', reference: '25 PSI', deviation: '+0.2', status: 'pass' },
      { point: '50 PSI', measured: '50.1 PSI', reference: '50 PSI', deviation: '+0.1', status: 'pass' },
      { point: '75 PSI', measured: '74.9 PSI', reference: '75 PSI', deviation: '-0.1', status: 'pass' },
      { point: '100 PSI', measured: '100.0 PSI', reference: '100 PSI', deviation: '0', status: 'pass' },
    ],
    attachments: [
      { name: 'kalibrasyon_raporu.pdf', type: 'pdf' },
      { name: 'cihaz_fotoğraf_1.jpg', type: 'image' },
      { name: 'test_sonuclari.xlsx', type: 'excel' },
    ],
    notes: 'Tüm test noktaları tolerans içinde. Cihaz mükemmel durumda.',
    result: 'BAŞARILI',
  },
  3: {
    deviceCode: 'C005',
    deviceName: 'BASINÇ ÖLÇER',
    machineCode: 'MIXER 02',
    calibrationDate: '21.02.2026',
    calibratedBy: 'Operator Can',
    nextCalibrationDate: '21.08.2026',
    referenceStandard: 'REF-PRESS-002',
    environmentTemp: '21°C',
    environmentHumidity: '48%',
    testPoints: [
      { point: '0 PSI', measured: '0.0 PSI', reference: '0 PSI', deviation: '0', status: 'pass' },
      { point: '25 PSI', measured: '25.1 PSI', reference: '25 PSI', deviation: '+0.1', status: 'pass' },
      { point: '50 PSI', measured: '50.0 PSI', reference: '50 PSI', deviation: '0', status: 'pass' },
      { point: '75 PSI', measured: '75.2 PSI', reference: '75 PSI', deviation: '+0.2', status: 'pass' },
      { point: '100 PSI', measured: '99.9 PSI', reference: '100 PSI', deviation: '-0.1', status: 'pass' },
    ],
    attachments: [
      { name: 'yeni_standart_rapor.pdf', type: 'pdf' },
      { name: 'kalibrasyon_fotoğraf.jpg', type: 'image' },
    ],
    notes: 'Yeni referans standardı ile kalibrasyon yapıldı. Sonuçlar başarılı.',
    result: 'BAŞARILI',
  },
  5: {
    deviceCode: 'C001',
    deviceName: 'pH Ölçer',
    machineCode: 'MIXER 01',
    calibrationDate: '19.02.2026',
    calibratedBy: 'Operator Ayşe',
    nextCalibrationDate: '19.08.2026',
    referenceStandard: 'REF-PH-001',
    environmentTemp: '23°C',
    environmentHumidity: '42%',
    testPoints: [
      { point: 'pH 4', measured: 'pH 4.02', reference: 'pH 4', deviation: '+0.02', status: 'pass' },
      { point: 'pH 7', measured: 'pH 7.01', reference: 'pH 7', deviation: '+0.01', status: 'pass' },
      { point: 'pH 10', measured: 'pH 10.08', reference: 'pH 10', deviation: '+0.08', status: 'warning' },
    ],
    attachments: [
      { name: 'ph_kalibrasyon.pdf', type: 'pdf' },
    ],
    notes: 'pH 10 test noktası tolerans sınırında. Bir sonraki kalibrasyonda dikkat edilmeli.',
    result: 'UYARI',
  },
};

export function CalibrationDetails() {
  const navigate = useNavigate();
  const location = useLocation();
  const approvalId = location.state?.approvalId;

  const details = calibrationDetails[approvalId as keyof typeof calibrationDetails];

  if (!details) {
    return (
      <div className="min-h-screen w-full bg-gray-100 p-8 flex items-center justify-center">
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-700">Kalibrasyon detayları bulunamadı</p>
          <button
            onClick={() => navigate('/approval-list')}
            className="mt-4 text-[#1F2A44] hover:underline"
          >
            Onay listesine dön
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate('/approval-list')}
            className="flex items-center gap-2 text-[#1F2A44] hover:text-[#2d3d5f] transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
            <span className="text-lg font-medium">Geri</span>
          </button>
          
          <div className="flex items-center gap-3 bg-[#1F2A44] text-white px-6 py-3 rounded-xl">
            <Disc className="w-6 h-6" />
            <h1 className="text-xl font-bold">PROMETEON TURKEY</h1>
          </div>
        </div>

        <h1 className="text-4xl font-bold text-[#1F2A44] text-center mb-8">
          Kalibrasyon Detayları
        </h1>

        {/* Main Info */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="grid grid-cols-3 gap-6 mb-6">
            <div>
              <p className="text-sm text-gray-500 mb-1">Makine Kodu</p>
              <p className="text-xl font-bold text-[#1F2A44]">{details.machineCode}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Cihaz Kodu</p>
              <p className="text-xl font-bold text-[#1F2A44]">{details.deviceCode}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Cihaz Adı</p>
              <p className="text-xl font-bold text-[#1F2A44]">{details.deviceName}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 pt-4 border-t border-gray-200">
            <div>
              <p className="text-sm text-gray-500 mb-1">Kalibrasyon Tarihi</p>
              <p className="font-semibold text-gray-900">{details.calibrationDate}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Kalibre Eden</p>
              <p className="font-semibold text-gray-900">{details.calibratedBy}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Sonraki Kalibrasyon</p>
              <p className="font-semibold text-gray-900">{details.nextCalibrationDate}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Referans Standart</p>
              <p className="font-semibold text-gray-900">{details.referenceStandard}</p>
            </div>
          </div>
        </div>

        {/* Environmental Conditions */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-bold text-[#1F2A44] mb-4">Çevre Koşulları</h2>
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">Sıcaklık</p>
              <p className="text-2xl font-bold text-blue-700">{details.environmentTemp}</p>
            </div>
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">Nem</p>
              <p className="text-2xl font-bold text-blue-700">{details.environmentHumidity}</p>
            </div>
          </div>
        </div>

        {/* Test Points */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-bold text-[#1F2A44] mb-4">Test Noktaları</h2>
          <div className="overflow-hidden rounded-lg border border-gray-200">
            <table className="w-full">
              <thead className="bg-[#1F2A44] text-white">
                <tr>
                  <th className="px-6 py-3 text-left font-semibold">Test Noktası</th>
                  <th className="px-6 py-3 text-left font-semibold">Ölçülen Değer</th>
                  <th className="px-6 py-3 text-left font-semibold">Referans Değer</th>
                  <th className="px-6 py-3 text-left font-semibold">Sapma</th>
                  <th className="px-6 py-3 text-left font-semibold">Durum</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {details.testPoints.map((point, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">{point.point}</td>
                    <td className="px-6 py-4 text-gray-700">{point.measured}</td>
                    <td className="px-6 py-4 text-gray-700">{point.reference}</td>
                    <td className="px-6 py-4 text-gray-700">{point.deviation}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          point.status === 'pass'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {point.status === 'pass' ? 'BAŞARILI' : 'UYARI'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Attachments */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-bold text-[#1F2A44] mb-4">Ekli Dosyalar</h2>
          <div className="grid grid-cols-1 gap-3">
            {details.attachments.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#1F2A44] rounded-lg flex items-center justify-center">
                    {file.type === 'image' ? (
                      <ImageIcon className="w-5 h-5 text-white" />
                    ) : (
                      <Download className="w-5 h-5 text-white" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{file.name}</p>
                    <p className="text-sm text-gray-500 uppercase">{file.type}</p>
                  </div>
                </div>
                <button className="flex items-center gap-2 text-[#1F2A44] hover:text-[#2d3d5f] font-medium transition-colors">
                  <Download className="w-5 h-5" />
                  <span>İndir</span>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Notes and Result */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-bold text-[#1F2A44] mb-4">Notlar ve Sonuç</h2>
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <p className="text-gray-700">{details.notes}</p>
          </div>
          <div
            className={`p-4 rounded-lg font-bold text-center text-lg ${
              details.result === 'BAŞARILI'
                ? 'bg-green-100 text-green-800'
                : 'bg-yellow-100 text-yellow-800'
            }`}
          >
            KALİBRASYON SONUCU: {details.result}
          </div>
        </div>
      </div>
    </div>
  );
}
