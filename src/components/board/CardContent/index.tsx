import { useEffect, useState } from "react";
import Editor from "../../Editor";
import AreasList from "../../List";
import Editor_card from "../components/Editor";


function CardContent({ T, props }: { T: string, props: any }) {
    let [map,setMap] = useState(new Map([
        ["editor",<Editor_card content={props.content} title={"untitled"} />],
        ["Areaslist",<AreasList list={props}/>],
        ["default",<div>no content</div>]
    ]));
    useEffect(()=>{
        
    },[])
    let action = map.get(T) || map.get('default');
    if (action) {
        return action;
    }
}
export default CardContent;