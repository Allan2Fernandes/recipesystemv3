import "./RecipeStepsPage.css"
import React, {useEffect, useState} from "react";
import {useLocation} from "react-router-dom";
import ErrorPage from "../../ErrorHandling/ErrorPage";
import TopBar from "../../SharedComponents/TopBar/TopBar";
import RecipeStepsComponent from "./RecipeStepsComponent/RecipeStepsComponent";

function RecipeStepsPage(){
    const location = useLocation();
    const [displayErrorPage, setDisplayErrorPage] = useState(false)
    const [selectedRecipeSetID, setSelectedRecipeSetID] = useState(0)
    const [selectedRecipeName, setSelectedRecipeName] = useState("")

    useEffect(() => {
        setSelectedRecipeSetID(location.state['recipeSetID'])
        setSelectedRecipeName(location.state['recipeName'])

    }, [])

    // Return the error page in case of an error
    var pageToReturn;
    if(displayErrorPage){
        pageToReturn = <ErrorPage/>
    }else{
        pageToReturn =
            <div id={"RecipeStepsPageMainDiv"}>
                <TopBar IsLoggedIn={true}/>
                <RecipeStepsComponent
                    selectedRecipeSetID={selectedRecipeSetID}
                    selectedRecipeName={selectedRecipeName}
                />
            </div>
    }

    return pageToReturn
}

export default RecipeStepsPage