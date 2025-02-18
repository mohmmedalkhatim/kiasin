import { HTMLInputTypeAttribute } from "react";
import styled from "styled-components";


function Input({ type, props, action }: { type: string, props: any, action: (e:any) => void }) {
    return (
        <input className="input" type={type} {...props} onChange={action} />
    )
}


export default Input