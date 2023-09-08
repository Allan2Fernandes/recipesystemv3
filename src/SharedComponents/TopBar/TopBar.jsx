import React, {useEffect, useState} from "react";
import "./TopBar.css"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faRightFromBracket, faRightToBracket} from "@fortawesome/free-solid-svg-icons";
import {useNavigate} from "react-router-dom";
import secureLocalStorage from "react-secure-storage";
import {Permissions} from "../../Constants";
import HelperFunctions from "../../HelperFunctions/HelperFunctions";

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

    function clickHandlerNavigateToManageUsers(){
        navigate("/ManageUsersPage")
    }


    return (
        <div id={"TopBarMainDiv"}>
            <div id={"TopBarTitleDiv"} onClick={logoClickHandler}>
                <label id={"TopBarTitleLabel"}>Recipe System</label>
            </div>
            {
                props.IsLoggedIn &&
                <button
                    id={"UserManagementButton"}
                    disabled={!Permissions.viewUserManagementPage[HelperFunctions.getAccessLevelFromLocalStorage()]}
                    onClick={clickHandlerNavigateToManageUsers}
                    className={`TopBarButton ${props.ParentPage==="UserManagementPage"?"IsAlreadySelected":"IsNotSelected"}`}
                >
                    User Management
                </button>
            }
            {
                props.IsLoggedIn &&
                <button
                    id={"RecipeStepsButton"}
                    onClick={clickHandlerNavigateToRecipeSteps}
                    disabled={!Permissions.viewListOfRecipesPage[HelperFunctions.getAccessLevelFromLocalStorage()]}
                    className={`TopBarButton ${props.ParentPage==="ListOfRecipesPage"?"IsAlreadySelected":"IsNotSelected"}`}
                >
                    Recipes
                </button>
            }
            {
                props.IsLoggedIn &&
                <button
                    id={"ShelfSetUpButton"}
                    onClick={clickHandlerNavigateToShelfSetUp}
                    disabled={!Permissions.viewShelfSetUpValuesPage[HelperFunctions.getAccessLevelFromLocalStorage()]}
                    className={`TopBarButton ${props.ParentPage==="ShelfSetupPage"?"IsAlreadySelected":"IsNotSelected"}`}
                >
                    Shelf Setup
                </button>
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