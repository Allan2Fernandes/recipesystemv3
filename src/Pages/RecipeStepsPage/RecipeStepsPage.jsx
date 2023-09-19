import "./RecipeStepsPage.css"
import React, {useEffect, useState} from "react";
import {useLocation} from "react-router-dom";
import ErrorPage from "../../ErrorHandling/ErrorPage";
import TopBar from "../../SharedComponents/TopBar/TopBar";
import RecipeStepsComponent from "./RecipeStepsComponent/RecipeStepsComponent";
import secureLocalStorage from "react-secure-storage";
import FetchQueries from "../../FetchHandler/FetchQueries";
import {ParamIDs} from "../../Constants";
import HelperFunctions from "../../HelperFunctions/HelperFunctions";

function RecipeStepsPage(){
    const [displayErrorPage, setDisplayErrorPage] = useState(false)
    const [selectedRecipeSetID, setSelectedRecipeSetID] = useState(0)
    const [selectedRecipeName, setSelectedRecipeName] = useState("")
    const [preDefinedSelectedStepIndex, setPreDefinedSelectedStepIndex] = useState(-1)
    //const [pageIsReadOnly, setPageIsReadOnly] = useState(false)
    const location = useLocation()


    useEffect(() => {
        try{
            setSelectedRecipeSetID(location.state.recipeSetID)
            setSelectedRecipeName(location.state.recipeName)
            setPreDefinedSelectedStepIndex(parseInt(location.state.UrlSelectedStepIndex))
            //setPageIsReadOnly(readOnly === "true")
            if((secureLocalStorage.getItem("UserDetails") === null || secureLocalStorage.getItem("UserDetails") === undefined)){
                // DISABLED THIS FUNCTIONALITY BECAUSE THE MACHINE WILL NOT BE LOGGED IN
                setDisplayErrorPage(true)
            }
        }catch(error){
            setDisplayErrorPage(true)
        }
    }, [location.state])

    function saveRecipe(recipeData){
        // Get the user's details because it has to be saved under the logged in user's ID
        var loggedInUserID = secureLocalStorage.getItem("UserDetails")['SetID']

        // Save the recipe
        // Queries to save SAME recipe name (important because of the aggregate function in sql query) and dataset type (recipe, step or substep)
        var recipeNameParamID = ParamIDs.RecipeName
        var recipeTypeParamID = ParamIDs.CommonHierarchyType
        var recipeTypeParamValue = ParamIDs.CommonHierarchyTypeRecipeValue
        var recipeStatusParamID = ParamIDs.RecipeActiveStatus
        var recipeStatusParamValue = ParamIDs.RecipeEnabledParamValue
        //var saveRecipeQuery = `EXEC sp_SaveParams ${loggedInUserID}, 'Recipe', '${saveRecipeNameParams}${saveRecipeTypeParams}'`
        var saveRecipeQuery = HelperFunctions.generateSaveRecipeQuery(loggedInUserID, recipeNameParamID, selectedRecipeName, recipeTypeParamID, recipeTypeParamValue, recipeStatusParamID, recipeStatusParamValue)
        // Execute the query to receive the new SetID for this recipe
        var newRecipeSetID = 0
        FetchQueries.executeQueryInDatabase(saveRecipeQuery).then(result => {
            newRecipeSetID = result[0][0]['ParamValue']
            // DO NOT SET SELECTED RECIPE ID HERE. It will pull data from the database before the data is ready.
            //setSelectedRecipeSetID(newRecipeSetID)
        }).then(r => {
            // Get the new SetID for the recipe
            // For every step in the recipeData,
            //console.log(recipeData.length)
            recipeData.forEach((step, newStepIndex) => {

                // Save the steps with the new Recipe SetID
                var stepTypeParamID = step['Name']['HeirarchyTypeParamID'] // Doesn't have to be the Name property here. Any would work since they all share this property
                var stepTypeParamValue = step['Name']['HeirarchyType']

                var stepNumberParamID = step['Name']['StepNumberParamID']
                var stepNumberParamValue = newStepIndex + 1 //step['Name']['StepNumber']

                var stepNameParamID = step['Name']['ParamID']
                var stepNameParamValue = step['Name']['ParamValue']

                var stepImage1ParamID = step['Image1']['ParamID']
                var stepImage1ParamValue = step['Image1']['ParamValue']

                var stepImage2ParamID = step['Image2']['ParamID']
                var stepImage2ParamValue = step['Image2']['ParamValue']

                var stepInstructionsParamID = step['Instructions']['ParamID']
                var instructionsProcessed = step['Instructions']['ParamValue'].replace(/[';]/g, '');
                var queryString = `EXEC sp_SaveParams ${loggedInUserID}, 'Recipe', '${ParamIDs.KeyToParentRecipeStep};${newRecipeSetID};${stepTypeParamID};${stepTypeParamValue};${stepNumberParamID};${stepNumberParamValue};${stepNameParamID};${stepNameParamValue};${stepImage1ParamID};${stepImage1ParamValue};${stepImage2ParamID};${stepImage2ParamValue};${stepInstructionsParamID};${instructionsProcessed};'`

                FetchQueries.executeQueryInDatabase(queryString).then(result => {
                    // Get the new SetID for the step
                    var newStepID = result[0][0]['ParamValue']
                    //For every sub step in the step, save the
                    var listOfSubStepSaveQueries = ""

                    step['SubSteps'].forEach((subStep, newSubStepIndex) => {
                        var subStepTypeParamID = subStep['Name']['HeirarchyTypeParamID']
                        var subStepTypeParamValue = subStep['Name']['HeirarchyType'];

                        var subStepNumberParamID = subStep['Name']['SubStepNumberParamID'];
                        var subStepNumberParamValue = newSubStepIndex + 1 //subStep['Name']['SubStepNumber'];

                        var subStepNameParamID = subStep['Name']['ParamID'];
                        var subStepNameParamValue = subStep['Name']['ParamValue'];

                        var subStepActionParamID = subStep['Action']['ParamID'];
                        var subStepActionParamValue = subStep['Action']['ParamValue'];

                        var subStepItemParamID = subStep['Item']['ParamID'];
                        var subStepItemParamValue = subStep['Item']['ParamValue'];


                        var queryString = `EXEC sp_SaveParams ${loggedInUserID}, 'Recipe', '${ParamIDs.KeyToParentRecipeStep};${newStepID};${subStepTypeParamID};${subStepTypeParamValue};${subStepNumberParamID};${subStepNumberParamValue};${subStepNameParamID};${subStepNameParamValue};${subStepActionParamID};${subStepActionParamValue};${subStepItemParamID};${subStepItemParamValue};';`
                        listOfSubStepSaveQueries += queryString
                    })
                    // Execute all the sub step queries together since there is no reason to do them separately. Data doesn't need to be returned from them
                    if(listOfSubStepSaveQueries.length!==0){
                        FetchQueries.executeQueryInDatabase(listOfSubStepSaveQueries)
                            .then(r => {
                                //console.log("Saved all sub steps")
                                // Do not navigate from out here. It is inside a foreach loop. Shouldn't navigate before everything is saved to DB

                            })
                            .catch(e => {
                                console.log(e)
                                setDisplayErrorPage(true)
                            })
                    }

                })
                    .catch(e => {
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
        pageToReturn = <ErrorPage parentPageIsLogin={false} setDisplayErrorPage={setDisplayErrorPage}/>
    }else{
        pageToReturn =
            <div id={"RecipeStepsPageMainDiv"}>
                {
                    //!pageIsReadOnly &&
                    <TopBar IsLoggedIn={true} ParentPage={"RecipeStepsPage"}/>
                }
                <RecipeStepsComponent
                    selectedRecipeSetID={selectedRecipeSetID}
                    selectedRecipeName={selectedRecipeName}
                    setDisplayErrorPage={setDisplayErrorPage}
                    saveRecipe={saveRecipe}
                    preDefinedSelectedStepIndex={preDefinedSelectedStepIndex}
                    //pageIsReadOnly={pageIsReadOnly}
                />
            </div>
    }

    return pageToReturn
}

export default RecipeStepsPage