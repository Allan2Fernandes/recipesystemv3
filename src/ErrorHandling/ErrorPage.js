import "./ErrorPage.css"
import {useNavigate} from "react-router-dom";


export default function ErrorPage(props) {
    const navigate = useNavigate()

    function redirectToLoginPage(){
        if(props.parentPageIsLogin){
            props.setDisplayErrorPage(false)
        }else{
            navigate("/")
        }

    }

    return (
        <div className={"error-page"}>
            <div className={"oops"}>Oops!</div>
            <div className={"message"}>Something went wrong...</div>
            <div id={"RedirectionDiv"} onClick={redirectToLoginPage}>Click here to log in again</div>
        </div>
    );
}