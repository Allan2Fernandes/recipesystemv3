import React, {useEffect, useState} from "react";
import "./ListOfUsersTable.css"
import FetchQueries from "../../../../FetchHandler/FetchQueries";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEdit} from "@fortawesome/free-solid-svg-icons";
import secureLocalStorage from "react-secure-storage";
import {ParamIDs, Permissions} from "../../../../Constants";
import HelperFunctions from "../../../../HelperFunctions/HelperFunctions";

function ListOfUsersTable(props){

    async function changeHandlerUserAccessLevel(event, userIndex){
        var accessLevel = event.target.value
        var userDetails = props.userDetailsData[userIndex]
        var userName = userDetails['UserName']
        var password = userDetails['Password']
        var accessLevelCode = -1;
        if(accessLevel === "Admin"){
            accessLevelCode = 0
        }else if(accessLevel === "User"){
            accessLevelCode = 1
        }else if(accessLevel === "Disabled"){
            accessLevelCode = -1
        }
        var loggedInUserID = secureLocalStorage.getItem("UserDetails")['SetID']
        // To update a user, simply create a new user with the updated details.
        var updateUserQuery = `EXEC sp_SaveParams ${loggedInUserID}, 'User', '${ParamIDs.UserName};${userName};${ParamIDs.Password};${password};${ParamIDs.AccessLevel};${accessLevelCode}'`

        await FetchQueries.executeQueryInDatabase(updateUserQuery).then(result => {
            // Fetch the data again from the database and setstate to refresh the list to reflect the most recent changes.
            props.refreshUserDetailsTable()
        })
    }

    function handleChangeHideDisabledInput(event){
        props.setShowDisabledUsers(!props.showDisabledUsers)
    }

    function clickHandlerUpdatePassword(event, userIndex){
        // To change the password of a user, first open the dialog box. The username and accesslevel needs to be passed to the dialog box
        // This is done using the state, setUserDetailsToUpdate. The state is passed as a props to the dialog box.
        props.setDisplayDialogBox(true)
        props.setUserDetailsToUpdate({
            UserName: props.userDetailsData[userIndex]['UserName'],
            AccessLevel: props.userDetailsData[userIndex]['AccessLevel']
        })
    }

    return (
        <div id={"ListOfUsersTableMainDiv"}>
            <div id={"HideUsersDiv"}>
                <label>Show Disabled Users</label>
                <input
                    type={"checkbox"}
                    onChange={(event) => handleChangeHideDisabledInput(event)}
                    checked={props.showDisabledUsers}
                />
            </div>
            <div id={"ListOfUsersTableDiv"}>
                <table id={"ListOfUsersTable"}>
                    <thead>
                    <tr id={"ListOfUsersTableTitleRow"}>
                        <th>User Name</th>
                        <th>Access Level</th>
                        <th>Update Password</th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        props.userDetailsData.map((user, userIndex) => (
                            <tr id={"UserTableBodyRow"} className={userIndex%2===0?"EvenUserTableRow":"OddUserTableRow"} key={userIndex}>
                                <td>
                                    <label>{user['UserName']}</label>
                                </td>
                                <td>
                                    <select
                                        value={user['AccessLevel']}
                                        onChange={(event) => changeHandlerUserAccessLevel(event, userIndex)}
                                        disabled={!Permissions.editUserAccessLevel[HelperFunctions.getAccessLevelFromLocalStorage()]}
                                    >
                                        <option>Admin</option>
                                        <option>User</option>
                                        <option>Disabled</option>
                                    </select>
                                </td>
                                <td>
                                    <button
                                        onClick={(event) => clickHandlerUpdatePassword(event, userIndex)}
                                        disabled={!Permissions.editUserAccessLevel[HelperFunctions.getAccessLevelFromLocalStorage()]}
                                    >
                                        <FontAwesomeIcon icon={faEdit}/>
                                    </button>
                                </td>
                            </tr>
                        ))
                    }
                    </tbody>
                </table>
            </div>

        </div>
    )
}

export default ListOfUsersTable