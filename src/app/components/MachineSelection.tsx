import { useNavigate } from 'react-router';
import { Factory, Flame, Snowflake, Package, Disc, Home, ChevronRight } from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import { useEffect } from 'react';

const machines = {
  Banbury: ['BANBURY 1', 'BANBURY 2', 'BANBURY 3', 'BANBURY 4', 'BANBURY 5', 'BANBURY 6', 'BANBURY 7', 'BANBURY 8', 'BANBURY 9'],
  'Hot Semi-Finished': [
    '9 TRAFİLA', '8 TRAFİLA', '5 TRAFİLA', '4 TRAFİLA', '3 TRAFİLA', '2 TRAFİLA', 
    'P.LİNER', 'YENİ P.LİNER', 'FOGLIETTA', 'YENİ FOGLIETTA', 
    'MİNİ RH', 'MİNİ RH-2', 'BANDINA 1', 'BANDINA 2', 'BANDINA 3', 
    'ZERO-1', 'ZERO-2'
  ],
  'Cold Semi-Finished': ['TTM VMI', 'KAMYON FISCHER', 'TTM İZMİT', 'OTO FISCHER', 'MESNAC CUTTER', 'VMI-2'],
  Confection: ['RM30/1', 'RM30/2', 'RM30/3', 'VAST 1', 'VAST 2', 'VAST 3', 'VAST 4', 'VAST 5'],
  Cooking: ['515', '516', '517', '518', '519', '520'],
  Finishing: ['RGX-1', 'RGX-2', 'RGX-3', 'HOFF-1', 'HOFF-2']
};

const departmentIcons: Record<string, any> = {
  'Banbury': Factory,
  'Hot Semi-Finished': Flame,
  'Cold Semi-Finished': Snowflake,
  'Confection': Package,
  'Cooking': Disc,
  'Finishing': Disc
};

export function MachineSelection() {
  const navigate = useNavigate();
  const { selectedDepartment, setSelectedMachine } = useUser();

  useEffect(() => {
    if (!selectedDepartment) {
      navigate('/departments');
    }
  }, [selectedDepartment, navigate]);

  if (!selectedDepartment) {
    return null;
  }

  const departmentMachines = machines[selectedDepartment as keyof typeof machines] || [];
  const DepartmentIcon = departmentIcons[selectedDepartment] || Factory;

  const handleMachineSelect = (machine: string) => {
    setSelectedMachine(machine);
    navigate('/calibration-types');
  };

  return (
    <div 
      className="min-h-screen w-full bg-gray-100 p-8"
      style={{
        backgroundImage: 'url(https://images.unsplash.com/photo-1602342654726-83c1ea525a9c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcmVjaXNpb24lMjBtZWFzdXJpbmclMjB0b29scyUyMGNhbGlwZXJzJTIwaW5zdHJ1bWVudHN8ZW58MXx8fHwxNzcxNDA2MTkyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 bg-white/90 backdrop-blur-sm" />
      
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-3 bg-[#1F2A44] text-white px-6 py-3 rounded-xl">
            <Disc className="w-6 h-6" />
            <h1 className="text-xl font-bold">PROMETEON TURKEY</h1>
          </div>
          
          <button
            onClick={() => navigate('/')}
            className="flex items-center justify-center w-16 h-16 bg-[#1F2A44] hover:bg-[#2d3d5f] rounded-full shadow-lg transition-colors"
          >
            <Home className="w-8 h-8 text-white" />
          </button>
        </div>

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-8 text-gray-600">
          <span className="text-lg">Departman</span>
          <ChevronRight className="w-5 h-5" />
          <span className="text-lg font-bold text-[#1F2A44]">{selectedDepartment}</span>
          <ChevronRight className="w-5 h-5" />
          <span className="text-lg">Makine Seçimi</span>
        </div>

        {/* Title */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-4 bg-[#1F2A44] text-white px-8 py-4 rounded-xl mb-4">
            <DepartmentIcon className="w-12 h-12" />
            <div className="text-left">
              <h2 className="text-3xl font-bold">{selectedDepartment}</h2>
              <p className="text-sm opacity-90">Makine Seçiniz</p>
            </div>
          </div>
        </div>

        {/* Machines Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-8">
          {departmentMachines.map((machine) => (
            <button
              key={machine}
              onClick={() => handleMachineSelect(machine)}
              className="group bg-white rounded-xl p-6 shadow-md hover:shadow-2xl hover:scale-105 transition-all duration-300 border-2 border-transparent hover:border-[#1F2A44]"
            >
              <div className="flex flex-col items-center justify-center space-y-3">
                <div className="w-16 h-16 bg-[#1F2A44] rounded-lg flex items-center justify-center group-hover:bg-[#2d3d5f] transition-colors">
                  <Factory className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-bold text-[#1F2A44] text-center">
                  {machine}
                </h3>
              </div>
            </button>
          ))}
        </div>

        {/* Back button */}
        <div className="flex justify-start">
          <button
            onClick={() => navigate('/departments')}
            className="px-8 py-4 bg-gray-500 hover:bg-gray-600 text-white rounded-xl text-lg font-semibold transition-colors"
          >
            ← Geri
          </button>
        </div>
      </div>
    </div>
  );
}