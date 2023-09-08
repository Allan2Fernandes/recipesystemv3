import "./UpdatePasswordDialogBox.css"
import React, {useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheck, faClose} from "@fortawesome/free-solid-svg-icons";
import FetchQueries from "../../../../FetchHandler/FetchQueries";

function UpdatePasswordDialogBox(props){
    const [updatedPassword, setUpdatedPassword] = useState("")

    function handleClickCloseButton(){
        props.setDisplayDialogBox(false)
    }

    function handleClickConfirmButton(){
        var accessLevel = props.userDetailstToUpdate['AccessLevel']

        var accessLevelCode = -1;
        if(accessLevel === "Admin"){
            accessLevelCode = 0
        }else if(accessLevel === "User"){
            accessLevelCode = 1
        }else if(accessLevel === "Disabled"){
            accessLevelCode = -1
        }
        // Create user
        var query = `EXECUTE sp_CreateAccount @Username = '${props.userDetailstToUpdate['UserName']}', @Password = '${updatedPassword}', @AccessLevel = '${accessLevelCode}', @OverrideUserNameCheck = 1;`

        FetchQueries.executeQueryInDatabase(query).then(result => {
            console.log("Updated Password")
            setUpdatedPassword("")
            props.refreshUserDetailsTable()
            props.setDisplayDialogBox(false)
        }).catch(error => {
            props.setDisplayErrorPage(true)
        })
    }

    function handleClickOverlay(event){
        if(event.target.id === "PasswordDialogBoxOverlay"){
            props.setDisplayDialogBox(false)
        }
    }

    function changeHandlerUpdatedPassword(event){
        setUpdatedPassword(event.target.value)
    }

    return (
        <div id={"PasswordDialogBoxOverlay"} onClick={handleClickOverlay}>
            <div id={"DialogBoxMainDiv"}>
                <div id={"DialogTopBar"}>
                    <label id={"TopBarLabel"}>Update Password</label>
                    <button id={"DialogCloseButton"} onClick={handleClickCloseButton}>
                        <FontAwesomeIcon icon={faClose}/>
                    </button>
                </div>
                <div id={"DialogBoxBody"}>
                    <input type={"password"} placeholder={"New Password"} value={updatedPassword} onChange={(event) => changeHandlerUpdatedPassword(event)}/>
                    <button onClick={handleClickConfirmButton}>
                        <FontAwesomeIcon icon={faCheck}/>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default UpdatePasswordDialogBox