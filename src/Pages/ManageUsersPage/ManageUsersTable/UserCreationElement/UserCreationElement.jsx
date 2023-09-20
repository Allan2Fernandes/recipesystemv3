import "./UserCreationElement.css"
import React, {useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faAdd} from "@fortawesome/free-solid-svg-icons";
import {ParamIDs, Permissions} from "../../../../Constants";
import FetchQueries from "../../../../FetchHandler/FetchQueries";
import HelperFunctions from "../../../../HelperFunctions/HelperFunctions";

function UserCreationElement(props){
    // States for the input fields.
    const [userName, setUserName] = useState("")
    const [password, setPassword] = useState("")
    const [accessLevel, setAccessLevel] = useState("Access Level")
    // Error handling flag. In case of caught error, set to true to display the error page instead of the component
    const [displayErrorMessage, setDisplayErrorMessage] = useState(false)

    function handleChange(event, fieldName){
        // Single function to handle state changes for all the fields
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
            // Iniitialize to disabled user.
            var accessLevelCode = -1;
            // Do not check for disabled, because that's the default initialization accessLevelCode
            if(accessLevel === "Admin"){
                accessLevelCode = 0
            }else if(accessLevel === "User"){
                accessLevelCode = 1
            }
            // Create user using the username, password and acdessLevelCode. Do not over ride the username check. Do check for already created users with this username
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
                // Refresh the list so the newly created user will be fetched and shown in the table
                props.refreshUserDetailsTable()
                // Reset states because another account that needs to be created will have to be with different details
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