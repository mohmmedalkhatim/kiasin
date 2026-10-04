import { Dispatch, SetStateAction, useState, memo, useCallback, useEffect, useRef } from "react";
import { Dialog } from "../../../../components/Dialog";
import Input from "../../../../components/input";
import Button from "../../../../components/Button";
import * as excel from "exceljs";
import { Select } from "../../../../components/select";
import { SheetDTO } from "../../../../contexts/sheets/objects";
import { useDispatch } from "react-redux";
import { create_sheet } from "../../../../contexts/sheets/functions/create";
import { AppDispatch } from "../../../../contexts/store";
import { Buffer } from "buffer";

interface CreateTableDialogProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  onCreated?: () => void;
}

let types = [
  { value: "string", label: "Text" },
  { value: "number", label: "Number" },
  { value: "boolean", label: "Boolean" },
  { value: "date", label: "Date" },
];

interface FieldItemProps {
  field: { id: number; name: string; type: string };
  onNameChange: (id: number, name: string) => void;
  onTypeChange: (id: number, type: string) => void;
}
const FieldItem = memo(({ field, onNameChange, onTypeChange }: FieldItemProps) => {
  let [Name, setName] = useState(field.name);
  let input = useRef<HTMLInputElement | null>(null);
  useEffect(() => {
    if (input) {
      input.current?.addEventListener("focusout", () => { });
      input.current?.addEventListener("focusout", () => {
        console.log(Name);
        onNameChange(field.id, Name);
        console.log(field);
      });
    }
  }, [Name]);

  return (
    <div className="px-4 py-2 bg-[#e2e2e206] rounded-md text-sm">
      <Input
        ref={input}
        label="name"
        placeholder="enter the field name"
        value={Name}
        onChange={(e) => setName(e.target.value)}
      />
      <Select
        label="type"
        value={field.type}
        onChange={(value) => onTypeChange(field.id, value)}
        options={types}
      />
    </div>
  );
});

const TableName = ({ setTableName }: { setTableName: Dispatch<SetStateAction<string>> }) => {
  let [name, setName] = useState("");
  let ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (ref) {
      ref.current?.removeEventListener("focusout", () => { });
      ref.current?.addEventListener("focusout", () => {
        setTableName(name);
      });
    console.log(name)
    }

  }, [name]);
  return (
    <div className="px-5 bg-dark-700/7 py-5 rounded-md">
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        ref={ref}
        placeholder="Enter table name"
        required
      />
    </div>
  );
};
function CreateTableDialog({ open, setOpen, onCreated }: CreateTableDialogProps) {
  const [count, setCount] = useState(0);
  const [tableName, setTableName] = useState("");
  const [fields, setFields] = useState<
    { id: number; name: string; type: string; column_funotion?: string }[]
  >([]);
  const handleAddField = (index: number, type: string) =>
    setFields((list) => {
      setCount((prev) => prev + 1);
      return [...list, { id: index, name: "", type }];
    });
  let dispatch = useDispatch<AppDispatch>();
  const handleFieldNameChange = (id: number, name: string) => {
    setFields((prev) => prev.map((field) => (field.id === id ? { ...field, name } : field)));
  };

  const handleFieldTypeChange = useCallback((id: number, type: string) => {
    setFields((prev) => prev.map((field) => (field.id === id ? { ...field, type } : field)));
  }, []);
  const handle_sheet_creation = async () => {
    let work_book = new excel.Workbook();
    let sheet = work_book.addWorksheet();
    sheet.addTable({
      name: tableName,
      ref: "A1",
      columns: [
        ...fields.map<any>((item) => ({
          name: item.name,
          filterButton: true,
          totalsRowFunction: item.column_funotion,
        })),
      ],
      rows: [],
      totalsRow: true,
    });
    try {
      let buffer = await work_book.xlsx.writeBuffer();
      let file = Buffer.from(buffer);
      let sheet_dto: SheetDTO = {
        name: tableName,
        description: JSON.stringify(fields),
        file: file.toString("base64"),
        rows_info: fields,
      };
      await dispatch(create_sheet(sheet_dto));
      setOpen(false);
      setTableName("");
      setFields([]);
      onCreated?.();
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <Dialog
      open={open}
      onClose={() => {
        setOpen(false);
        setTableName("");
        setFields([]);
      }}
      title="Create a New Table"
      panelClassName="min-h-[40rem]"
      widthClass="w-[50rem]"
    >
      <div className="flex flex-col gap-8">
        <div className="px-16">
        <TableName setTableName={setTableName}/>
        </div>
        <div className="w-full">
          <div className="px-16">
            <div className="border-t z-40 bg w-full translate-y-px border-x border-border-main px-5 py-4 font-medium">
              Fields
            </div>
          </div>
          <div className="border-t z-30 px-16 py-8 border-border-main">
            <Select
              onChange={(option) => handleAddField(count, option)}
              options={types}
              placeholder="Add a field"
            />
          </div>

          <div className="mx-16 overflow-auto max-h-[20rm] h-[12rem] flex flex-col gap-2">
            {fields.map((item) => (
              <FieldItem
                key={item.id}
                field={item}
                onNameChange={handleFieldNameChange}
                onTypeChange={handleFieldTypeChange}
              />
            ))}
          </div>
        </div>
        <div className="flex justify-end gap-3 px-16 pt-4 border-t border-border-main">
          <Button
            variant="secondary"
            onClick={() => {
              setOpen(false);
              setTableName("");
              setFields([]);
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              handle_sheet_creation();
            }}
            disabled={tableName.trim() === ""}
          >
            Create Table
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
export default CreateTableDialog;
