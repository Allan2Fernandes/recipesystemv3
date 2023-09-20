import React, {useEffect, useState} from "react";
import "./ManageUsersTable.css"
import UserCreationElement from "./UserCreationElement/UserCreationElement";
import ListOfUsersTable from "./ListOfUsersTable/ListOfUsersTable";
import FetchQueries from "../../../FetchHandler/FetchQueries";
import UpdatePasswordDialogBox from "./UpdatePasswordDialogBox/UpdatePasswordDialogBox";

function ManageUsersTable(props){
    // Save the fetched user details in this state.
    const [userDetailsData, setUserDetailsData] = useState([])
    // Boolean state flag to un-hide disabled users
    const [showDisabledUsers, setShowDisabledUsers] = useState(false)
    // Boolean state flag to display dialog box or not. The dialog box is to update the user's password
    const [displayDialogBox, setDisplayDialogBox] = useState(false)
    // Save the newly entered user details in this state.
    const [userDetailsToUpdate, setUserDetailsToUpdate] = useState({
        UserName: "",
        AccessLevel: "User"
    })

    useEffect(() => {
        // Fetch all users  when the component is first rendered.
        fetchUserDetails()
    }, [])

    async function fetchUserDetails(){
        var userData = await FetchQueries.getListOfUsersDetails()
        setUserDetailsData(userData[0])
    }

    async function refreshUserDetailsTable(){
        // To re-render the page, fetch the details again and setState.
        await fetchUserDetails()
    }

    function getFilteredListOfUsers(){
        // Depending on the flag, filter by access level or not
        if(!showDisabledUsers){
            return userDetailsData.filter(user => user['AccessLevel'] !== "Disabled")
        }else{
            return userDetailsData
        }
    }

    return (
        <div id={"ManageUsersTableContainer"}>
            <div id={"ManageUsersTableTitleDiv"}>
                <center>
                    <label>User Management</label>
                </center>
            </div>
            <UserCreationElement
                setDisplayErrorPage={props.setDisplayErrorPage}
                refreshUserDetailsTable={refreshUserDetailsTable}
            />
            <ListOfUsersTable
                userDetailsData={getFilteredListOfUsers()}
                refreshUserDetailsTable={refreshUserDetailsTable}
                setShowDisabledUsers={setShowDisabledUsers}
                showDisabledUsers={showDisabledUsers}
                setDisplayDialogBox={setDisplayDialogBox}
                setUserDetailsToUpdate={setUserDetailsToUpdate}
            />
            {
                displayDialogBox &&
                <UpdatePasswordDialogBox
                    setDisplayDialogBox={setDisplayDialogBox}
                    userDetailstToUpdate={userDetailsToUpdate}
                    refreshUserDetailsTable={refreshUserDetailsTable}
                    setDisplayErrorPage={props.setDisplayErrorPage}

                />
            }
        </div>
    )
}

export default ManageUsersTable