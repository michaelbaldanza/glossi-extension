import { useState } from 'react';
import { login }  from '../services/users';

function Login() {
  const [creds, setCreds] = useState({
    emailOrUsername: '',
    password: '',
  });

  const [user, setUser] = useState(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCreds({
      ...creds,
      [e.target.name]: e.target.value,
    });
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(creds);
    const user = await login(creds);
    console.log(user);
  }



  return (
    <div className="inner-container">
      <h3>Login</h3>
      <form
        onSubmit={handleSubmit}
      >
        <div className="mb-3">
          <label htmlFor="emailOrUsername">Email or username</label>
          <input
            className="form-control"
            id="emailOrUsername"
            name="emailOrUsername"
            type="text"
            onChange={handleChange}
            autoComplete="username"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password">Password</label>
          <input
            className="form-control"
            id="password"
            name="password"
            type="password"
            onChange={handleChange}
            autoComplete="current-password"
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Go
        </button>
      </form>
    </div>
  )
}

export default Login;