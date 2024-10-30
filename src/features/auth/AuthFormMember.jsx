import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLoginMutation, useRegisterMutation } from "./authSlice";

import styles from "./authforms.module.css";

/** This form allows users to register or log in. */
export default function AuthFormMember() {
  const navigate = useNavigate();

  // Handles swapping between login and register
  const [isLogin, setIsLogin] = useState(true);
  const authAction = isLogin ? "Login" : "Register";
  const altCopy = isLogin
    ? "Need an account? Register here."
    : "Already have an account? Login here.";

  // Controlled form fields
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [memberName, setMemberName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [code, setCode] = useState("");

  // Form submission
  const [login, { isLoading: loginLoading, error: loginError }] =
    useLoginMutation();
  const [register, { isLoading: registerLoading, error: registerError }] =
    useRegisterMutation();

  /** Send the requested authentication action to the API */
  const attemptAuth = async (evt) => {
    evt.preventDefault();

    const authMethod = isLogin ? login : register;
    const credentials = { username, password, memberName, businessName, code };

    // We don't want to navigate if there's an error.
    // `unwrap` will throw an error if there is one
    // so we can use a try/catch to handle it.
    try {
      await authMethod(credentials).unwrap();
      //set login naviagtion to proper paths
      isLogin ? navigate("/memberdashboard/") : navigate("/memberonboard/");
    } catch (err) {
      console.error(err);
    }
  };
  //create a login in form that reflects member and owner tables
  return (
    <article className="pageSetup">
      <h1>Team Member Portal</h1>
      <h2>{authAction}</h2>
      <form className={styles.loginForm} onSubmit={attemptAuth}>
        <div className={styles.loginInputSection}>
          <label className={styles.labelName}>Name</label>
          <input
            className={styles.loginFormInput}
            type="text"
            value={memberName}
            onChange={(e) => setMemberName(e.target.value)}
            autoComplete="name"
            required
          />
        </div>
        <div className={styles.loginInputSection}>
          <label className={styles.labelName}>Username</label>
          <input
            className={styles.loginFormInput}
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            required
          />
        </div>
        <div className={styles.loginInputSection}>
          <label className={styles.labelName}>Business</label>
          <input
            className={styles.loginFormInput}
            type="text"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            /*autoComplete="current-password"*/
          />
        </div>
        <div className={styles.loginInputSection}>
          <label className={styles.labelName}>Business Code</label>
          <input
            className={styles.loginFormInput}
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            /*autoComplete="current-password"*/
            required
          />
        </div>
        <div className={styles.loginInputSection}>
          <label className={styles.labelName}>Password</label>
          <input
            className={styles.loginFormInput}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
        </div>
        <button
          className={styles.authAction}
          disabled={loginLoading || registerLoading}
        >
          {loginLoading || registerLoading ? "Please wait..." : authAction}
        </button>
      </form>
      <a onClick={() => setIsLogin(!isLogin)}>{altCopy}</a>
      {(loginLoading || registerLoading) && <p>Please wait...</p>}
      {loginError && (
        <p role="alert">{loginError.data?.message || "Login failed"}</p>
      )}
      {registerError && (
        <p role="alert">
          {registerError.data?.message || "Registration failed"}
        </p>
      )}
    </article>
  );
}
