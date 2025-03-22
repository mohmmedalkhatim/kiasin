function Image({ url }: { url: string }) {
    return (
        <div className="w-[18.6rem] h-[18.5rem] bg-cover" style={{backgroundImage:`url(${url})`}}/>
    )
}
export default Image