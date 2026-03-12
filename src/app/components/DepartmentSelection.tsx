import { useNavigate } from 'react-router';
import { RefreshCcw, Flame, Snowflake, Layers, Disc, CheckCircle2 } from 'lucide-react';
import { useUser } from '../contexts/UserContext';

const departments = [
  { id: 1, name: 'Banbury', icon: RefreshCcw },
  { id: 2, name: 'Hot Semi-Finished', icon: Flame },
  { id: 3, name: 'Cold Semi-Finished', icon: Snowflake },
  { id: 4, name: 'Confection', icon: Layers },
  { id: 5, name: 'Cooking', icon: Disc },
  { id: 6, name: 'Finishing', icon: CheckCircle2 },
];

export function DepartmentSelection() {
  const navigate = useNavigate();
  const { setSelectedDepartment } = useUser();

  const handleDepartmentClick = (dept: string) => {
    setSelectedDepartment(dept);
    navigate('/machines');
  };

  return (
    <div 
      className="min-h-screen w-full flex flex-col items-center justify-center p-8 relative"
      style={{
        backgroundImage: 'url(https://images.unsplash.com/photo-1689942007095-737d731806ad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaWNyb21ldGVyJTIwbWVhc3VyaW5nJTIwZ2F1Z2UlMjBpbmR1c3RyaWFsfGVufDF8fHx8MTc3MTQwNjE5Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      
      <div className="relative z-10 w-full max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-2">
            Select Department
          </h1>
          <div className="h-1 w-24 bg-white mx-auto rounded-full" />
        </div>

        {/* Department grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {departments.map((dept) => {
            const Icon = dept.icon;
            return (
              <button
                key={dept.id}
                onClick={() => handleDepartmentClick(dept.name)}
                className="group bg-white/95 backdrop-blur-sm rounded-2xl p-8 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
              >
                <div className="flex flex-col items-center space-y-4">
                  <div className="w-24 h-24 bg-[#1F2A44] rounded-2xl flex items-center justify-center group-hover:bg-[#2d3d5f] transition-colors">
                    <Icon className="w-12 h-12 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-[#1F2A44] text-center">
                    {dept.name}
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