function Record({ list }: { list: String[] }) {
    return (
        <div>
            {list.map((item) => (<div>{item}</div>))}
        </div>
    )
}
export default Record