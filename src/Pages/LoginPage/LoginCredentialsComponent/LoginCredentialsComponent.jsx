import React, {useEffect, useState} from "react";
import "./LoginCredentialsComponent.css"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faKey, faUnlock, faUser} from "@fortawesome/free-solid-svg-icons";
import FetchQueries from "../../../FetchHandler/FetchQueries";
import {useNavigate} from "react-router-dom";
import secureLocalStorage from "react-secure-storage";

function LoginCredentialsComponent(props){
    const [userName, setUserName] = useState("")
    const [password, setPassword] = useState("")
    const [loggedInUserDetails, setLoggedInUserDetails] = useState({
        SetID: 0,
        ParamID: 0,
        ParamValue: ""
    })
    const [invalidLoginDetailsEntered, setInvalidLoginDetailsEntered] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        secureLocalStorage.clear()
    })

    function changeHandler(event, field){
        var newValue = event.target.value
        if(field === "userName"){
            setUserName(newValue)
        }else if(field === "password"){
            setPassword(newValue)
        }
    }

    async function logIn(){
        try{
            var newUserDetails = await FetchQueries.loginGetUserID(userName, password)
            if(newUserDetails[0][0]['Found'] === 'Account Found'){
                // Account found
                if(newUserDetails[1][0] === undefined){
                    // Account found, but the password/Username doesn't match
                    setInvalidLoginDetailsEntered(true)
                }else{
                    //Handle log in. Account found and password/Username match
                    setLoggedInUserDetails(newUserDetails[1][0])
                    setInvalidLoginDetailsEntered(false)
                    secureLocalStorage.setItem("UserDetails", newUserDetails[1][0])
                    // Navigate to the page with list of recipes
                    navigate("/ListOfRecipesPage")
                }
            }else{
                // Account not found
                setInvalidLoginDetailsEntered(true)
            }
        }catch(error){
            props.setDisplayErrorPage(true)
        }

    }

    async function clickHandlerLoginButton(){
        await logIn()
    }

    async function onEnterKeyUpHandler(event){
        // Both enter keys should trigger the log in
        if(event.key.toString() === "Enter"){
            // Attempt to log in when the button is pressed
            await logIn()
        }
    }

    async function redirectToCreateAccount(){
        props.setDisplayLogin(false)
    }


    return (
        <div id={"MainLoginCredsComponentDiv"}>
            <center>
                <label id={"TitleLabel"}>User Login</label>
                <div id={"UsernameDiv"}>
                    <FontAwesomeIcon id={"UsernameIcon"} icon={faUser}/>
                    <input
                        id={"UsernameInput"}
                        type={"text"}
                        placeholder={"Username"}
                        value={userName}
                        onChange={(event) => changeHandler(event, "userName")}
                        onKeyUp={(event) => onEnterKeyUpHandler(event)}
                    />
                </div>
                <div id={"PasswordDiv"}>
                    <FontAwesomeIcon id={"LockIcon"} icon={faUnlock}/>
                    <input
                        id={"PasswordInput"}
                        type={"password"}
                        placeholder={"Password"}
                        value={password}
                        onChange={(event) => changeHandler(event, "password")}
                        onKeyUp={(event) => onEnterKeyUpHandler(event)}
                    />
                </div>

                <button id={"LoginButton"} onClick={clickHandlerLoginButton}>
                    <FontAwesomeIcon id={"LoginKeyIcon"} icon={faKey}/>
                </button>
                {
                    invalidLoginDetailsEntered &&
                    <div id={"InvalidDetailsDiv"}>
                        <label id={"InvalidDetailsLabel"}>Invalid Details Entered</label>
                    </div>
                }
                <div id={"CreateNewAccountDiv"}>
                    <button id={"CreateNewAccountButton"} onClick={redirectToCreateAccount}>Create Admin Account</button>
                </div>

            </center>

        </div>
    )
}

export default LoginCredentialsComponent