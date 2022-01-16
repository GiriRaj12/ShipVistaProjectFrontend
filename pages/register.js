import { Button, Link, Paper, TextField } from "@mui/material";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react"
import styles from '../styles/Login.module.css';
import { BACKEND_TARGET_URL, ENCODE_STR, SESSION, USER } from "./constants/Constants";


function Register(){
    const [email, setEmail] = useState();
    const [username, setUserName] = useState();
    const [password, setPassword] = useState();
    const [alertText, setAlertText] = useState();
    const [admin_password, setAdminPassword] = useState();
    const router = useRouter();

    const register_user = () => {
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

        if(!admin_password){
            setAlertText("Please add admin password ");
            return;
        }

        tryRegister({
            "user_name":username,
            "email": email,
            "user_password": password
        }, admin_password, after_register)

    }

    const after_register = (response, unAuthorized = null) => {
        console.log(response);
        if(response && response.isResponse){
            const userObject = {'email':email, 'password':password};
            localStorage.setItem(SESSION, JSON.stringify(userObject));
            router.push("/app/home");
        } else {
            if(unAuthorized)
                setAlertText("Please enter the correct admin password !")
            else if(response.response.message == 'USER_ALDREADY_EXISTS')
                setAlertText("User Aldready Exists, please login !");
            else
                setAlertText("Sorry Something Went Wrong Please try again !");
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
                    <p style={{padding:'1%'}}>Plants Water Page Register !</p>
                </div>

                <div>
                    {(alertText) ? <p style={{color:'red'}}>{alertText}</p> : <p></p>} 
                </div>

                    <div>
                        <TextField
                            style={{"marginTop":"5%", "marginRight":"10%", "marginLeft":"10%", "width":"80%"}}
                            id="username"
                            label="User Name"
                            variant="outlined"
                            type="text"
                            onChange={e => {
                                setAlertText(null);
                                setUserName(e.target.value)
                            }}
                        ></TextField>

                        <TextField
                            style={{"marginTop":"10%", "marginRight":"10%", "marginLeft":"10%", "width":"80%"}}
                            id="Email"
                            label="Email"
                            variant="outlined"
                            type="email"
                            onChange={e =>  {
                                setAlertText(null);
                                setEmail(e.target.value)
                            }}
                        ></TextField>


                        <TextField
                            style={{"marginTop":"10%", "marginRight":"10%", "marginLeft":"10%", "width":"80%"}}
                            id="password"
                            label="Password"
                            variant="outlined"
                            type="password"
                            onChange={e =>  {
                                setAlertText(null);
                                setPassword(e.target.value)
                            }}
                        ></TextField>

                        <TextField
                            style={{"marginTop":"10%", "marginRight":"10%", "marginLeft":"10%", "width":"80%"}}
                            id="admin_password"
                            label="Admin Password"
                            variant="outlined"
                            type="password"
                            onChange={e =>  {
                                setAlertText(null);
                                setAdminPassword(e.target.value)
                            }}
                        ></TextField>
                        <p>To register we need admin password ! (Please contact admin) </p>

                        <Button
                            className={styles.login_button_style}
                            variant="contained"
                            color="primary"
                            onClick={register_user}
                        >
                            Register
                        </Button>
                        
                        <p className={styles.login_regi_information_text}>
                            Aldready have an account ? <Link href="/login" variant="inherit">Login</Link>
                        </p>

                        </div>
                    </Paper>
            </div>
        </div>
    )
}

async function tryRegister(object, admin_password, callback){
     const request = {
        method : "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Basic ' + ENCODE_STR('admin:'+admin_password)
            },
        body: JSON.stringify(object)
    }
    fetch(BACKEND_TARGET_URL + USER, request)
        .then(async (res) => {
            if(res.status == 403)
                callback(null, "UN_AUTHORIZED")
            else
                callback(await res.json())
        })
    
    
}

export default Register = Register;