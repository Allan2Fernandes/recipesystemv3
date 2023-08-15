import React, {useEffect, useState} from "react";
import "./TopBar.css"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faRightFromBracket, faRightToBracket} from "@fortawesome/free-solid-svg-icons";
import {useNavigate} from "react-router-dom";

function TopBar(props){
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        setIsLoggedIn(props.IsLoggedIn)
    }, [])

    function clickHandlerLogOutButton(){
        navigate("/")
    }


    return (
        <div id={"TopBarMainDiv"}>

            <label id={"TopBarTitleLabel"}>Recipe</label>

            {
                props.IsLoggedIn &&
                <button id={"TopBarLoginButton"} onClick={clickHandlerLogOutButton}>
                    <FontAwesomeIcon icon={isLoggedIn?faRightFromBracket:faRightToBracket}/>
                </button>
            }


        </div>
    )
}

export default TopBar