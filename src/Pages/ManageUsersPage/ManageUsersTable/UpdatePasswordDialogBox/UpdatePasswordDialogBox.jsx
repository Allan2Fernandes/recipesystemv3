import "./UpdatePasswordDialogBox.css"
import React, {useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheck, faClose} from "@fortawesome/free-solid-svg-icons";
import FetchQueries from "../../../../FetchHandler/FetchQueries";

function UpdatePasswordDialogBox(props){
    // State to save the password entered in the input field
    const [updatedPassword, setUpdatedPassword] = useState("")

    function handleClickCloseButton(){
        // The state displayDialogBox determines whether the dialog box is shown or not.
        props.setDisplayDialogBox(false)
    }

    function handleClickConfirmButton(){
        // Do not save the password under certain conditions.
        // This could be expanded for non complex passwords.
        if(updatedPassword === ""){
            console.log("Empty password string")
            return;
        }
        var accessLevel = props.userDetailstToUpdate['AccessLevel']

        var accessLevelCode = -1;
        if(accessLevel === "Admin"){
            accessLevelCode = 0
        }else if(accessLevel === "User"){
            accessLevelCode = 1
        }else if(accessLevel === "Disabled"){
            accessLevelCode = -1
        }
        // To update the user, save a whole new user with the same username and new password.
        var query = `EXECUTE sp_CreateAccount @Username = '${props.userDetailstToUpdate['UserName']}', @Password = '${updatedPassword}', @AccessLevel = '${accessLevelCode}', @OverrideUserNameCheck = 1;`

        FetchQueries.executeQueryInDatabase(query).then(result => {
            console.log("Updated Password")
            // Reset states which were used to update password.
            setUpdatedPassword("")
            props.refreshUserDetailsTable()
            props.setDisplayDialogBox(false)
        }).catch(error => {
            props.setDisplayErrorPage(true)
        })
    }

    function handleClickOverlay(event){
        // If the overlay is clicked (outside the dialog box), close the dialog box.
        if(event.target.id === "PasswordDialogBoxOverlay"){
            props.setDisplayDialogBox(false)
        }
    }

    function changeHandlerUpdatedPassword(event){
        // OnChange event to update the text in the input field.
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