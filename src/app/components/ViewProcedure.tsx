import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Home, FileText, Download } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useUser } from '../contexts/UserContext';

export function ViewProcedure() {
  const navigate = useNavigate();
  const { userRole } = useUser();
  const [selectedProcedure, setSelectedProcedure] = useState('');

  const handleBack = () => {
    if (userRole === 'guest') {
      navigate('/guest-dashboard');
    } else {
      navigate('/device-list');
    }
  };

  const handleDownloadProcedure = () => {
    // Prosedür indirme fonksiyonu - şimdilik sadece buton olarak
    console.log('Prosedür indirilecek');
  };

  return (
    <div className="min-h-screen w-full bg-gray-100 p-8">
      <div className="max-w-5xl mx-auto">
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
            Prosedür Görüntüle
          </h1>
          
          <div className="flex items-center gap-4">
            <button
              onClick={handleDownloadProcedure}
              className="flex items-center gap-2 px-6 py-3 bg-[#1F2A44] hover:bg-[#2d3d5f] text-white rounded-xl transition-colors shadow-md"
            >
              <Download className="w-5 h-5" />
              <span className="font-medium">Prosedür İndir</span>
            </button>
            <button
              onClick={() => navigate('/')}
              className="flex items-center justify-center w-12 h-12 bg-[#1F2A44] hover:bg-[#2d3d5f] rounded-full transition-colors"
            >
              <Home className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>

        {/* Procedure Selector */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="space-y-2">
            <label className="text-lg font-medium text-gray-700">Prosedür Seçin</label>
            <Select value={selectedProcedure} onValueChange={setSelectedProcedure}>
              <SelectTrigger className="h-12 bg-gray-50 rounded-lg">
                <SelectValue placeholder="Bir prosedür seçin" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="proc1">PROC-2024-001 - Basınç Ölçer Kalibrasyonu</SelectItem>
                <SelectItem value="proc2">PROC-2024-002 - Sıcaklık Sensörü Kalibrasyonu</SelectItem>
                <SelectItem value="proc3">PROC-2024-003 - Terazi Kalibrasyonu</SelectItem>
                <SelectItem value="proc4">PROC-2024-004 - pH Metre Kalibrasyonu</SelectItem>
                <SelectItem value="proc5">PROC-2024-005 - Uzunluk Ölçer Kalibrasyonu</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Procedure Details */}
        {selectedProcedure && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center gap-4 mb-6 pb-4 border-b-2 border-gray-200">
              <FileText className="w-8 h-8 text-[#1F2A44]" />
              <h2 className="text-2xl font-bold text-[#1F2A44]">Prosedür Detayları</h2>
            </div>

            <div className="space-y-6">
              {/* Prosedür Bilgileri */}
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-500">Prosedür Numarası</p>
                  <p className="text-lg font-semibold text-gray-900">PROC-2024-001</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-500">Prosedür Adı</p>
                  <p className="text-lg font-semibold text-gray-900">Basınç Ölçer Kalibrasyonu</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-500">Versiyon</p>
                  <p className="text-lg font-semibold text-gray-900">v2.3</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-500">Son Güncelleme</p>
                  <p className="text-lg font-semibold text-gray-900">15.01.2024</p>
                </div>
              </div>

              {/* Prosedür İçeriği */}
              <div className="mt-8 space-y-4">
                <h3 className="text-xl font-bold text-[#1F2A44]">Kalibrasyon Adımları</h3>
                
                <div className="bg-gray-50 rounded-xl p-6 space-y-4">
                  <div className="flex gap-4">
                    <span className="flex-shrink-0 w-8 h-8 bg-[#1F2A44] text-white rounded-full flex items-center justify-center font-bold">1</span>
                    <div>
                      <p className="font-semibold text-gray-900">Ön Hazırlık</p>
                      <p className="text-gray-700 mt-1">Cihazın temizliğini kontrol edin ve çalışma ortamını hazırlayın.</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <span className="flex-shrink-0 w-8 h-8 bg-[#1F2A44] text-white rounded-full flex items-center justify-center font-bold">2</span>
                    <div>
                      <p className="font-semibold text-gray-900">Referans Standart Hazırlığı</p>
                      <p className="text-gray-700 mt-1">Referans basınç standardını bağlayın ve stabilize olmasını bekleyin.</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <span className="flex-shrink-0 w-8 h-8 bg-[#1F2A44] text-white rounded-full flex items-center justify-center font-bold">3</span>
                    <div>
                      <p className="font-semibold text-gray-900">Ölçüm Noktaları</p>
                      <p className="text-gray-700 mt-1">0, 25, 50, 75, 100 PSI değerlerinde ölçüm yapın ve kaydedin.</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <span className="flex-shrink-0 w-8 h-8 bg-[#1F2A44] text-white rounded-full flex items-center justify-center font-bold">4</span>
                    <div>
                      <p className="font-semibold text-gray-900">Doğrulama</p>
                      <p className="text-gray-700 mt-1">Ölçüm sonuçlarını tolerans limitleri ile karşılaştırın.</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <span className="flex-shrink-0 w-8 h-8 bg-[#1F2A44] text-white rounded-full flex items-center justify-center font-bold">5</span>
                    <div>
                      <p className="font-semibold text-gray-900">Raporlama</p>
                      <p className="text-gray-700 mt-1">Kalibrasyon sonuçlarını kayıt altına alın ve etiketi yapıştırın.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tolerans Bilgileri */}
              <div className="mt-6 bg-blue-50 rounded-xl p-6">
                <h3 className="text-lg font-bold text-[#1F2A44] mb-3">Tolerans Limitleri</h3>
                <p className="text-gray-700">Maksimum izin verilen sapma: ±0.5% tam ölçek</p>
                <p className="text-gray-700">Referans standart hassasiyeti: ±0.1% tam ölçek</p>
              </div>

              {/* Güvenlik Notları */}
              <div className="mt-6 bg-yellow-50 rounded-xl p-6">
                <h3 className="text-lg font-bold text-[#1F2A44] mb-3">Güvenlik Notları</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Kalibrasyon sırasında koruyucu ekipman kullanın</li>
                  <li>Maksimum basınç limitlerini aşmayın</li>
                  <li>Sadece yetkili personel tarafından gerçekleştirilmelidir</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {!selectedProcedure && (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">Görüntülemek için bir prosedür seçin</p>
          </div>
        )}
      </div>
    </div>
  );
}