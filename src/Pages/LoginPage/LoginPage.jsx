import "./LoginPage.css"
import TopBar from "../../SharedComponents/TopBar/TopBar";
import LoginCredentialsComponent from "./LoginCredentialsComponent/LoginCredentialsComponent";
import {useEffect, useState} from "react";
import ErrorPage from "../../ErrorHandling/ErrorPage";

function LoginPage(){
    const [displayErrorPage, setDisplayErrorPage] = useState(false)

    useEffect(() => {
        // This use effect is not getting triggered because it is still on the same page when redirected here from the error page.
        setDisplayErrorPage(false)
    }, [])

    if(displayErrorPage){
        return (
            <ErrorPage
                parentPageIsLogin={true}
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