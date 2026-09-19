import { IconTable } from "@tabler/icons-react"

function DbCard({ name, onClick }: { name: string; onClick: () => void }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="gap-2 rounded-sm w-full hover:bg-[#e2e2e220] bg-transparent flex items-center primary_button p-3 transition-colors duration-150 text-left cursor-pointer"
        >
            <IconTable size={20} stroke={1.5} />
            <span className="text-sm">{name}</span>
        </button>
    )
}
export default DbCard
