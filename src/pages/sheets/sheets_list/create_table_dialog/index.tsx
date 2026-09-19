import { Dispatch, SetStateAction, useState, memo, useCallback, useEffect, useRef } from "react"
import { Dialog } from "../../../../components/Dialog"
import Input from "../../../../components/input"
import Button from "../../../../components/Button"
import * as excel from "exceljs"
import { Select } from "../../../../components/select";
import { label } from "motion/react-client";
interface CreateTableDialogProps {
    open: boolean
    setOpen: Dispatch<SetStateAction<boolean>>
}

let types= [
    { value: "string", label: "Text" },
    { value: "number", label: "Number" },
    { value: "boolean", label: "Boolean" },
    { value: "date", label: "Date"  }
]

interface FieldItemProps {
    field: {id: number, name: string, type: string}
    onNameChange: (id: number, name: string) => void
    onTypeChange: (id: number, type: string) => void
}
const FieldItem = memo(({ field, onNameChange, onTypeChange }: FieldItemProps) => {
 let [name,setName] = useState(field.name)
let input = useRef<HTMLInputElement | null>(null);
useEffect(()=>{
    if(input){
      input.current?.addEventListener("focusout",()=>{
        onNameChange(field.id,name) 
        console.log(field)
      })
    }
},[])

  return (
        <div className="px-4 py-2 bg-[#e2e2e206] rounded-md text-sm">
            <Input
                ref={input}
                label="name"
                placeholder="enter the field name"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <Select
                label="type"
                value={field.type}
                onChange={(value) => onTypeChange(field.id, value)}
                options={types}
            />
        </div>
    )
})

function CreateTableDialog({ open, setOpen }: CreateTableDialogProps) {
    const [tableName, setTableName] = useState("")
    const [fields, setFields] = useState<{id:number,name:string,type:string,column_funotion?:String}[]>([])
    const handleAddField = (type: string) =>setFields((list)=>{ return [...list,{id:Date.now(),name:"",type}]})

    const handleFieldNameChange = useCallback((id: number, name: string) => {
        setFields(prev => prev.map(field =>
            field.id === id ? { ...field, name } : field
        ))
    }, [])

    const handleFieldTypeChange = useCallback((id: number, type: string) => {
        setFields(prev => prev.map(field =>
            field.id === id ? { ...field, type } : field
        ))
    }, [])
     
    const handle_sheet_creation=()=>{
    let work_sheet = new excel.Workbook();
    let sheet = work_sheet.addWorksheet();
    sheet.addTable({name:tableName,ref:"A1",columns:[...fields.map<any>((item)=>({name:item.name,filterButton:true,totalsRowFunction:item.column_funotion}))],rows:[],totalsRow:true})
      
  }
    return (
        <Dialog
            open={open}
            onClose={() => {
                setOpen(false)
                setTableName("")
                setFields([])
            }}
            title="Create a New Table"
            panelClassName="min-h-[40rem]"
            widthClass="w-[50rem]"
        >
            <div className="flex flex-col gap-8">
                <div className="px-16">
                    <div className="px-4 bg-dark-700/7 py-5 rounded-md">
                        <Input
                            label="Table Name"
                            value={tableName}
                            onChange={(e) => setTableName(e.target.value)}
                            placeholder="Enter table name"
                            required
                        />
                    </div>
                </div>
                <div className="w-full">
                    <div className="px-16">
                        <div className="border-t z-40 bg w-full translate-y-px border-x border-border-main px-5 py-4 font-medium">
                            Fields
                        </div>
                    </div>
                    <div className="border-t z-30 px-16 py-8 border-border-main">
                        <Select
                            onChange={(option) => handleAddField(option)}
                            options={types}
                            placeholder="Add a field"/>
                          
                      
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
                            setOpen(false)
                            setTableName("")
                            setFields([])
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handle_sheet_creation}
                        disabled={!tableName.trim() || fields.length === 0}
                    >
                        Create Table
                    </Button>
                </div>
            </div>
        </Dialog>
    )
}
export default CreateTableDialog
