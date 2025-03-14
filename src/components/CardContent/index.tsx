import { use, useEffect, useState } from "react";
import Editor from "../Editor";
import List from "../List";


function CardConten({ T, props }: { T: string, props: any }) {
    let [map,setMap] = useState(new Map([
        ["editor",<Editor {...props}/>],
        ["list",<List {...props}/>],
        
    ]));
    useEffect(()=>{
        
    },[])
    let action = map.get(T) || map.get('default');
    if (action) {
        action;
    }
}
export default CardConten;