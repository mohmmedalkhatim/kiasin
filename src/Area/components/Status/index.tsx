import GoalCircle from "../../../components/Goal_circle"

function Status() {
  return (
    <div className="w-full h-full flex items-center justify-center">
        <GoalCircle>
            <div className="text-center flex flex-col items-center justify-center gap-4">
                <div className="text-sm">Daily goal</div>
                <div className="text-3xl">1</div>
                <div className="text-xs font-normal">hour</div>
            </div>
        </GoalCircle>
    </div>
  )
}
export default Status