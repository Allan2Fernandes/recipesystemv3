import "./ManageUsersPage.css"
import React from "react";
import TopBar from "../../SharedComponents/TopBar/TopBar";
import ManageUsersTable from "./ManageUsersTable/ManageUsersTable";

function ManageUsersPage(){
    return (
        <div id={"ManageUsersPageMainDiv"}>
            <TopBar IsLoggedIn={true} ParentPage={"UserManagementPage"}/>
            <ManageUsersTable/>
        </div>
    )
}

export default ManageUsersPage