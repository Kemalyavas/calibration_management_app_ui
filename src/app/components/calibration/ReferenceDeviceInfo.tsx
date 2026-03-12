interface ReferenceDeviceInfoProps {
  deviceName: string;
  deviceSerial: string;
  uncertainties: number[];
}

export function ReferenceDeviceInfo({
  deviceName,
  deviceSerial,
  uncertainties,
}: ReferenceDeviceInfoProps) {
  if (!deviceName) return null;

  return (
    <div className="mt-6 p-6 bg-gradient-to-r from-indigo-50 to-indigo-100 rounded-xl border-2 border-indigo-300">
      <h3 className="text-xl font-bold text-[#1F2A44] mb-4">
        REFERANS CİHAZ BİLGİSİ
      </h3>
      
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-gray-700 min-w-[100px]">Cihaz Adı:</span>
          <span className="text-sm text-gray-900">{deviceName}</span>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-gray-700 min-w-[100px]">Seri No:</span>
          <span className="text-sm text-gray-900">{deviceSerial}</span>
        </div>
        
        <div className="mt-4">
          <p className="text-sm font-bold text-gray-700 mb-2">
            Belirsizlik Değerleri (U1-U6):
          </p>
          <div className="flex gap-4 flex-wrap">
            {uncertainties.map((uncertainty, index) => (
              <div key={index} className="text-center">
                <p className="text-xs text-gray-600">U{index + 1}</p>
                <p className="font-bold text-sm">{uncertainty}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
