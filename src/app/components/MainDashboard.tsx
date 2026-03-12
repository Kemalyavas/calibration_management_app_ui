import { useNavigate } from 'react-router';
import { Plus, RefreshCw, LogOut, Disc, CheckCircle } from 'lucide-react';
import { useUser } from '../contexts/UserContext';

export function MainDashboard() {
  const navigate = useNavigate();
  const { logout, userRole } = useUser();

  const handleLogout = () => {
    logout();
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
          
          <h1 className="text-4xl font-bold text-[#1F2A44]">
            Kalibrasyon Yönetim Sistemi
          </h1>
          
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Çıkış</span>
          </button>
        </div>

        {/* Main Action Buttons */}
        <div className={`grid grid-cols-1 ${userRole === 'manager' ? 'md:grid-cols-3' : 'md:grid-cols-2'} gap-8 max-w-6xl mx-auto`}>
          <button
            onClick={() => navigate('/add-device')}
            className="group bg-white rounded-2xl p-12 shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300"
          >
            <div className="flex flex-col items-center space-y-6">
              <div className="w-32 h-32 bg-[#1F2A44] rounded-2xl flex items-center justify-center group-hover:bg-[#2d3d5f] transition-colors">
                <Plus className="w-16 h-16 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-[#1F2A44] text-center">
                Cihaz Ekle
              </h2>
            </div>
          </button>

          <button
            onClick={() => navigate('/device-list')}
            className="group bg-white rounded-2xl p-12 shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300"
          >
            <div className="flex flex-col items-center space-y-6">
              <div className="w-32 h-32 bg-[#1F2A44] rounded-2xl flex items-center justify-center group-hover:bg-[#2d3d5f] transition-colors">
                <RefreshCw className="w-16 h-16 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-[#1F2A44] text-center">
                Cihaz Güncelle
              </h2>
            </div>
          </button>

          {userRole === 'manager' && (
            <button
              onClick={() => navigate('/approval-list')}
              className="group bg-white rounded-2xl p-12 shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 relative"
            >
              <div className="flex flex-col items-center space-y-6">
                <div className="w-32 h-32 bg-green-600 rounded-2xl flex items-center justify-center group-hover:bg-green-700 transition-colors">
                  <CheckCircle className="w-16 h-16 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-[#1F2A44] text-center">
                  Onay Bekleyenler
                </h2>
              </div>
              {/* Notification Badge */}
              <div className="absolute top-4 right-4 bg-red-500 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-lg shadow-lg">
                5
              </div>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}