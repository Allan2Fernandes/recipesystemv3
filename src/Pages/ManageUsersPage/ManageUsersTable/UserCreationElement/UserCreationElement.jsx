import "./UserCreationElement.css"
import React, {useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faAdd} from "@fortawesome/free-solid-svg-icons";
import {ParamIDs, Permissions} from "../../../../Constants";
import FetchQueries from "../../../../FetchHandler/FetchQueries";
import HelperFunctions from "../../../../HelperFunctions/HelperFunctions";

function UserCreationElement(props){
    const [userName, setUserName] = useState("")
    const [password, setPassword] = useState("")
    const [accessLevel, setAccessLevel] = useState("Access Level")
    const [displayErrorMessage, setDisplayErrorMessage] = useState(false)

    function handleChange(event, fieldName){
        if(fieldName === "Username"){
            setUserName(event.target.value)
        }else if(fieldName === "Password"){
            setPassword(event.target.value)
        }else if(fieldName === "AccessLevel"){
            setAccessLevel(event.target.value)
        }
    }

    function createuser(){
        // Don't create user if any of the details are not filled in correctly
        if(userName === "" || password === "" || accessLevel === "Access Level"){
            return
        }else{
            var accessLevelCode = -1;
            if(accessLevel === "Admin"){
                accessLevelCode = 0
            }else if(accessLevel === "User"){
                accessLevelCode = 1
            }
            // Create user
            var query = `EXECUTE sp_CreateAccount @Username = '${userName}', @Password = '${password}', @AccessLevel = '${accessLevelCode}', @OverrideUserNameCheck = 0;`

            FetchQueries.executeQueryInDatabase(query).then(result => {
                if(parseInt(result[0][0]['Created User']) ===0){
                    // Account with this username already exists
                    setDisplayErrorMessage(true)
                }else if(parseInt(result[0][0]['Created User']) ===1){
                    // Account was successfully created
                    setDisplayErrorMessage(false)
                }
            }).then(result => {
                props.refreshUserDetailsTable()
                setUserName("")
                setPassword("")
                setAccessLevel("Access Level")
            })
                .catch(error => {
                // There was an error somewhere
                props.setDisplayErrorPage(true)
            })
        }
    }

    return (
        <div id={"UserCreationElementMainDiv"}>
            <button id={"CreateUserButton"} onClick={createuser} disabled={!Permissions.createUser[HelperFunctions.getAccessLevelFromLocalStorage()]}>
                <FontAwesomeIcon icon={faAdd}/>
            </button>
            <input
                id={"UserNameInput"}
                type={"text"}
                placeholder={"Username"}
                value={userName} onChange={(event) => handleChange(event, "Username")}
                disabled={!Permissions.createUser[HelperFunctions.getAccessLevelFromLocalStorage()]}
            />
            <input
                id={"NewUserPasswordInput"}
                type={"password"}
                placeholder={"Password"}
                value={password} onChange={(event) => handleChange(event, "Password")}
                disabled={!Permissions.createUser[HelperFunctions.getAccessLevelFromLocalStorage()]}
            />
            <select
                id={"AccessLevelInput"}
                value={accessLevel} onChange={(event) => handleChange(event, "AccessLevel")}
                disabled={!Permissions.createUser[HelperFunctions.getAccessLevelFromLocalStorage()]}
            >
                <option>Access Level</option>
                <option>Admin</option>
                <option>User</option>
            </select>
            {
                displayErrorMessage &&
                <label>Select another username</label>
            }
        </div>
    )
}

export default UserCreationElement