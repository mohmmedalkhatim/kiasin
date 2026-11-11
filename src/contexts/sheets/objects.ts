export interface Sheet{
    id?: number,
    name: string,
    description: string,
    file: Array<number>,
    rows_info?:{ id: number, name: string, type: string, column_funotion?: string }[],
    created?: string,
    updated?: string,
}

export type SheetDTO = Omit<Sheet,"file"> & {file:string};
