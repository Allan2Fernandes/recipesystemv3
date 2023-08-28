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

    function logoClickHandler(){
        if(props.ParentPage==="LoginPage"){
            return;
        }
        navigate("/ListOfRecipesPage")
    }


    return (
        <div id={"TopBarMainDiv"}>
            <div id={"TopBarTitleDiv"} onClick={logoClickHandler}>
                <label id={"TopBarTitleLabel"}>Recipe System</label>
            </div>

            {
                props.IsLoggedIn &&
                <button id={"ShelfSetUpButton"} onClick={clickHandlerNavigateToShelfSetUp} className={`TopBarButton ${props.ParentPage==="ShelfSetupPage"?"IsAlreadySelected":"IsNotSelected"}`}>Shelf Setup</button>
            }
            {
                props.IsLoggedIn &&
                <button id={"RecipeStepsButton"} onClick={clickHandlerNavigateToRecipeSteps} className={`TopBarButton ${props.ParentPage==="ListOfRecipesPage"?"IsAlreadySelected":"IsNotSelected"}`}>Recipes</button>
            }
            {
                props.IsLoggedIn &&
                <button id={"TopBarLoginButton"} onClick={clickHandlerLogOutButton} className={`TopBarButton`}>
                    <label>{"Logout"}</label>
                    <FontAwesomeIcon id={"LogoutIcon"} icon={isLoggedIn?faRightFromBracket:faRightToBracket}/>
                </button>
            }

        </div>
    )
}

export default TopBar