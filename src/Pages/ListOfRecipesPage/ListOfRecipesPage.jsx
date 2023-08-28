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

    useEffect(() => {
        if(secureLocalStorage.getItem("UserDetails") === null || secureLocalStorage.getItem("UserDetails") === undefined){
            setDisplayErrorPage(true)
        }
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
        await fetchListOfRecipes()
    }

    // Return the error page in case of an error
    var pageToReturn;
    if(displayErrorPage){
        pageToReturn = <ErrorPage/>
    }else{
        pageToReturn =
            <div id={"ListOfRecipesPageMainDiv"}>
                <TopBar IsLoggedIn={true} ParentPage={"ListOfRecipesPage"}/>
                <RecipeTable listOfRecipes={listOfRecipes} refreshListOfRecipes={refreshListOfRecipes}/>
            </div>
    }

    return pageToReturn
}

export default ListOfRecipesPage
