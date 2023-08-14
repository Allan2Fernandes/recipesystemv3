import React, {useEffect, useState} from "react";
import "./TopBar.css"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faRightFromBracket, faRightToBracket} from "@fortawesome/free-solid-svg-icons";

function TopBar(props){
    const [isLoggedIn, setIsLoggedIn] = useState(false)

    useEffect(() => {
        setIsLoggedIn(props.IsLoggedIn)
    }, [])


    return (
        <div id={"TopBarMainDiv"}>

            <label id={"TopBarTitleLabel"}>Recipe</label>

            <button id={"TopBarLoginButton"}>
                <FontAwesomeIcon icon={isLoggedIn?faRightFromBracket:faRightToBracket}/>
            </button>

        </div>
    )
}

export default TopBar