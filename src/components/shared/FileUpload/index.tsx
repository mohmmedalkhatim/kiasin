import { useState, useRef } from 'react';
import { UploadCloud, File, X } from 'lucide-react';
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
    <div
      className={clsx(
        'w-full max-w-md p-6 mx-auto bg-card text-card-foreground rounded-xl shadow-sm border border-border font-sans transition-colors duration-200',
        className,
      )}
    >
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold text-foreground">{title}</h2>
        <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
      </div>

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
            'flex flex-col items-center justify-center w-full h-48 rounded-lg border-2 border-dashed transition-colors duration-200 ease-in-out cursor-pointer',
            dragActive
              ? 'border-primary bg-primary/10 dark:bg-primary/5'
              : 'border-border bg-muted/50 hover:bg-muted dark:bg-muted/10 dark:hover:bg-muted/20',
          )}
          onClick={() => inputRef.current?.click()}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <UploadCloud
            className={clsx(
              'w-10 h-10 mb-3',
              dragActive ? 'text-primary' : 'text-muted-foreground',
            )}
            aria-hidden
          />
          <p className="text-sm text-foreground font-medium">
            Drag & drop files or{' '}
            <span className="text-primary hover:text-primary/80 transition-colors">
              Browse
            </span>
          </p>
        </div>
      </form>

      {files.length > 0 && (
        <div className="mt-6 space-y-3">
          <h3 className="text-sm font-medium text-foreground">
            Selected Files
          </h3>
          <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
            {files.map((file, index) => (
              <div
                key={`${file.name}-${index}`}
                className="flex items-center justify-between p-3 bg-muted/30 dark:bg-muted/10 border border-border rounded-lg group hover:border-primary/50 transition-colors"
              >
                <div className="flex items-center space-x-3 overflow-hidden">
                  <div className="p-2 bg-background dark:bg-muted/20 rounded shadow-sm text-primary shrink-0 border border-border/50">
                    <File className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col overflow-hidden">
                    <span className="text-sm font-medium text-foreground truncate">
                      {file.name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {formatSize(file.size)}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => removeFile(index)}
                  className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition-colors shrink-0"
                  aria-label="Remove file"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
