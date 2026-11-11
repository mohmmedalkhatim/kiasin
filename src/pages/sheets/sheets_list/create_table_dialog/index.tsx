import { Dispatch, SetStateAction, useState, useCallback, useRef, useEffect } from "react";
import { Dialog } from "../../../../components/Dialog";
import Input from "../../../../components/input";
import Button from "../../../../components/Button";
import * as excel from "exceljs";
import { Select } from "../../../../components/select";
import { SheetDTO } from "../../../../contexts/sheets/objects";
import { useDispatch } from "react-redux";
import { create_sheet } from "../../../../contexts/sheets/functions/create";
import { update_sheet } from "../../../../contexts/sheets/functions/update";
import { AppDispatch } from "../../../../contexts/store";
import { Buffer } from "buffer";
import { IconTrash, IconFileSpreadsheet } from "@tabler/icons-react";
import NativeSelect from "../../../../components/native-select";
import FileUpload from "../../../../components/shared/FileUpload";
import type { Sheet } from "../../../../contexts/sheets/objects";

interface CreateTableDialogProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  onCreated?: () => void;
  editSheet?: Sheet | null;
}

const types = [
  { value: "string", label: "Text" },
  { value: "number", label: "Number" },
  { value: "boolean", label: "Boolean" },
  { value: "date", label: "Date" },
];

interface Field {
  id: number;
  name: string;
  type: string;
  column_function?: string;
}

function CreateTableDialog({ open, setOpen, onCreated, editSheet }: CreateTableDialogProps) {
  const isEdit = !!editSheet;
  const [count, setCount] = useState(0);
  const [tableName, setTableName] = useState("");
  const [fields, setFields] = useState<Field[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const dispatch = useDispatch<AppDispatch>();
  const [uploadOpen, setUploadOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && editSheet) {
      setTableName(editSheet.name);
      let parsed: Field[] = [];
      try {
        const desc = JSON.parse(editSheet.description);
        if (Array.isArray(desc)) parsed = desc.map((f: any, i: number) => ({ id: i, name: f.name, type: f.type ?? "string", column_function: f.column_function }));
        else if (desc?.columns && Array.isArray(desc.columns)) parsed = desc.columns.map((f: any, i: number) => ({ id: i, name: f.name, type: f.type ?? "string" }));
      } catch {}
      setFields(parsed);
      setCount(parsed.length);
    }
  }, [open, editSheet]);

  useEffect(() => {
    if (!uploadOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setUploadOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [uploadOpen]);

  const resetForm = useCallback(() => {
    setTableName("");
    setFields([]);
    setCount(0);
    setError("");
    setSubmitting(false);
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
    resetForm();
  }, [setOpen, resetForm]);

  const handleAddField = (type: string) => {
    setFields((prev) => [...prev, { id: count, name: "", type }]);
    setCount((prev) => prev + 1);
  };

  const handleFieldNameChange = useCallback((id: number, name: string) => {
    setFields((prev) => prev.map((f) => (f.id === id ? { ...f, name } : f)));
  }, []);

  const handleFieldTypeChange = useCallback((id: number, type: string) => {
    setFields((prev) => prev.map((f) => (f.id === id ? { ...f, type } : f)));
  }, []);

  const handleRemoveField = useCallback((id: number) => {
    setFields((prev) => prev.filter((f) => f.id !== id));
  }, []);

  const handleFileImport = async (files: File[]) => {
    const file = files[0];
    if (!file) return;

    try {
      const buffer = await file.arrayBuffer();
      const workBook = new excel.Workbook();
      await workBook.xlsx.load(buffer);
      const sheet = workBook.worksheets[0];
      if (!sheet) return;

      const headerRow = sheet.getRow(1);
      const imported: Field[] = [];
      let nextId = count;

      headerRow.eachCell((cell, colNumber) => {
        const name = String(cell.value ?? "").trim();
        if (!name) return;

        let type = "string";
        for (let r = 2; r <= Math.min(sheet.rowCount, 10); r++) {
          const sample = sheet.getRow(r).getCell(colNumber).value;
          if (sample == null) continue;
          if (typeof sample === "number") { type = "number"; break; }
          if (sample instanceof Date) { type = "date"; break; }
          if (typeof sample === "boolean") { type = "boolean"; break; }
          break;
        }

        imported.push({ id: nextId++, name, type });
      });

      if (imported.length > 0) {
        setFields((prev) => [...prev, ...imported]);
        setCount(nextId);
        if (!tableName.trim()) {
          const nameFromFile = file.name.replace(/\.[^.]+$/, "");
          setTableName(nameFromFile);
        }
      }
    } catch {
      setError("Could not read the file. Make sure it's a valid .xlsx file.");
    }
  };

  const handleSubmit = async () => {
    if (!tableName.trim()) return;
    if (fields.length === 0) {
      setError("Add at least one field");
      return;
    }
    const unnamed = fields.some((f) => !f.name.trim());
    if (unnamed) {
      setError("All fields must have a name");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      if (isEdit && editSheet) {
        const sheetDto: SheetDTO = {
          ...editSheet,
          name: tableName,
          description: JSON.stringify(fields),
          file: typeof editSheet.file === "string" ? editSheet.file : Buffer.from(editSheet.file).toString("base64"),
        };
        await dispatch(update_sheet(sheetDto));
      } else {
        const workBook = new excel.Workbook();
        const sheet = workBook.addWorksheet();
        sheet.addTable({
          name: tableName,
          ref: "A1",
          columns: fields.map<any>((item) => ({
            name: item.name,
            filterButton: true,
            totalsRowFunction: item.column_function,
          })),
          rows: [],
          totalsRow: true,
        });

        const buffer = await workBook.xlsx.writeBuffer();
        const file = Buffer.from(buffer);
        const sheetDto: SheetDTO = {
          name: tableName,
          description: JSON.stringify(fields),
          file: file.toString("base64"),
          rows_info: fields,
        };
        await dispatch(create_sheet(sheetDto));
      }
      handleClose();
      onCreated?.();
    } catch (err) {
      setError(isEdit ? "Failed to update table. Please try again." : "Failed to create table. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      title={isEdit ? "Edit Table" : "Create a New Table"}
      panelClassName="min-h-[40rem] max-h-[90vh]"
      bodyClassName="min-h-0 flex h-full flex-col"
      widthClass="w-[50rem]"
    >
      <div className="flex flex-col h-full">
        <div className="px-16 py-8 flex items-end gap-3">
          <div className="flex-1">
            <Input
              label="Table name"
              placeholder="Enter table name"
              value={tableName}
              onChange={(e) => setTableName(e.target.value)}
            />
          </div>
          <div className="relative" ref={popoverRef}>
            <Button
              variant="outlined"
              icon={<IconFileSpreadsheet size={18} />}
              onClick={() => setUploadOpen(p => !p)}
            >
              Import
            </Button>
            {uploadOpen && (
              <div className="absolute top-full right-0 mt-2 w-80 z-50 border border-border-main rounded-lg bg-dark-900 shadow-lg p-4">
                <FileUpload
                  accept=".xlsx,.xls"
                  multiple={false}
                  title="Import from spreadsheet"
                  subtitle=".xlsx or .xls files"
                  onChange={(files) => { handleFileImport(files); setUploadOpen(false); }}
                />
              </div>
            )}
          </div>
        </div>

        <div className="px-16">
          <div className="border-t border-x border-border-main bg-hover-subtle px-5 py-3 text-sm font-medium text-support-300">
            Fields
          </div>
        </div>

        <div className="border-t border-border-main px-16 py-6">
          <Select
            onChange={(option) => handleAddField(option)}
            options={types}
            placeholder="Add a field"
          />
        </div>
        <div className="max-h-80 h-80">
          {fields.length > 0 && (
            <div className="mx-16">
              <div className="border border-border-main rounded-md overflow-hidden">
                <div className="grid grid-cols-[1fr_10rem_2.5rem] text-xs font-medium text-support-400 uppercase tracking-wide bg-hover-main border-b border-border-main">
                  <span className="px-4 py-2.5">Name</span>
                  <span className="px-4 py-2.5">Type</span>
                  <span />
                </div>
                <div className="max-h-[16rem] overflow-y-auto">
                  {fields.map((field, index) => (
                    <div
                      key={field.id}
                      className={`grid grid-cols-[1fr_10rem_2.5rem] items-center border-b border-border-subtle last:border-b-0 ${index % 2 !== 0 ? "bg-hover-subtle" : ""
                        }`}
                    >
                      <div className="px-3 py-2">
                        <input
                          type="text"
                          placeholder="Field name"
                          value={field.name}
                          onChange={(e) => handleFieldNameChange(field.id, e.target.value)}
                          className="w-full bg-transparent text-sm text-support-100 placeholder:text-support-500 outline-none"
                          aria-label={`Field ${index + 1} name`}
                        />
                      </div>
                      <div className="px-1 py-1">
                        <NativeSelect
                          size="sm"
                          value={field.type}
                          onChange={(e) => handleFieldTypeChange(field.id, e.target.value)}
                          options={types}
                          aria-label={`Field ${index + 1} type`}
                        />
                      </div>
                      <div className="flex items-center justify-center">
                        <button
                          type="button"
                          onClick={() => handleRemoveField(field.id)}
                          className="p-1.5 text-support-500 hover:text-danger-400 hover:bg-danger-500/10 rounded transition-colors"
                          aria-label={`Remove field ${field.name || index + 1}`}
                        >
                          <IconTrash size={15} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {error && (
          <p className="px-16 text-sm text-danger-500" role="alert">
            {error}
          </p>
        )}

        <div>
          <div className="flex justify-end self-end gap-3 px-16 py-4 border-t border-border-main ">
            <Button variant="secondary" onClick={handleClose}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={tableName.trim() === "" || submitting}>
              {submitting ? (isEdit ? "Saving…" : "Creating…") : (isEdit ? "Save Changes" : "Create Table")}
            </Button>
          </div>
        </div>
      </div>
    </Dialog>
  );
}

export default CreateTableDialog;
