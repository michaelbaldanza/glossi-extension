import React, { useEffect, useState } from 'react';
import { login }  from '../services/users';
import { User } from '../services/interfaces';
import { LoginError, Page } from '../services/types';

interface LoginProps {
  currentPage: [Page, React.Dispatch<React.SetStateAction<Page>>];
  user: [User | null, React.Dispatch<React.SetStateAction<User | null>>];
}

function Login(props: LoginProps) {
  const [user, setUser] = props.user;
  const [currentPage, setCurrentPage] = props.currentPage;
  const [loginError, setLoginError] = useState<LoginError | null>(null)

  const [creds, setCreds] = useState({
    emailOrUsername: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCreds({
      ...creds,
      [e.target.name]: e.target.value,
    });
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const loggedUser = await login(creds);
    console.log(`trying to log loggedUser`)
    console.log(loggedUser)
    if (loggedUser && !loggedUser.error) {
      setUser(loggedUser);
    
      chrome.storage.local.set({ 'user': loggedUser });

      setCurrentPage('infobox');
    } else if (loggedUser && loggedUser.error) {
      console.log(loggedUser);
      setLoginError(loggedUser);
    }

  }


  const exclamationTriangle = <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-exclamation-circle-fill" viewBox="0 0 16 16">
  <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"/>
</svg>;

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
        {
          loginError ? 
          <div
            className="alert alert-danger d-flex align-items-center"
            role="alert"
          >
            {exclamationTriangle}
            <span className="error-text">
              {loginError.status === 401 ? 'Invalid credentials' : ` Error ${loginError.status} ${loginError.statusText}`}
            </span>
          </div>
          : ''
        }
        <button type="submit" className="btn btn-primary">
          Go
        </button>
      </form>
    </div>
  )
}

export default Login;