import { IconTable } from "@tabler/icons-react";

function SheetCard({
  name,
  active,
  onClick,
}: {
  name: string;
  active?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`gap-2 rounded-md w-full flex items-center p-2.5 transition-colors duration-150 text-left cursor-pointer ${
        active
          ? "bg-primary-600/12 text-primary-400"
          : "bg-transparent hover:bg-dark-800/60 text-support-200"
      }`}
    >
      <IconTable size={18} stroke={1.5} className={active ? "text-primary-400" : "text-support-500"} />
      <span className="text-sm truncate">{name}</span>
    </button>
  );
}
export default SheetCard;
