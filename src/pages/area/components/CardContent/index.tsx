import AreasLinkList from "../../cards/area_link_list"
import SummaryCard from "../../cards/summary"
import ChartCard from "../../cards/chart"
import ComparisonCard from "../../cards/comparison"

function CardContent({ id, type }: { id: number, type: string }) {
    switch (type) {
        case "areas_links":
            return <AreasLinkList id={id} />
        case "summary":
            return <SummaryCard id={id} />
        case "chart":
            return <ChartCard id={id} />
        case "comparison":
            return <ComparisonCard id={id} />
        case "form":
            return <div className="p-4 text-sm text-support-500">Form</div>
        case "value":
            return <div className="p-4 text-sm text-support-500">Value</div>
        default:
            return <div className="p-4 text-sm text-support-500">{type}</div>
    }
}
export default CardContent
