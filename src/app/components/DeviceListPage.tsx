import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Filter, ClipboardList, RefreshCw, FileText, Disc, Search, Eye, BookOpen, Download } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Input } from './ui/input';
import * as XLSX from 'xlsx';

// Mock data
const mockDevices = [
  { id: 1, machineCode: 'BANBURY 9', deviceCode: 'A002', deviceName: 'BASINÇ ÖLÇER', daysRemaining: 3, department: 'Banbury', deviceType: 'Basınç' },
  { id: 2, machineCode: 'BANBURY 9', deviceCode: 'A003', deviceName: 'SICAKLIK SENSÖRÜ', daysRemaining: 8, department: 'Banbury', deviceType: 'Sıcaklık' },
  { id: 3, machineCode: '3 TRAFILA', deviceCode: 'B007', deviceName: 'Uzunluk Ölçer', daysRemaining: 1, department: 'Trafila', deviceType: 'Uzunluk' },
  { id: 4, machineCode: '3 TRAFILA', deviceCode: 'B008', deviceName: 'Terazi', daysRemaining: 18, department: 'Trafila', deviceType: 'Terazi' },
  { id: 5, machineCode: 'MIXER 01', deviceCode: 'C001', deviceName: 'pH Ölçer', daysRemaining: 12, department: 'Mixing', deviceType: 'pH' },
  { id: 6, machineCode: 'MIXER 02', deviceCode: 'C005', deviceName: 'BASINÇ ÖLÇER', daysRemaining: 5, department: 'Mixing', deviceType: 'Basın' },
];

export function DeviceListPage() {
  const navigate = useNavigate();
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [selectedMachine, setSelectedMachine] = useState<string>('all');
  const [selectedDeviceType, setSelectedDeviceType] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Get unique values for filters
  const departments = ['all', ...Array.from(new Set(mockDevices.map(d => d.department)))];
  const machines = ['all', ...Array.from(new Set(mockDevices.map(d => d.machineCode)))];
  const deviceTypes = ['all', ...Array.from(new Set(mockDevices.map(d => d.deviceType)))];

  // Filter devices
  const filteredDevices = mockDevices.filter(device => {
    if (selectedDepartment !== 'all' && device.department !== selectedDepartment) return false;
    if (selectedMachine !== 'all' && device.machineCode !== selectedMachine) return false;
    if (selectedDeviceType !== 'all' && device.deviceType !== selectedDeviceType) return false;
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      const matchesDeviceCode = device.deviceCode.toLowerCase().includes(search);
      const matchesDeviceName = device.deviceName.toLowerCase().includes(search);
      if (!matchesDeviceCode && !matchesDeviceName) return false;
    }
    return true;
  });

  // Get color based on days remaining
  const getDaysColor = (days: number) => {
    if (days < 7) return 'bg-red-100 text-red-800';
    if (days >= 7 && days <= 15) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  // Function to export data to Excel
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredDevices);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Cihaz Listesi');
    XLSX.writeFile(workbook, 'cihaz_listesi.xlsx');
  };

  return (
    <div className="min-h-screen w-full bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate('/dashboard')}
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
          Cihaz Listesi
        </h1>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center gap-4">
            <Filter className="w-6 h-6 text-[#1F2A44]" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Bölüm</label>
                <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                  <SelectTrigger className="h-12 bg-gray-50 rounded-lg">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tümü</SelectItem>
                    {departments.filter(d => d !== 'all').map(dept => (
                      <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Makine Adı</label>
                <Select value={selectedMachine} onValueChange={setSelectedMachine}>
                  <SelectTrigger className="h-12 bg-gray-50 rounded-lg">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tümü</SelectItem>
                    {machines.filter(m => m !== 'all').map(machine => (
                      <SelectItem key={machine} value={machine}>{machine}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Cihaz Tipi</label>
                <Select value={selectedDeviceType} onValueChange={setSelectedDeviceType}>
                  <SelectTrigger className="h-12 bg-gray-50 rounded-lg">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tümü</SelectItem>
                    {deviceTypes.filter(t => t !== 'all').map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center gap-4">
            <Search className="w-6 h-6 text-[#1F2A44]" />
            <Input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cihaz kodu veya cihaz adı ara..."
              className="h-12 bg-gray-50 rounded-lg px-4"
            />
          </div>
        </div>

        {/* Device List */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-6 gap-4 p-6 bg-[#1F2A44] text-white font-bold">
            <div>Makine Adı</div>
            <div>CİHAZ KODU</div>
            <div>CİHAZ ADI</div>
            <div>KALAN SÜRE</div>
            <div className="col-span-2 text-center">İŞLEMLER</div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-gray-200">
            {filteredDevices.map((device) => (
              <div
                key={device.id}
                className="grid grid-cols-6 gap-4 p-6 hover:bg-gray-50 transition-colors items-center"
              >
                <div className="font-medium text-gray-900">{device.machineCode}</div>
                <div className="text-gray-700">{device.deviceCode}</div>
                <div className="text-gray-700">{device.deviceName}</div>
                <div>
                  <span className={`px-4 py-2 rounded-lg font-bold ${getDaysColor(device.daysRemaining)}`}>
                    {device.daysRemaining} GÜN
                  </span>
                </div>
                <div className="col-span-2 flex items-center justify-center gap-3">
                  <button
                    onClick={() => navigate('/calibration-entry')}
                    className="p-3 bg-blue-100 hover:bg-blue-200 rounded-lg transition-colors"
                    title="Kalibrasyon Güncelle"
                  >
                    <ClipboardList className="w-6 h-6 text-blue-700" />
                  </button>
                  <button
                    onClick={() => navigate('/update-device')}
                    className="p-3 bg-green-100 hover:bg-green-200 rounded-lg transition-colors"
                    title="Cihaz Güncelle"
                  >
                    <RefreshCw className="w-6 h-6 text-green-700" />
                  </button>
                  <button
                    onClick={() => navigate('/view-device')}
                    className="p-3 bg-orange-100 hover:bg-orange-200 rounded-lg transition-colors"
                    title="Cihaz Detayları"
                  >
                    <Eye className="w-6 h-6 text-orange-700" />
                  </button>
                  <button
                    onClick={() => navigate('/view-procedure')}
                    className="p-3 bg-purple-100 hover:bg-purple-200 rounded-lg transition-colors"
                    title="Prosedür Görüntüle"
                  >
                    <BookOpen className="w-6 h-6 text-purple-700" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <div className="mt-4 text-center text-gray-600">
          Toplam {filteredDevices.length} cihaz gösteriliyor
        </div>

        {/* Export Button */}
        <div className="mt-6 flex justify-center">
          <button
            onClick={exportToExcel}
            className="flex items-center gap-3 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors shadow-lg hover:shadow-xl font-medium"
            title="Excel'e Aktar"
          >
            <Download className="w-5 h-5" />
            <span>Excel'e Aktar (.xlsx)</span>
          </button>
        </div>
      </div>
    </div>
  );
}