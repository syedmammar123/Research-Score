import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { auth } from "../../firebase";
import { useNavigate } from "react-router-dom";
import styles from './index.module.css';

const Login = (props) => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [emailError, setEmailError] = useState("")
    const [passwordError, setPasswordError] = useState("")
    
    const navigate = useNavigate();
        
const onButtonClick = async (e) => {

        setEmailError("")
        setPasswordError("")

        // Check if the user has entered both fields correctly
        if ("" === email) {
            setEmailError("Please enter your email")
            return
        }

        if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
            setEmailError("Please enter a valid email")
            return
        }

        if ("" === password) {
            setPasswordError("Please enter a password")
            return
        }

        // if (password.length < 7) {
        //     setPasswordError("The password must be 8 characters or longer")
        //     return
        // }

        try {
            const userCredentials = await signInWithEmailAndPassword(auth,email,password)
            console.log(userCredentials);
            const user = userCredentials.user;
            localStorage.setItem('token',user.accessToken)
            localStorage.setItem('token',JSON.stringify(user));
            navigate('/')
            
        } catch (error) {
            setEmailError(error.message)
            // alert("Invalid Credentials!")
            // console.error(error)
        }      

}

    return <div className={styles.mainContainer}>
        <div className={styles.titleContainer}>
            <div>Login</div>
        </div>
        <br />
        <div className={styles.inputContainer}>
            <input
                value={email}
                placeholder="Enter your email here"
                onChange={ev => setEmail(ev.target.value)}
                className={styles.inputBox} />
            <label className={styles.errorLabel}>{emailError}</label>
        </div>
        <br />
        <div className={styles.inputContainer}>
            <input
                type="password"
                value={password}
                placeholder="Enter your password here"
                onChange={ev => setPassword(ev.target.value)}
                className={styles.inputBox} />
            <label className={styles.errorLabel}>{passwordError}</label>
        </div>
        <br />
        <div className={styles.inputContainer}>
            <input
                className={styles.inputButton}
                type="button"
                onClick={onButtonClick}
                value={"Log in"} />
        </div>
        <div className={styles.loginOrSignUp}>Need to <Link to='/signup'>Sign Up?</Link></div>

    </div>
}

export default Login
