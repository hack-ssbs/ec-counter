import React from 'react';
import './login.css'

interface LoginFormProps {
  username: string;
  password: string;
}

const LoginForm: React.FC<LoginFormProps> = ({ username, password }) => {
  return (
    <div id="bigBox">
      <h1>LOGIN</h1>
      <div className="inputBox">
        <div className="inputText">
          <span className="iconfont icon-nickname"></span>
          <input type="text" placeholder="Username" value={username} />
        </div>
        <div className="inputText">
          <span className="iconfont icon-visible"></span>
          <input type="password" placeholder="Password" value={password} />
        </div>
      </div>
      <input className="loginButton" type="button" value="Login" />
    </div>
  );
};

export default LoginForm;
