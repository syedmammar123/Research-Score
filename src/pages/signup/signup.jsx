import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {auth} from '../../firebase'
import {createUserWithEmailAndPassword} from 'firebase/auth'
import styles from './index.module.css';


const SignUp = (props) => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [password1, setPassword1] = useState("")
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

        if (password.length < 6) {
            setPasswordError("The password must be 6 characters or longer")
            return
        }

        if(password!==password1){
            setPasswordError("The passwords doesnot match!")
            return

        }

        try {
            const userCredentials = await createUserWithEmailAndPassword(auth,email,password)
            const user = userCredentials.user;
            localStorage.setItem('token',user.accessToken)
            localStorage.setItem('user',JSON.stringify(user));
            navigate('/')
            
        } catch (error) {
            console.error(error)
            setEmailError(error.message)
        }      

}

    return <div className={styles.mainContainer}>
        <div className={styles.titleContainer}>
            <div>SignUp</div>
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
                value={password}
                placeholder="Enter your password"
                type="password"
                onChange={ev => setPassword(ev.target.value)}
                className={styles.inputBox} />
            <label className={styles.errorLabel}>{passwordError}</label>
        </div>
        <br />
        <div className={styles.inputContainer}>
            <input
                value={password1}
                placeholder="Re-enter your password"
                type="password"
                onChange={ev => setPassword1(ev.target.value)}
                className={styles.inputBox} />
            {/* <label className={styles.errorLabel}>{passwordError}</label> */}
        </div>
        <br />
        <div className={styles.inputContainer}>
            <input
                className={styles.inputButton}
                type="button" 
                onClick={onButtonClick}
                value={"Sign Up"} />
        </div>
        <div className={styles.loginOrSignUp}>Need to <Link to='/login'>Login?</Link></div>
    </div>
}

export default SignUp
