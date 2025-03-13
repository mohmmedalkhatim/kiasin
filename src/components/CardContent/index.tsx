import { use, useEffect, useState } from "react";


function CardConten({ T, props }: { T: string, props: any }) {
    let [map,setMap] = useState();
    useEffect(()=>{
        
    },[])
    let action = components.get(T) || components.get('default');
    if (action) {
        action();
    }
}
export default CardConten;