import { useEffect, useState } from "react";
import Editor from "../Editor";
import AreasList from "../List";


function CardConten({ T, props }: { T: string, props: any }) {
    let [map,setMap] = useState(new Map([
        ["editor",<Editor {...props}/>],
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
export default CardConten;