import { invoke } from "@tauri-apps/api/core";
import { ChangeEvent, useState } from "react"




function Login() {
  let [User, setUser] = useState({
    name: "",
    email: "",
    password: "",
  });
  let onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUser(state => {
      let name = e.target.name;
      return ({
        [name]: e.target.value,
        ...state
      })
    })
  }
  let onSubmit = async (data: FormData) => {
    let a = await invoke("user_control", { payload: {command:"create", item: User } });
  }
  return (
    <div className="login_page">
      <div className="login_illustration">
        <img className="" />
      </div>
      <div className="login_form_container">
        <form className="login_form m_border" action={onSubmit}>
          <input type="text" name="name" onChange={onChange} />
          <input type="text" name="email" onChange={onChange} />
          <input type="password" name="password" onChange={onChange} />
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  )
}
export default Login