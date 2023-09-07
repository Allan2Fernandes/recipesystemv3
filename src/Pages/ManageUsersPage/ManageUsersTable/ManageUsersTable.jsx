import React from "react";
import "./ManageUsersTable.css"
import UserCreationElement from "./UserCreationElement/UserCreationElement";

function ManageUsersTable(){
    return (
        <div id={"ManageUsersTableContainer"}>
            <div id={"ManageUsersTableTitleDiv"}>
                <center>
                    <label>User Management</label>
                </center>
            </div>
            <UserCreationElement/>
        </div>
    )
}

export default ManageUsersTable