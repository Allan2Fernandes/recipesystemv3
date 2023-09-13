import "./ListOfRecipesPage.css"
import {useEffect, useState} from "react";
import FetchQueries from "../../FetchHandler/FetchQueries";
import ErrorPage from "../../ErrorHandling/ErrorPage";
import React from "react";
import TopBar from "../../SharedComponents/TopBar/TopBar";
import secureLocalStorage from "react-secure-storage";
import RecipeTable from "./RecipeTable/RecipeTable";

function ListOfRecipesPage(){
    const [userID, setUserID] = useState(1)
    const [tablePrefix, setTablePrefix] = useState("Recipe")
    const [displayErrorPage, setDisplayErrorPage] = useState(false)
    const [listOfRecipes, setListOfRecipes] = useState([])
    const [showDisabledRecipes, setShowDisabledRecipes] = useState(false)

    useEffect(() => {
        // The page needs to be entered using the log in page. If navigated to by bypassing the log in page, show error page.
        if(secureLocalStorage.getItem("UserDetails") === null || secureLocalStorage.getItem("UserDetails") === undefined){
            setDisplayErrorPage(true)
        }
        //Fetch all recipes from the database.
        fetchListOfRecipes()
    }, []) // Execute this block of code when the component is first rendered

    async function fetchListOfRecipes(){
        await FetchQueries.getListOfRecipes()
            .then(result => {
                setListOfRecipes(result[0])
            })
            .catch(e => {
                setDisplayErrorPage(true)
            })
    }

    async function refreshListOfRecipes(){
        // When changes are saved in the database, this function will be called to refresh the list of recipes being displayed
        await fetchListOfRecipes()
    }

    function handleChangeShowDisabledRecipes(){
        setShowDisabledRecipes(!showDisabledRecipes)
    }



    // Return the error page in case of an error
    var pageToReturn;
    if(displayErrorPage){
        pageToReturn = <ErrorPage parentPageIsLogin={false} setDisplayErrorPage={setDisplayErrorPage}/>
    }else{
        pageToReturn =
            <div id={"ListOfRecipesPageMainDiv"}>
                <TopBar IsLoggedIn={true} ParentPage={"ListOfRecipesPage"}/>
                <RecipeTable
                    listOfRecipes={listOfRecipes}
                    refreshListOfRecipes={refreshListOfRecipes}
                    showDisabledRecipes={showDisabledRecipes}
                    handleChangeShowDisabledRecipes={handleChangeShowDisabledRecipes}
                />
            </div>
    }

    return pageToReturn
}

export default ListOfRecipesPage
