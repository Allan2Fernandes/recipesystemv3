import React, {useEffect, useState} from "react";
import "./ManageUsersTable.css"
import UserCreationElement from "./UserCreationElement/UserCreationElement";
import ListOfUsersTable from "./ListOfUsersTable/ListOfUsersTable";
import FetchQueries from "../../../FetchHandler/FetchQueries";
import UpdatePasswordDialogBox from "./UpdatePasswordDialogBox/UpdatePasswordDialogBox";

function ManageUsersTable(props){
    const [userDetailsData, setUserDetailsData] = useState([])
    const [hideDisabledUsers, setHideDisabledUsers] = useState(false)
    const [displayDialogBox, setDisplayDialogBox] = useState(false)
    const [userDetailsToUpdate, setUserDetailsToUpdate] = useState({
        UserName: "",
        AccessLevel: "User"
    })

    useEffect(() => {
        // Fetch all users
        fetchUserDetails()
    }, [])

    async function fetchUserDetails(){
        var userData = await FetchQueries.getListOfUsersDetails()
        setUserDetailsData(userData[0])
    }

    async function refreshUserDetailsTable(){

        await fetchUserDetails()
    }

    function getFilteredListOfUsers(){
        if(hideDisabledUsers){
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
                setHideDisabledUsers={setHideDisabledUsers}
                hideDisabledUsers={hideDisabledUsers}
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