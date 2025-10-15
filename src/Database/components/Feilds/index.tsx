import { IconPlus } from "@tabler/icons-react"

function Fields({ list }: { list: String[] }) {
  return (
    <div className="flex items-center border border-[#e2e2e220] rounded-t-md">
      {list.map(name => (<div className="pl-4 cell">{name}</div>))}
      <div className="cell flex gap-2 text-[#e2e2e240] items-center justify-center hover:bg-[#e2e2e210]">
        <IconPlus size={"1rem"} />
        <div className="text-sm">column</div>
      </div>
    </div>
  )
}
export default Fields