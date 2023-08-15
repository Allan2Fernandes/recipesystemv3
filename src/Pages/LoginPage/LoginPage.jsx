import "./LoginPage.css"
import TopBar from "../../SharedComponents/TopBar/TopBar";
import LoginCredentialsComponent from "./LoginCredentialsComponent/LoginCredentialsComponent";

function LoginPage(){

    return (
        <div id={"LoginPageMainDiv"}>
            <TopBar IsLoggedIn={false}/>
            <LoginCredentialsComponent/>
        </div>
    )
}

export default LoginPage