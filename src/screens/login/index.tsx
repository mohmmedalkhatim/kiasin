import { invoke } from "@tauri-apps/api/core";
import { ChangeEvent, ChangeEventHandler, useState } from "react"




function Login() {
  let [User,setUser] = useState({
    name:"",
    email:"",
    password:"",
  });
  let onChange = (e:ChangeEvent<HTMLInputElement>)=>{
    setUser(state=>{
      let name = e.target.name;
      return ({
        [name]:e.target.value,
        ...state
      })
    })
  }
  let onSubmit = async (data:FormData)=>{
     let a = await invoke("",{payload:{item:User}});
  }
  return (
    <div className="login_page">
      <div className="login_illustration">
        <img/>
      </div>
      <form className="login_form" action={onSubmit}>
        <input type="text" name="name" onChange={onChange} />
        <input type="text" name="email" onChange={onChange} />
        <input type="password" name="password" onChange={onChange} />
        <button type="submit">Login</button>
      </form>
    </div>
  )
}
export default Login