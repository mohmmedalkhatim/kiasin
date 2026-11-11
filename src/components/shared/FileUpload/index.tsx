import { useState, useRef } from 'react';
import { IconCloudUpload, IconFile, IconX } from '@tabler/icons-react';
import clsx from 'clsx';

type FileUploadProps = {
  accept?: string;
  maxSizeMB?: number;
  multiple?: boolean;
  title?: string;
  subtitle?: string;
  onChange?: (files: File[]) => void;
  className?: string;
};

export default function FileUpload({
  accept,
  maxSizeMB = 10,
  multiple = true,
  title = 'Upload your files',
  subtitle = `PNG, JPG, PDF up to ${maxSizeMB}MB`,
  onChange,
  className,
}: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const updateFiles = (next: File[]) => {
    setFiles(next);
    onChange?.(next);
  };

  const addFiles = (incoming: FileList) => {
    const next = [...files, ...Array.from(incoming)];
    updateFiles(next);
  };

  const removeFile = (index: number) => {
    updateFiles(files.filter((_, i) => i !== index));
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.length) {
      addFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      addFiles(e.target.files);
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={clsx('w-full', className)}>
      <form
        onDragEnter={handleDrag}
        onSubmit={(e) => e.preventDefault()}
        className="relative"
      >
        <input
          ref={inputRef}
          type="file"
          multiple={multiple}
          accept={accept}
          onChange={handleChange}
          className="hidden"
        />

        <div
          className={clsx(
            'flex flex-col items-center justify-center w-full py-8 rounded-lg border-2 border-dashed transition-colors cursor-pointer',
            dragActive
              ? 'border-primary-500 bg-primary-600/5'
              : 'border-border-main bg-hover-subtle/50 hover:bg-hover-subtle hover:border-border-strong',
          )}
          onClick={() => inputRef.current?.click()}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <IconCloudUpload
            size={28}
            className={clsx(
              'mb-2',
              dragActive ? 'text-primary-400' : 'text-support-500',
            )}
          />
          <p className="text-sm text-support-200 font-medium">{title}</p>
          <p className="text-xs text-support-500 mt-1">{subtitle}</p>
        </div>
      </form>

      {files.length > 0 && (
        <div className="mt-3 space-y-2">
          {files.map((file, index) => (
            <div
              key={`${file.name}-${index}`}
              className="flex items-center justify-between p-2.5 border border-border-main rounded-lg hover:border-border-strong transition-colors"
            >
              <div className="flex items-center gap-2.5 overflow-hidden">
                <div className="p-1.5 bg-hover-subtle rounded border border-border-main text-primary-400 shrink-0">
                  <IconFile size={16} />
                </div>
                <div className="flex flex-col overflow-hidden">
                  <span className="text-sm text-support-100 truncate">{file.name}</span>
                  <span className="text-xs text-support-500">{formatSize(file.size)}</span>
                </div>
              </div>
              <button
                onClick={() => removeFile(index)}
                className="p-1.5 text-support-500 hover:text-danger-400 hover:bg-danger-900/20 rounded-md transition-colors shrink-0 cursor-pointer"
                aria-label="Remove file"
              >
                <IconX size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
