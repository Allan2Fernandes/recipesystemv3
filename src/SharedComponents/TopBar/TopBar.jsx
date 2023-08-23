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

    function clickHandlerNavigateToShelfSetUp(){
        navigate("/ShelfSetupPage")
    }

    function clickHandlerNavigateToRecipeSteps(){
        navigate("/ListOfRecipesPage")
    }


    return (
        <div id={"TopBarMainDiv"}>
            <label id={"TopBarTitleLabel"}>Recipe</label>
            {
                props.IsLoggedIn &&
                <button id={"ShelfSetUpButton"} onClick={clickHandlerNavigateToShelfSetUp} className={"TopBarButton"}>Shelf Setup</button>
            }
            {
                props.IsLoggedIn &&
                <button id={"RecipeStepsButton"} onClick={clickHandlerNavigateToRecipeSteps} className={"TopBarButton"}>Recipe Steps</button>
            }
            {
                props.IsLoggedIn &&
                <button id={"TopBarLoginButton"} onClick={clickHandlerLogOutButton} className={"TopBarButton"}>
                    <label>{"Logout"}</label>
                    <FontAwesomeIcon id={"LogoutIcon"} icon={isLoggedIn?faRightFromBracket:faRightToBracket}/>
                </button>
            }

        </div>
    )
}

export default TopBar