import { useNavigate } from 'react-router';
import { Gauge, Scale, Thermometer, Droplet, Ruler, Compass, ArrowLeft, Disc, ChevronRight } from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import { useEffect } from 'react';

const calibrationTypes = [
  { id: 1, name: 'Basınç', icon: Gauge },
  { id: 2, name: 'Kütle', icon: Scale },
  { id: 3, name: 'Terazi', icon: Scale },
  { id: 4, name: 'Sıcaklık', icon: Thermometer },
  { id: 5, name: 'pH', icon: Droplet },
  { id: 6, name: 'Uzunluk', icon: Ruler },
  { id: 7, name: 'Açı', icon: Compass },
];

export function CalibrationTypeSelection() {
  const navigate = useNavigate();
  const { selectedDepartment, selectedMachine, setSelectedCalibrationType } = useUser();

  useEffect(() => {
    if (!selectedDepartment || !selectedMachine) {
      navigate('/departments');
    }
  }, [selectedDepartment, selectedMachine, navigate]);

  if (!selectedDepartment || !selectedMachine) {
    return null;
  }

  const handleTypeClick = (typeName: string) => {
    setSelectedCalibrationType(typeName);
    navigate('/dashboard');
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
          
          <button
            onClick={() => navigate('/machines')}
            className="flex items-center gap-2 text-gray-600 hover:text-[#1F2A44] transition-colors px-6 py-3 bg-white rounded-xl shadow"
          >
            <ArrowLeft className="w-6 h-6" />
            <span className="text-lg font-medium">Geri</span>
          </button>
        </div>

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-8 text-gray-600">
          <span className="text-lg">{selectedDepartment}</span>
          <ChevronRight className="w-5 h-5" />
          <span className="text-lg">{selectedMachine}</span>
          <ChevronRight className="w-5 h-5" />
          <span className="text-lg font-bold text-[#1F2A44]">Kalibrasyon Tipi</span>
        </div>
        
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#1F2A44]">
            Kalibrasyon Tipi Seçiniz
          </h1>
          <p className="text-gray-600 mt-2">
            {selectedDepartment} - {selectedMachine}
          </p>
        </div>

        {/* Type grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {calibrationTypes.map((type) => {
            const Icon = type.icon;
            return (
              <button
                key={type.id}
                onClick={() => handleTypeClick(type.name)}
                className="group bg-white rounded-2xl p-8 shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                <div className="flex flex-col items-center space-y-4">
                  <div className="w-20 h-20 bg-gray-100 rounded-xl flex items-center justify-center group-hover:bg-[#1F2A44] transition-colors">
                    <Icon className="w-10 h-10 text-[#1F2A44] group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-xl font-bold text-[#1F2A44] text-center">
                    {type.name}
                  </h3>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}