import { ChangeEvent, useState } from 'react';
import { useAuth } from '../../context/User';

function Login() {
  const [User, setUser] = useState({
    name: '',
    email: '',
    password: '',
  });
  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name;
    console.log(name);
    console.log(User.name);
    setUser((state) => ({
      ...state,
      [name]: e.target.value,
    }));
  };
  const create = useAuth((state) => state.create);

  return (
    <div className="login_page">
      <div className="login_illustration">
        <img className="" />
      </div>
      <div className="login_form_container">
        <form
          className="login_form m_border"
          action={(e) => create(User.email, User.password, User.name)}
        >
          <input type="text" name="name" onChange={onChange} />
          <input type="text" name="email" onChange={onChange} />
          <input type="password" name="password" onChange={onChange} />
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
}
export default Login;
