import React, { useEffect, useState } from "react";
import "./login.css";
import { API_PATH } from "./api";
import { toast } from "sonner";
import { useRouter } from "@tanstack/react-router";

const LoginForm: React.FC = () => {
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [authcode, setAuthcode] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const router = useRouter();

  const [isRegister, setIsRegister] = useState(false);

  const toggleForm = () => {
    setIsRegister(!isRegister);
  };

  const do_login = () => {
    fetch(`${API_PATH}/login?name=${username}&password=${password}`).then(
      (res) => {
        console.log(res);
        if (res.status === 200) {
          res.json().then((data) => {
            console.log(data);
            if (data.jwt) {
              data.jwt && localStorage.setItem("jwt", data.jwt);
              data.is_admin && localStorage.setItem("is_admin", data.is_admin);
              data.username && localStorage.setItem("username", data.username);
              toast("Login success!");
              router.navigate({ to: "/" });
            } else {
              toast.error(data.msg);
            }
          });
        } else {
          res.json().then((data) => {
            toast.error(data.detail);
          });
        }
      }
    );
  };

  const do_register = () => {
    if (password !== confirmPassword) {
      alert("两次密码不一致");
      return;
    }
    fetch(
      `${API_PATH}/register?name=${username}&password=${password}&authcode=${authcode}`,
      {
        method: "POST",
      }
    ).then((res) => {
      console.log(res);
      if (res.status === 200) {
        toast("Register Success!");
      } else {
        res.json().then((data) => {
          console.error(data);
          alert(data.detail);
        });
      }
    });
  };

  useEffect(() => {
    const login = document.getElementById("login") as HTMLElement;
    const register = document.getElementById("register") as HTMLElement;
    const form_box = document.getElementsByClassName(
      "form-box"
    )[0] as HTMLElement;
    const register_box = document.getElementsByClassName(
      "register-form"
    )[0] as HTMLElement;
    const login_box = document.getElementsByClassName(
      "login-form"
    )[0] as HTMLElement;

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
  }, []);

  return (
    <div className="login-body">
      <div className="logincontainer mt-32 mx-auto">
        <div className="form-box">
          <div className="register-form hidden">
            <h3>REGISTER</h3>
            <input
              type="text"
              className="field"
              placeholder="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              type="password"
              className="field"
              placeholder="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <input
              type="password"
              className="field"
              placeholder="confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {import.meta.env.AUTHCODE && (
              <input
                type="text"
                className="field"
                placeholder="auth code"
                value={authcode}
                onChange={(e) => setAuthcode(e.target.value)}
              />
            )}
            <button onClick={do_register}>REGISTER</button>
          </div>

          <div className="login-form">
            <h2>LOGIN</h2>
            <input
              type="text"
              className="field"
              name="username"
              placeholder="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              type="password"
              className="field"
              name="password"
              placeholder="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={do_login}>LOGIN</button>
          </div>
        </div>

        <div className="con-box left">
          <h2>
            EC VH <br /> Counter
          </h2>
          <p>Already have an account?</p>
          <button id="login">Go Login</button>
        </div>

        <div className="con-box right">
          <h2>
            EC VH <br /> Counter
          </h2>
          <p>No account?</p>
          <button id="register">Go Register</button>
        </div>
      </div>

      <div className="mobile-login-form flip-container">
        <div
          className={`form-box-mobile flipper ${isRegister ? "flipped" : ""}`}
        >
          <div
            className={`register-form-mobile mobile-card-front ${isRegister ? "hidden" : ""}`}
          >
            <h3>REGISTER</h3>
            <input
              type="text"
              className="field"
              placeholder="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              type="password"
              className="field"
              placeholder="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <input
              type="password"
              className="field"
              placeholder="confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <input
              type="text"
              className="field"
              placeholder="auth code"
              value={authcode}
              onChange={(e) => setAuthcode(e.target.value)}
            />
            <button onClick={do_register}>REGISTER</button>
            <div className="under">
              Already have an account?{" "}
              <span className="underlogin" onClick={toggleForm}>
                Login
              </span>
            </div>
          </div>

          <div
            className={`login-form-mobile mobile-card-back ${isRegister ? "" : "hidden"}`}
          >
            <h2>LOGIN</h2>
            <input
              type="text"
              className="field"
              name="username"
              placeholder="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              type="password"
              className="field"
              name="password"
              placeholder="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={do_login}>LOGIN</button>
            <div className="under">
              No account?{" "}
              <span className="underlogin" onClick={toggleForm}>
                Register
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
