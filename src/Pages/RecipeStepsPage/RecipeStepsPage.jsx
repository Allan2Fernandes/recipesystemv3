import "./RecipeStepsPage.css"
import React, {useEffect, useState} from "react";
import {useLocation, useParams} from "react-router-dom";
import ErrorPage from "../../ErrorHandling/ErrorPage";
import TopBar from "../../SharedComponents/TopBar/TopBar";
import RecipeStepsComponent from "./RecipeStepsComponent/RecipeStepsComponent";
import secureLocalStorage from "react-secure-storage";
import FetchQueries from "../../FetchHandler/FetchQueries";

function RecipeStepsPage(){
    const location = useLocation();
    const {recipeSetID, recipeName, urlSelectedStepIndex, readOnly} = useParams()
    const [displayErrorPage, setDisplayErrorPage] = useState(false)
    const [selectedRecipeSetID, setSelectedRecipeSetID] = useState(0)
    const [selectedRecipeName, setSelectedRecipeName] = useState("")
    const [preDefinedSelectedStepIndex, setPreDefinedSelectedStepIndex] = useState(-1)
    const [pageIsReadOnly, setPageIsReadOnly] = useState(false)

    useEffect(() => {
        try{
            setSelectedRecipeSetID(recipeSetID)
            setSelectedRecipeName(recipeName)
            setPreDefinedSelectedStepIndex(parseInt(urlSelectedStepIndex))
            setPageIsReadOnly(readOnly === "true")
            console.log(readOnly === "true")
        }catch(error){
            setDisplayErrorPage(true)
        }
    }, [])

    function saveRecipe(recipeData){
        // Get the user's details because it has to be saved under the logged in user's ID
        var loggedInUserID = secureLocalStorage.getItem("UserDetails")['SetID']

        // Save the recipe
        // Queries to save SAME recipe name (important because of the aggregate function in sql query) and dataset type (recipe, step or substep)
        var recipeNameParamID = 35006
        var recipeTypeParamID = 10002
        var recipeTypeParamValue = 1
        var saveRecipeNameParams = `${recipeNameParamID};${selectedRecipeName};`
        var saveRecipeTypeParams = `${recipeTypeParamID};${recipeTypeParamValue};`
        var saveRecipeQuery = `EXEC sp_SaveParams ${loggedInUserID}, 'Recipe', '${saveRecipeNameParams}${saveRecipeTypeParams}'`

        // Execute the query to receive the new SetID for this recipe
        var newRecipeSetID = 0
        FetchQueries.executeQueryInDatabase(saveRecipeQuery).then(result => {
            newRecipeSetID = result[0][0]['ParamValue']

        }).then(r => {
            // Get the new SetID for the recipe
                // For every step in the recipeData,
                recipeData.forEach(step => {
                    // Save the steps with the new Recipe SetID
                    var stepTypeParamID = step['Name']['HeirarchyTypeParamID'] // Doesn't have to be the Name property here. Any would work since they all share this property
                    var stepTypeParamValue = step['Name']['HeirarchyType']

                    var stepNumberParamID = step['Name']['StepNumberParamID']
                    var stepNumberParamValue = step['Name']['StepNumber']

                    var stepNameParamID = step['Name']['ParamID']
                    var stepNameParamValue = step['Name']['ParamValue']

                    // TODO BOTH IMAGES WILL NEED TO BE MODIFIED TO HANDLE SAVING THE ACTUAL IMAGE INSTEAD OF THE PLACEHOLDER
                    var stepImage1ParamID = step['Image1']['ParamID']
                    var stepImage1ParamValue = step['Image1']['ParamValue']

                    var stepImage2ParamID = step['Image2']['ParamID']
                    var stepImage2ParamValue = step['Image2']['ParamValue']

                    var stepInstructionsParamID = step['Instructions']['ParamID']
                    var stepInstructionsParamValue = step['Instructions']['ParamValue']

                    var queryString = `EXEC sp_SaveParams ${loggedInUserID}, 'Recipe', '15001;${newRecipeSetID};${stepTypeParamID};${stepTypeParamValue};${stepNumberParamID};${stepNumberParamValue};${stepNameParamID};${stepNameParamValue};${stepImage1ParamID};${stepImage1ParamValue};${stepImage2ParamID};${stepImage2ParamValue};${stepInstructionsParamID};${stepInstructionsParamValue};'`
                    FetchQueries.executeQueryInDatabase(queryString).then(result => {
                        // Get the new SetID for the step
                        var newStepID = result[0][0]['ParamValue']
                        //For every sub step in the step, save the
                        var listOfSubStepSaveQueries = ""
                        step['SubSteps'].forEach(subStep => {

                            var subStepTypeParamID = subStep['Name']['HeirarchyTypeParamID']
                            var subStepTypeParamValue = subStep['Name']['HeirarchyType'];

                            var subStepNumberParamID = subStep['Name']['SubStepNumberParamID'];
                            var subStepNumberParamValue = subStep['Name']['SubStepNumber'];

                            var subStepNameParamID = subStep['Name']['ParamID'];
                            var subStepNameParamValue = subStep['Name']['ParamValue'];

                            var subStepActionParamID = subStep['Action']['ParamID'];
                            var subStepActionParamValue = subStep['Action']['ParamValue'];

                            var subStepItemParamID = subStep['Item']['ParamID'];
                            var subStepItemParamValue = subStep['Item']['ParamValue'];


                            var queryString = `EXEC sp_SaveParams ${loggedInUserID}, 'Recipe', '15001;${newStepID};${subStepTypeParamID};${subStepTypeParamValue};${subStepNumberParamID};${subStepNumberParamValue};${subStepNameParamID};${subStepNameParamValue};${subStepActionParamID};${subStepActionParamValue};${subStepItemParamID};${subStepItemParamValue};';`
                            listOfSubStepSaveQueries += queryString
                        })
                        // Execute all the sub step queries together since there is no reason to do them separately. Data doesn't need to be returned from them
                        if(listOfSubStepSaveQueries.length!==0){
                            FetchQueries.executeQueryInDatabase(listOfSubStepSaveQueries)
                                .then(r => {
                                    // The recipe set ID can only be updated here. otherwise the page will not refresh with the correct information
                                    setSelectedRecipeSetID(newRecipeSetID)
                                })
                                .catch(e => {
                                    console.log(e)
                                    setDisplayErrorPage(true)
                                })
                        }

                    }).catch(e => {
                        console.log(e)
                        setDisplayErrorPage(true)
                    })
                })
        }).then(r => {
        })
            .catch(e => {
                console.log(e)
                setDisplayErrorPage(true)
            })
    }

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
                    setDisplayErrorPage={setDisplayErrorPage}
                    saveRecipe={saveRecipe}
                    preDefinedSelectedStepIndex={preDefinedSelectedStepIndex}
                    pageIsReadOnly={pageIsReadOnly}
                />
            </div>
    }

    return pageToReturn
}

export default RecipeStepsPage