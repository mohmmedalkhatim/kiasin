import DashboardsLinkList from "../../cards/dashboard_link_list"
import SummaryCard from "../../cards/summary"
import ComparisonCard from "../../cards/comparison"
import BarChartCard from "../../cards/bar_chart"
import LineChartCard from "../../cards/line_chart"
import DonutChartCard from "../../cards/donut_chart"
import AreaChartCard from "../../cards/area_chart"
import BalanceCard from "../../cards/balance"
import ValueCard from "../../cards/value"
import RevenueCard from "../../cards/revenue"
import ProgressCard from "../../cards/progress"
import TodoCard from "../../cards/todo"
import FormCard from "../../cards/form"

function CardContent({ id, type }: { id: number, type: string }) {
    switch (type) {
        case "areas_links":
            return <DashboardsLinkList id={id} />
        case "summary":
            return <SummaryCard id={id} />
        case "comparison":
            return <ComparisonCard id={id} />
        case "bar_chart":
            return <BarChartCard id={id} />
        case "line_chart":
            return <LineChartCard id={id} />
        case "donut_chart":
            return <DonutChartCard id={id} />
        case "area_chart":
            return <AreaChartCard id={id} />
        case "balance":
            return <BalanceCard id={id} />
        case "form":
            return <FormCard id={id} />
        case "value":
            return <ValueCard id={id} />
        case "revenue":
            return <RevenueCard id={id} />
        case "progress":
            return <ProgressCard id={id} />
        case "todo":
            return <TodoCard id={id} />
        default:
            return <div className="p-4 text-sm text-support-500">{type}</div>
    }
}
export default CardContent
