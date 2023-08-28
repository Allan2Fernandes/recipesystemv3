import "./ErrorPage.css"
import {useNavigate} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCircleExclamation, faHome} from "@fortawesome/free-solid-svg-icons";


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
        <div id={"ErrorPageMainDiv"}>
            <div id={"ImageDiv"}>
                <FontAwesomeIcon id={"ExclamationIcon"} icon={faCircleExclamation}/>
            </div>
            <div id={"ErrorTextDiv"}>
                <center>
                    <label id={"ErrorMessageLabel"}>Something appears to have gone wrong</label>
                    <div id={"RedirectButtonDiv"}>
                        <button onClick={redirectToLoginPage}>
                            <FontAwesomeIcon id={"RedirectButtonIcon"} icon={faHome}/>
                            Login
                        </button>
                    </div>

                </center>
            </div>
        </div>
    );
}