import Navbar from "./components/Navbar"
import Header from "./components/Header"
import WeekEvents from "./components/WeekEvents"
import "./style.css"

function EventsPage() {
  return (
    <>
      <Header />
      <main className="content flex gap-4 p-6 w-[85rem]">
          <WeekEvents />
          <Navbar />
      </main>
    </>
  )
}
export default EventsPage