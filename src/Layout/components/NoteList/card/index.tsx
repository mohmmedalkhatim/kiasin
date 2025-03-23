import { Link } from "react-router-dom"

function Note_card({ title, content, id }: { title: string, content: string, id: string }) {
    return (
        <Link to={`/note/${id}`}>
            <section className="m_border">
                <h5>{title}</h5>
                <p>{content}</p>
            </section>
        </Link>
    )
}
export default Note_card