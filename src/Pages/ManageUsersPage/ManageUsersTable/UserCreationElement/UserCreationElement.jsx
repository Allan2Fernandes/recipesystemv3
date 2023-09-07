import "./UserCreationElement.css"
import React, {useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faAdd} from "@fortawesome/free-solid-svg-icons";

function UserCreationElement(){
    const [userName, setUserName] = useState("")
    const [password, setPassword] = useState("")
    const [accessLevel, setAccessLevel] = useState("")

    function handleChange(event, fieldName){
        if(fieldName === "Username"){
            setUserName(event.target.value)
        }else if(fieldName === "Password"){
            setPassword(event.target.value)
        }else if(fieldName === "AccessLevel"){
            setAccessLevel(event.target.value)
        }
    }

    return (
        <div id={"UserCreationElementMainDiv"}>
            <button id={"CreateUserButton"}>
                <FontAwesomeIcon icon={faAdd}/>
            </button>
            <input id={"UserNameInput"} type={"text"} placeholder={"Username"} value={userName} onChange={(event) => handleChange(event, "Username")}/>
            <input id={"NewUserPasswordInput"} type={"password"} placeholder={"Password"} value={password} onChange={(event) => handleChange(event, "Password")}/>
            <select id={"AccessLevelInput"} value={accessLevel} onChange={(event) => handleChange(event, "AccessLevel")}>
                <option>Access Level</option>
                <option>Admin</option>
                <option>User</option>
            </select>
        </div>
    )
}

export default UserCreationElement