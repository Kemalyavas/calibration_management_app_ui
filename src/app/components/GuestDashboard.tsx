import { useNavigate } from 'react-router';
import { Eye, FileText, LogOut, Disc } from 'lucide-react';

export function GuestDashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen w-full bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-3 bg-[#1F2A44] text-white px-6 py-3 rounded-xl">
            <Disc className="w-6 h-6" />
            <h1 className="text-xl font-bold">PROMETEON TURKEY</h1>
          </div>
          
          <div className="text-center">
            <h1 className="text-4xl font-bold text-[#1F2A44]">
              Misafir Paneli
            </h1>
            <p className="text-gray-600 mt-2">Görüntüleme Yetkileri</p>
          </div>
          
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Çıkış</span>
          </button>
        </div>

        {/* Guest Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <button
            onClick={() => navigate('/view-device')}
            className="group bg-white rounded-2xl p-12 shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300"
          >
            <div className="flex flex-col items-center space-y-6">
              <div className="w-32 h-32 bg-[#1F2A44] rounded-2xl flex items-center justify-center group-hover:bg-[#2d3d5f] transition-colors">
                <Eye className="w-16 h-16 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-[#1F2A44] text-center">
                Cihaz Görüntüle
              </h2>
            </div>
          </button>

          <button
            onClick={() => navigate('/view-procedure')}
            className="group bg-white rounded-2xl p-12 shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300"
          >
            <div className="flex flex-col items-center space-y-6">
              <div className="w-32 h-32 bg-[#1F2A44] rounded-2xl flex items-center justify-center group-hover:bg-[#2d3d5f] transition-colors">
                <FileText className="w-16 h-16 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-[#1F2A44] text-center">
                Prosedür Görüntüle
              </h2>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
