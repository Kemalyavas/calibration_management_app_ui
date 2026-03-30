import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Filter, ClipboardList, RefreshCw, Disc, Search, Eye, BookOpen, Download, Loader2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Input } from './ui/input';
import * as XLSX from 'xlsx';
import { devicesApi, lookupApi } from '../services/api';

interface DeviceItem {
  id: number;
  deviceCode: string;
  deviceName: string;
  machineName: string | null;
  departmentName: string | null;
  daysRemaining: number | null;
  deviceType: string;
}

export function DeviceListPage() {
  const navigate = useNavigate();
  const [devices, setDevices] = useState<DeviceItem[]>([]);
  const [departments, setDepartments] = useState<{ id: number; name: string }[]>([]);
  const [machines, setMachines] = useState<{ id: number; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [selectedMachine, setSelectedMachine] = useState<string>('all');
  const [selectedDeviceType, setSelectedDeviceType] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    Promise.all([
      lookupApi.departments(),
      lookupApi.machines(),
    ]).then(([depts, machs]) => {
      setDepartments(depts);
      setMachines(machs);
    });
  }, []);

  useEffect(() => {
    setLoading(true);
    const params: Record<string, string> = { pageSize: '100' };
    if (selectedDepartment !== 'all') params.departmentId = selectedDepartment;
    if (selectedMachine !== 'all') params.machineId = selectedMachine;
    if (selectedDeviceType !== 'all') params.deviceType = selectedDeviceType;
    if (searchTerm) params.search = searchTerm;

    devicesApi.list(params).then(data => {
      setDevices(data.items);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [selectedDepartment, selectedMachine, selectedDeviceType, searchTerm]);

  const getDaysColor = (days: number | null) => {
    if (days === null) return 'bg-gray-100 text-gray-600';
    if (days < 7) return 'bg-red-100 text-red-800';
    if (days >= 7 && days <= 15) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(devices.map(d => ({
      'Makine Adı': d.machineName || '-',
      'Cihaz Kodu': d.deviceCode,
      'Cihaz Adı': d.deviceName,
      'Bölüm': d.departmentName || '-',
      'Kalan Gün': d.daysRemaining ?? '-',
      'Cihaz Tipi': d.deviceType,
    })));
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
                    {departments.map(dept => (
                      <SelectItem key={dept.id} value={dept.id.toString()}>{dept.name}</SelectItem>
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
                    {machines.map(machine => (
                      <SelectItem key={machine.id} value={machine.id.toString()}>{machine.name}</SelectItem>
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
                    <SelectItem value="test">Test Cihazı</SelectItem>
                    <SelectItem value="reference">Referans Cihaz</SelectItem>
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
          <div className="grid grid-cols-6 gap-4 p-6 bg-[#1F2A44] text-white font-bold">
            <div>Makine Adı</div>
            <div>CİHAZ KODU</div>
            <div>CİHAZ ADI</div>
            <div>KALAN SÜRE</div>
            <div className="col-span-2 text-center">İŞLEMLER</div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center p-12">
              <Loader2 className="w-8 h-8 animate-spin text-[#1F2A44]" />
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {devices.map((device) => (
                <div
                  key={device.id}
                  className="grid grid-cols-6 gap-4 p-6 hover:bg-gray-50 transition-colors items-center"
                >
                  <div className="font-medium text-gray-900">{device.machineName || '-'}</div>
                  <div className="text-gray-700">{device.deviceCode}</div>
                  <div className="text-gray-700">{device.deviceName}</div>
                  <div>
                    <span className={`px-4 py-2 rounded-lg font-bold ${getDaysColor(device.daysRemaining)}`}>
                      {device.daysRemaining !== null ? `${device.daysRemaining} GÜN` : '-'}
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
              {devices.length === 0 && !loading && (
                <div className="p-12 text-center text-gray-500">Cihaz bulunamadı.</div>
              )}
            </div>
          )}
        </div>

        <div className="mt-4 text-center text-gray-600">
          Toplam {devices.length} cihaz gösteriliyor
        </div>

        <div className="mt-6 flex justify-center">
          <button
            onClick={exportToExcel}
            className="flex items-center gap-3 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors shadow-lg hover:shadow-xl font-medium"
          >
            <Download className="w-5 h-5" />
            <span>Excel'e Aktar (.xlsx)</span>
          </button>
        </div>
      </div>
    </div>
  );
}
