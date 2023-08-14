import React, {useState} from "react";
import "./LoginCredentialsComponent.css"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faKey, faUnlock, faUser} from "@fortawesome/free-solid-svg-icons";
import FetchQueries from "../../../FetchHandler/FetchQueries";

function LoginCredentialsComponent(){
    const [userName, setUserName] = useState("")
    const [password, setPassword] = useState("")

    function changeHandler(event, field){
        var newValue = event.target.value
        if(field === "userName"){
            setUserName(newValue)
        }else if(field === "password"){
            setPassword(newValue)
        }
    }

    async function clickHandlerLoginButton(){
        var newUserDetails = await FetchQueries.loginGetUserID(userName, password)
        if(newUserDetails[0].length === 0){
            //TODO: Find a more robust method to determine if the details are invalid
        }
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
                    />
                </div>

                <button id={"LoginButton"} onClick={clickHandlerLoginButton}>
                    <FontAwesomeIcon id={"LoginKeyIcon"} icon={faKey}/>
                </button>
            </center>

        </div>
    )
}

export default LoginCredentialsComponent