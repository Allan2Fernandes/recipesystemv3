import "./LoginPage.css"
import TopBar from "../../SharedComponents/TopBar/TopBar";
import LoginCredentialsComponent from "./LoginCredentialsComponent/LoginCredentialsComponent";
import {useEffect, useState} from "react";
import ErrorPage from "../../ErrorHandling/ErrorPage";

function LoginPage(){
    const [displayErrorPage, setDisplayErrorPage] = useState(false)

    if(displayErrorPage){
        return (
            <ErrorPage
                setDisplayErrorPage={setDisplayErrorPage}
            />
        )
    }else{
        return (
            <div id={"LoginPageMainDiv"}>
                <TopBar IsLoggedIn={false} ParentPage={"LoginPage"}/>
                <LoginCredentialsComponent
                    setDisplayErrorPage={setDisplayErrorPage}
                />
            </div>
        )
    }

}

export default LoginPage