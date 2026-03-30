import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Home, FileText, Download } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useUser } from '../contexts/UserContext';
import { proceduresApi } from '../services/api';

export function ViewProcedure() {
  const navigate = useNavigate();
  const { userRole } = useUser();
  const [procedures, setProcedures] = useState<any[]>([]);
  const [selectedProcedure, setSelectedProcedure] = useState<any>(null);

  useEffect(() => {
    proceduresApi.list().then(setProcedures);
  }, []);

  const [loadingProc, setLoadingProc] = useState(false);

  const handleSelect = async (procId: string) => {
    setLoadingProc(true);
    try {
      const proc = await proceduresApi.get(parseInt(procId));
      setSelectedProcedure(proc);
    } catch {
      alert('Prosedür yüklenemedi.');
    } finally {
      setLoadingProc(false);
    }
  };

  const handleBack = () => {
    if (userRole === 'guest') navigate('/guest-dashboard');
    else navigate('/device-list');
  };

  return (
    <div className="min-h-screen w-full bg-gray-100 p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <button onClick={handleBack} className="flex items-center gap-2 text-[#1F2A44] hover:text-[#2d3d5f] transition-colors">
            <ArrowLeft className="w-6 h-6" /><span className="text-lg font-medium">Geri</span>
          </button>
          <h1 className="text-4xl font-bold text-[#1F2A44]">Prosedür Görüntüle</h1>
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 px-6 py-3 bg-[#1F2A44] hover:bg-[#2d3d5f] text-white rounded-xl transition-colors shadow-md">
              <Download className="w-5 h-5" /><span className="font-medium">Prosedür İndir</span>
            </button>
            <button onClick={() => navigate('/')} className="flex items-center justify-center w-12 h-12 bg-[#1F2A44] hover:bg-[#2d3d5f] rounded-full transition-colors">
              <Home className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="space-y-2">
            <label className="text-lg font-medium text-gray-700">Prosedür Seçin</label>
            <Select onValueChange={handleSelect}>
              <SelectTrigger className="h-12 bg-gray-50 rounded-lg"><SelectValue placeholder="Bir prosedür seçin" /></SelectTrigger>
              <SelectContent>
                {procedures.map((p: any) => (
                  <SelectItem key={p.id} value={p.id.toString()}>{p.procedureNumber} - {p.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {selectedProcedure && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center gap-4 mb-6 pb-4 border-b-2 border-gray-200">
              <FileText className="w-8 h-8 text-[#1F2A44]" />
              <h2 className="text-2xl font-bold text-[#1F2A44]">Prosedür Detayları</h2>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-500">Prosedür Numarası</p>
                  <p className="text-lg font-semibold text-gray-900">{selectedProcedure.procedureNumber}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-500">Prosedür Adı</p>
                  <p className="text-lg font-semibold text-gray-900">{selectedProcedure.name}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-500">Versiyon</p>
                  <p className="text-lg font-semibold text-gray-900">{selectedProcedure.version || '-'}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-500">Kalibrasyon Tipi</p>
                  <p className="text-lg font-semibold text-gray-900">{selectedProcedure.calibrationTypeName || '-'}</p>
                </div>
              </div>

              {selectedProcedure.purpose && (
                <div className="mt-6">
                  <h3 className="text-xl font-bold text-[#1F2A44] mb-3">Amaç</h3>
                  <div className="bg-gray-50 rounded-xl p-6">
                    <p className="text-gray-700 leading-relaxed">{selectedProcedure.purpose}</p>
                  </div>
                </div>
              )}

              {selectedProcedure.content && (
                <div className="mt-6">
                  <h3 className="text-xl font-bold text-[#1F2A44] mb-3">Kalibrasyon Adımları</h3>
                  <div className="bg-gray-50 rounded-xl p-6 space-y-4">
                    {selectedProcedure.content.split('\n').map((line: string, idx: number) => (
                      <div key={idx} className="flex gap-4">
                        <span className="flex-shrink-0 w-8 h-8 bg-[#1F2A44] text-white rounded-full flex items-center justify-center font-bold text-sm">{idx + 1}</span>
                        <p className="text-gray-700 pt-1">{line.replace(/^\d+\.\s*/, '')}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedProcedure.equipmentList && (
                <div className="mt-6">
                  <h3 className="text-xl font-bold text-[#1F2A44] mb-3">Gerekli Ekipman</h3>
                  <div className="bg-blue-50 rounded-xl p-6 border-2 border-blue-200">
                    <p className="text-gray-700">{selectedProcedure.equipmentList}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
