import "./ListOfRecipesPage.css"
import {useEffect, useState} from "react";
import FetchQueries from "../../FetchHandler/FetchQueries";
import ErrorPage from "../../ErrorHandling/ErrorPage";
import React from "react";

function ListOfRecipesPage(){
    const [userID, setUserID] = useState(1)
    const [tablePrefix, setTablePrefix] = useState("Recipe")
    const [displayErrorPage, setDisplayErrorPage] = useState(false)

    useEffect(() => {
        fetchListOfRecipes()
    }, []) // Execute this block of code when the component is first rendered

    async function fetchListOfRecipes(){
        var data = await FetchQueries.GetListOfRecipes()
            .then(result => {
            })
            .catch(e => {
                setDisplayErrorPage(true)
            })
    }


    var pageToReturn;
    if(displayErrorPage){
        pageToReturn = <ErrorPage/>

    }else{
        pageToReturn = <div id={"ListOfRecipesPageMainDiv"}>

        </div>
    }

    return pageToReturn


}

export default ListOfRecipesPage
