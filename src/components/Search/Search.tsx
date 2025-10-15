import { IconSearch } from "@tabler/icons-react"
import Input from "../Input"
import { useRef, useState } from "react"
import { CSSTransition } from "react-transition-group"
import { useSearch } from "../../context/para/search"
import { useDebounce } from "react-use"
function Search() {
    const [text, setText] = useState("")
    const results = useSearch(state => state.results)
    const find = useSearch(state => state.find)
    const ref = useRef(null);
    const main_ref = useRef(null)
    useDebounce(() => find(text), 500, [text])
    return (
        <CSSTransition ref={main_ref} timeout={500} in={results?.length !== 0} unmountOnExit classNames={"fade_in"}>
            <div className="flex items-center justify-center h-screen w-screen fixed z-[100]">
                <Input icon={<IconSearch />} className="w-[40rem]" value={text} onChange={setText} />
                <CSSTransition ref={ref} timeout={500} in={results?.length !== 0} unmountOnExit classNames={"fade_in"}>
                    <div ref={ref}>
                        <ul>
                            {results.map((_, index) => (
                                <li>{index}</li>
                            ))}
                        </ul>
                    </div>
                </CSSTransition>

            </div>
        </CSSTransition>
    )
}
export default Search