import React, {useState} from "react";
import "./CreateAccountComponent.css"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faUnlock, faUser} from "@fortawesome/free-solid-svg-icons";
import FetchQueries from "../../../FetchHandler/FetchQueries";
import {ParamIDs} from "../../../Constants";


function CreateAccountComponent(props){
    const [userName, setuserName] = useState("")
    const [password, setPassword] = useState("")
    const [repeatedPassword, setRepeatedPassword] = useState("")
    const [errorMessage, setErrorMessage] = useState("Pick Another Username")
    const [displayErrorMessage, setDisplayErrorMessage] = useState(false)

    function handleChangeInputField(event, fieldName){
        if(fieldName === "Username"){
            setuserName(event.target.value)
        }else if(fieldName === "Password"){
            setPassword(event.target.value)
        }else if(fieldName === "RepeatedPassword"){
            setRepeatedPassword(event.target.value)
        }
    }


    function handleClickCreateButton(){
        // Set up the query to execute the stored procedure to create the user
        var query = `EXECUTE sp_CreateAccount @Username = '${userName}', @Password = '${password}', @AccessLevel = '0', @OverrideUserNameCheck = 0;`
        FetchQueries.executeQueryInDatabase(query).then(result => {
            if(parseInt(result[0][0]['Created User']) ===0){
                setDisplayErrorMessage(true)
            }else if(parseInt(result[0][0]['Created User']) ===1){
                setDisplayErrorMessage(false)
                props.setDisplayLogin(true)
            }
        }).catch(error => {
            props.setDisplayErrorPage(true)
        })
    }

    function handleClickBackButton(){
        props.setDisplayLogin(true)
    }

    return <div id={"CreateAccountMainDiv"}>
        <center>
            <label id={"CreateAccountTitleLabel"}>New Account</label>
            <div id={"CreateUsernameDiv"}>
                <FontAwesomeIcon id={"CreateUsernameIcon"} icon={faUser}/>
                <input
                    id={"CreateUsernameInput"}
                    type={"text"}
                    placeholder={"Username"}
                    value={userName}
                    onChange={(event) => handleChangeInputField(event, "Username")}
                />
            </div>
            <div id={"CreatePasswordDiv"}>
                <FontAwesomeIcon className={"CreateLockIcon"} icon={faUnlock}/>
                <input
                    id={"CreatePasswordInput"}
                    type={"password"}
                    placeholder={"Password"}
                    value={password}
                    onChange={(event) => handleChangeInputField(event, "Password")}
                />
            </div>
            <div id={"RepeatPasswordDiv"}>
                <FontAwesomeIcon className={"CreateLockIcon"} icon={faUnlock}/>
                <input
                    id={"RepeatPasswordInput"}
                    type={"password"}
                    placeholder={"Repeat Password"}
                    value={repeatedPassword}
                    onChange={(event) => handleChangeInputField(event, "RepeatedPassword")}
                />
            </div>

            <div id={"CreateAccountButtonDiv"}>
                <button className={"CreateAccountButton"} onClick={handleClickBackButton}>Back</button>
                <button
                    className={"CreateAccountButton"}
                    disabled={(password !== repeatedPassword) || password === "" || repeatedPassword === "" || password.includes(";") || password.includes("'") || password.includes(",")}
                    onClick={handleClickCreateButton}
                >
                    Create
                </button>
            </div>
            {
                displayErrorMessage &&
                <div id={"ErrorMessageDiv"}>
                    <label id={"ErrorMessageLabel"}>{errorMessage}</label>
                </div>
            }

        </center>
    </div>
}

export default CreateAccountComponent
