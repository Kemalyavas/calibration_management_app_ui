import { Upload, X, FileText, Image as ImageIcon } from 'lucide-react';
import { Button } from '../ui/button';

interface FileUploadSectionProps {
  uploadedFiles: File[];
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFileRemove: (index: number) => void;
}

export function FileUploadSection({
  uploadedFiles,
  onFileUpload,
  onFileRemove,
}: FileUploadSectionProps) {
  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) {
      return <ImageIcon className="w-5 h-5 text-blue-600" />;
    }
    return <FileText className="w-5 h-5 text-gray-600" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="space-y-4">
      <div className="border-t-2 border-[#1F2A44] pt-6">
        <h2 className="text-2xl font-bold text-[#1F2A44] mb-4">
          DOSYA YÜKLEME (Opsiyonel)
        </h2>
        <p className="text-sm text-gray-600 mb-4">
          Kalibrasyon sertifikası, fotoğraflar veya ilgili dokümanları yükleyebilirsiniz
        </p>
      </div>

      <div className="flex items-center gap-4">
        <Button
          type="button"
          variant="outline"
          className="h-12"
          onClick={() => document.getElementById('file-upload')?.click()}
        >
          <Upload className="w-5 h-5 mr-2" />
          Dosya Seç
        </Button>
        <input
          id="file-upload"
          type="file"
          multiple
          accept="image/*,.pdf,.doc,.docx,.xls,.xlsx"
          onChange={onFileUpload}
          className="hidden"
        />
        <span className="text-sm text-gray-500">
          {uploadedFiles.length} dosya seçildi
        </span>
      </div>

      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          {uploadedFiles.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
            >
              <div className="flex items-center gap-3">
                {getFileIcon(file)}
                <div>
                  <p className="text-sm font-medium text-gray-900">{file.name}</p>
                  <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onFileRemove(index)}
                className="p-1 hover:bg-red-100 rounded-full transition-colors"
              >
                <X className="w-4 h-4 text-red-600" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
