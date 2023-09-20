import React, {useState} from "react";
import "./CreateAccountComponent.css"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faUnlock, faUser} from "@fortawesome/free-solid-svg-icons";
import FetchQueries from "../../../FetchHandler/FetchQueries";
import {ParamIDs} from "../../../Constants";


function CreateAccountComponent(props){
    // States for the username, password and repeat password fields
    const [userName, setuserName] = useState("")
    const [password, setPassword] = useState("")
    const [repeatedPassword, setRepeatedPassword] = useState("")
    // In case the username was already found in the database.
    const [errorMessage, setErrorMessage] = useState("Pick Another Username")
    // Boolean state flag to show error message.
    const [displayErrorMessage, setDisplayErrorMessage] = useState(false)

    function handleChangeInputField(event, fieldName){
        // Single function to handle onChanges for all 3 fields
        if(fieldName === "Username"){
            setuserName(event.target.value)
        }else if(fieldName === "Password"){
            setPassword(event.target.value)
        }else if(fieldName === "RepeatedPassword"){
            setRepeatedPassword(event.target.value)
        }
    }

    async function handleClickCreateButton(){
        // Set up the query to execute the stored procedure to create the user
        // Access level = 0 means admin. This component only creates admin accounts.
        var query = `EXECUTE sp_CreateAccount @Username = '${userName}', @Password = '${password}', @AccessLevel = '0', @OverrideUserNameCheck = 0;`
        await FetchQueries.executeQueryInDatabase(query).then(result => {
            if(parseInt(result[0][0]['Created User']) ===0){
                // If the user could not have been created because the username already exists in the database.
                // Look up the codes 0 and 1 in the stored procedure, sp_CreateAccount
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
        // navigate back to the log-in page.
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
