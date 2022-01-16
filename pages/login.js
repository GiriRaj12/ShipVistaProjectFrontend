import { Button, Link, Paper, TextField } from "@mui/material";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react"
import styles from '../styles/Login.module.css';
import {SESSION, BACKEND_TARGET_URL, LOGIN} from './constants/Constants';


function Login(){
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [alertText, setAlertText] = useState("");
    const router = useRouter();

    useEffect(() => {
        const userObject = JSON.parse(localStorage.getItem(SESSION));
        if(userObject){
          router.push("/app/home");
        }
      }, [])

    const login_user = () => {
        console.log("Into the login user !");
        if(!email){
            setAlertText("Please enter the email !")
            return;
        }

        if(!password){
            setAlertText("Please enter the email !")
            return;
        }

        if(!validateEmail(email)){
            setAlertText("Please enter the correct email id ! ")
            return;
        }

        if(password.length <= 7){
            setAlertText("Password should have atleast 8 characters !")
            return;
        }

        tryLogin({
            "email": email,
            "password": password
        }, loginCallback)


    }

    const loginCallback = (loginObject) => {
        const userObject = {"email":email, "password":password};
        if(loginObject.isResponse) {
            localStorage.setItem(SESSION, JSON.stringify(userObject));
            router.push("/app/home");
        } else{
            setAlertText("Wrong Credentials !");
        }
    }

    const validateEmail = (email) => {
        return String(email)
          .toLowerCase()
          .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          );
      };

    return (
        <div className="Login_Page_Container">

            <div
                className={styles.login_input_container}
            >
                
                <Paper
                    elevation={1}
                >
                <div className={styles.page_title}>
                    <p style={{padding:'1%'}}>Plants Water Page Login !</p>
                </div>


                <div>
                    {alertText ? <p style={{color:"red"}}>{alertText}</p> : <p></p>} 
                </div>

                    <div>
                        <TextField
                            style={{"marginTop":"10%", "marginRight":"10%", "marginLeft":"10%", "width":"80%"}}
                            id="email"
                            onChange={event => {
                                if(alertText)
                                    setAlertText(null);
                                setEmail(event.target.value)
                            }}
                            label="Email"
                            variant="outlined"
                        ></TextField>
                        <TextField
                            style={{"marginTop":"10%", "marginRight":"10%", "marginLeft":"10%", "width":"80%"}}
                            id="password"
                            onChange={event => {
                                if(alertText)
                                    setAlertText(null);
                                setPassword(event.target.value)
                            }}
                            label="Password"
                            variant="outlined"
                            type="password"
                        ></TextField>

                        <Button
                            className={styles.login_button_style}
                            variant="contained"
                            color="primary"
                            onClick={login_user}
                        >
                            Login
                        </Button>
                        
                        <p className={styles.login_regi_information_text}>
                            Dont have account ? <Link href="/register" variant="inherit">Register</Link>
                        </p>

                        </div>
                    </Paper>
            </div>
        </div>
    )
}

function tryLogin(object, callback){
    const request = {
        method : "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
            },
        body: JSON.stringify(object)
    }
    fetch(BACKEND_TARGET_URL + LOGIN, request)
    .then(res => res.json())
    .then(res => callback(res));
}

export default Login = Login;