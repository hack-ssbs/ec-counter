import React from 'react';
import './login.css'

// interface LoginFormProps {
//   username: string;
//   password: string;
// }


const LoginForm: React.FC = () => {
  const login = document.getElementById("login") as HTMLElement;
  const register = document.getElementById("register") as HTMLElement;
  const form_box = document.getElementsByClassName("form-box")[0] as HTMLElement;
  const register_box = document.getElementsByClassName("register-form")[0] as HTMLElement;
  const login_box = document.getElementsByClassName("login-form")[0] as HTMLElement;

  register.addEventListener("click", () => {
      if (form_box && login_box && register_box) {
          form_box.style.transform = "translateX(80%)";
          login_box.classList.add("hidden");
          register_box.classList.remove("hidden");
      }
  });

  login.addEventListener("click", () => {
      if (form_box && login_box && register_box) {
          form_box.style.transform = "translateX(0%)";
          register_box.classList.add("hidden");
          login_box.classList.remove("hidden");
      }
  });

  return (
    <div>
      <div className="container">

        <div className="form-box">

          <div className="register-form hidden">
            <h3>REGISTER</h3>
            <input type="text" placeholder="username" />
            <input type="text" placeholder="password" />
            <input type="text" placeholder="auth code" />
            <input type="text" placeholder="confirm password" />
            <button>REGISTER</button>
          </div>

          <div className="login-form">
            <h2>LOGIN</h2>
            <input type="text" name="username" placeholder="username" />
            <input type="password" name="password" placeholder="password" />
            <button type="submit">LOGIN</button>
          </div>

        </div>

        <div className="con-box left">
          <h2>欢迎来到</h2>
          <p>已有帐号</p>
          <button id="login">去登录</button>
        </div>

        <div className="con-box right">
          <h2>欢迎来到</h2>
          <p>没有账号？</p>
          <button id="register">去注册</button>
        </div>

      </div>
    </div>
  );
};

export default LoginForm;
