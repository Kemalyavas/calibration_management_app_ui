import { useNavigate } from 'react-router';
import { Plus, RefreshCw, Eye, ClipboardList, FileText, Calendar, CheckCircle, Home, Disc, LogOut } from 'lucide-react';
import { useUser } from '../contexts/UserContext';

const actions = [
  { id: 1, name: 'Cihaz Ekle', icon: Plus, path: '/add-device', roles: ['operator', 'manager'] },
  { id: 2, name: 'Cihaz Güncelle', icon: RefreshCw, path: '/update-device', roles: ['operator', 'manager'] },
  { id: 3, name: 'Cihaz Görüntüle', icon: Eye, path: '/view-device', roles: ['guest', 'operator', 'manager'] },
  { id: 4, name: 'Kalibrasyon Girişi', icon: ClipboardList, path: '/calibration-entry', roles: ['operator', 'manager'] },
  { id: 5, name: 'Prosedür', icon: FileText, path: '/dashboard', roles: ['guest', 'operator', 'manager'] },
  { id: 6, name: 'Yaklaşan Kalibrasyonlar', icon: Calendar, path: '/dashboard', roles: ['operator', 'manager'] },
  { id: 7, name: 'Onay', icon: CheckCircle, path: '/dashboard', roles: ['manager'] },
];

export function CalibrationDashboard() {
  const navigate = useNavigate();
  const { userRole, logout, selectedDepartment, selectedMachine, selectedCalibrationType } = useUser();

  // Kullanıcı rolüne göre butonları filtrele
  const filteredActions = actions.filter(action => 
    action.roles.includes(userRole || '')
  );

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getRoleName = () => {
    switch(userRole) {
      case 'guest': return 'MİSAFİR';
      case 'operator': return 'OPERATÖR';
      case 'manager': return 'MÜDÜR';
      default: return '';
    }
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
          
          <div className="flex flex-col items-center">
            <h1 className="text-4xl font-bold text-[#1F2A44]">
              {selectedCalibrationType || 'Kalibrasyon Paneli'}
            </h1>
            <span className="text-sm text-gray-600 mt-2">
              {selectedDepartment} - {selectedMachine} | Kullanıcı: {getRoleName()}
            </span>
          </div>
          
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Çıkış</span>
          </button>
        </div>

        {/* Action buttons grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
          {filteredActions.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.id}
                onClick={() => navigate(action.path)}
                className="group bg-white rounded-2xl p-8 shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                <div className="flex flex-col items-center space-y-4">
                  <div className="w-20 h-20 bg-[#1F2A44] rounded-xl flex items-center justify-center group-hover:bg-[#2d3d5f] transition-colors">
                    <Icon className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-[#1F2A44] text-center">
                    {action.name}
                  </h3>
                </div>
              </button>
            );
          })}
        </div>

        {/* Home button */}
        <div className="flex justify-end">
          <button
            onClick={() => navigate('/')}
            className="flex items-center justify-center w-16 h-16 bg-[#1F2A44] hover:bg-[#2d3d5f] rounded-full shadow-lg transition-colors"
          >
            <Home className="w-8 h-8 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}