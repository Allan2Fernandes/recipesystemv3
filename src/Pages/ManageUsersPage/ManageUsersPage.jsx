import "./ManageUsersPage.css"
import React, {useState} from "react";
import TopBar from "../../SharedComponents/TopBar/TopBar";
import ManageUsersTable from "./ManageUsersTable/ManageUsersTable";
import ErrorPage from "../../ErrorHandling/ErrorPage";

function ManageUsersPage(){
    // Boolean state flag to display error page or not
    const [displayErrorPage, setDisplayErrorPage] = useState(false)

    if(displayErrorPage){
        return <ErrorPage/>
    }else{
        return (
            // Made up of 2 components, the top bar and the users table
            <div id={"ManageUsersPageMainDiv"}>
                <TopBar IsLoggedIn={true} ParentPage={"UserManagementPage"}/>
                <ManageUsersTable setDisplayErrorPage={setDisplayErrorPage}/>
            </div>
        )
    }

}

export default ManageUsersPage