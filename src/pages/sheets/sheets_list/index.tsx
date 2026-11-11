import { Dispatch, SetStateAction, useCallback, useMemo, useState } from "react";
import SheetCard from "../sheet_card";
import Button from "../../../components/Button";
import Input from "../../../components/input";
import CreateTableDialog from "./create_table_dialog";
import { Channel, invoke } from "@tauri-apps/api/core";
import { useAsync } from "react-use";
import { Sheet } from "../../../contexts/sheets/objects";
import { IconPlus, IconTable, IconTrash } from "@tabler/icons-react";

type SheetsListProps = {
  setActive: Dispatch<SetStateAction<number | undefined>>;
  activeId?: number;
};

function SheetList({ setActive, activeId }: SheetsListProps) {
  const [open, setOpen] = useState(false);
  const [sheets, setSheets] = useState<Sheet[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  useAsync(async () => {
    setLoading(true);
    try {
      const channel = new Channel((res: Sheet[]) => {
        setSheets(res);
        setActive(res[0].id)
      });
      await invoke("sheets_control", {
        payload: { command: "list" },
        channel,
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [refreshKey]);

  const refresh = useCallback(() => setRefreshKey((k) => k + 1), []);

  const deleteSheet = useCallback(
    async (e: React.MouseEvent, id: number | undefined) => {
      e.stopPropagation();
      if (id === undefined) return;
      try {
        const channel = new Channel();
        await invoke("sheets_control", {
          payload: { command: "delete", id },
          channel,
        });
        if (activeId === id) setActive(undefined);
        refresh();
      } catch (error) {
        console.error(error);
      }
    },
    [activeId, setActive, refresh],
  );

  const filtered = useMemo(() => {
    if (!search) return sheets;
    const q = search.toLowerCase();
    return sheets.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.description?.toLowerCase().includes(q),
    );
  }, [sheets, search]);

  return (
    <>
      <div className="flex flex-1 flex-col border-r w-[18rem] z-10 max-h-[calc(100vh-2.5rem)] bg fixed min-h-[calc(100vh-2.5rem)] pt-18 border-border-main">
        {/* Search */}
        <div className="border-b border-border-main p-3 w-full">
          <Input
            placeholder="Search sheets..."
            type="search"
            size="sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* List */}
        <div className="overflow-auto h-full grow">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <span className="text-sm text-support-400">Loading...</span>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 gap-2 px-4">
              <IconTable
                size={28}
                className="text-support-600"
                strokeWidth={1.5}
              />
              <span className="text-sm text-support-500 text-center">
                {search ? "No matching sheets" : "No sheets yet"}
              </span>
            </div>
          ) : (
            <div className="flex flex-col gap-1 p-2">
              {filtered.map((item) => (
                <div key={item.id ?? item.name} className="group relative">
                  <SheetCard
                    onClick={() => setActive(item.id)}
                    name={item.name}
                    active={item.id === activeId}
                  />
                  <button
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded opacity-0 group-hover:opacity-100 text-support-600 hover:text-danger-400 hover:bg-danger-900/30 transition-all"
                    onClick={(e) => deleteSheet(e, item.id)}
                  >
                    <IconTrash size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 w-full flex border-t border-border-main">
          <Button
            className="w-full"
            size="sm"
            icon={<IconPlus size={16} />}
            onClick={() => setOpen(true)}
          >
            Create Table
          </Button>
        </div>
      </div>
      <CreateTableDialog open={open} setOpen={setOpen} onCreated={refresh} />
    </>
  );
}
export default SheetList;
