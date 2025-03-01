import { create } from "zustand";

interface User {
    name:string,
    email:string,
    create:(email:string,password:string)=>void,
    update:()=>void,
    delete:()=>void,
}


let useAuth = create<User>((set)=>({
    name:"",
    email:"",
    create:(email:string,password:string)=>{
        
    },
    update:()=>{},
    delete:()=>{}
}))