import "./LoginPage.css"
import TopBar from "../../SharedComponents/TopBar/TopBar";
import LoginCredentialsComponent from "./LoginCredentialsComponent/LoginCredentialsComponent";
import {useEffect, useState} from "react";
import ErrorPage from "../../ErrorHandling/ErrorPage";
import CreateAccountComponent from "./CreateAccountComponent/CreateAccountComponent";

function LoginPage(){
    // Boolean state flag to show the error page in place of the components
    const [displayErrorPage, setDisplayErrorPage] = useState(false)
    // This page was originally designed to also have a create account component.
    // A flag was needed to either show the login component or the create account component
    const [displayLogin, setDisplayLogin] = useState(true)

    useEffect(() => {
        // This use effect is not getting triggered because it is still on the same page when redirected here from the error page.
        setDisplayErrorPage(false)
    }, [])

    // Display the error page in case of error
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
                {
                    displayLogin? // Display either login or create account component
                        <LoginCredentialsComponent
                            setDisplayErrorPage={setDisplayErrorPage}
                            setDisplayLogin={setDisplayLogin}
                        />:
                        <CreateAccountComponent
                            setDisplayErrorPage={setDisplayErrorPage}
                            setDisplayLogin={setDisplayLogin}
                        />
                }
            </div>
        )
    }
}

export default LoginPage