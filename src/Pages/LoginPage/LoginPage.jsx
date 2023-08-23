import "./LoginPage.css"
import TopBar from "../../SharedComponents/TopBar/TopBar";
import LoginCredentialsComponent from "./LoginCredentialsComponent/LoginCredentialsComponent";
import {useState} from "react";
import ErrorPage from "../../ErrorHandling/ErrorPage";

function LoginPage(){
    const [displayErrorPage, setDisplayErrorPage] = useState(false)

    if(displayErrorPage){
        return (<ErrorPage/>)
    }else{
        return (
            <div id={"LoginPageMainDiv"}>
                <TopBar IsLoggedIn={false}/>
                <LoginCredentialsComponent
                    setDisplayErrorPage={setDisplayErrorPage}
                />
            </div>
        )
    }

}

export default LoginPage