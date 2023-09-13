import "./RecipeListTable.css"
import {useNavigate} from "react-router-dom";
import HelperFunctions from "../../../../HelperFunctions/HelperFunctions";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faClone} from "@fortawesome/free-solid-svg-icons";
import secureLocalStorage from "react-secure-storage";
import {ParamIDs} from "../../../../Constants";
import FetchQueries from "../../../../FetchHandler/FetchQueries";
import {useState} from "react";
import ErrorPage from "../../../../ErrorHandling/ErrorPage";
import DuplicateRecipeDialogBox from "./DuplicateRecipeDialogBox/DuplicateRecipeDialogBox";
import {Permissions} from "../../../../Constants";

function RecipeListTable(props){
    const navigate = useNavigate()
    const [displayErrorPage, setDisplayErrorPage] = useState(false)
    const [displayDuplicateRecipeDialog, setDisplayDuplicateRecipeDialog] = useState(false)
    const [selectedRecipeSetID, setSelectedRecipeSetID] = useState(-1)
    const [selectedRecipeActiveStatus, setSelectedRecipeActiveStatus] = useState(true)

    function navigateToRecipeStepsPage(event, recipeSetID, recipeName, readOnly){
        if(!Permissions.viewRecipeStepsPage[HelperFunctions.getAccessLevelFromLocalStorage()]){
            console.log("Doesn't have permission to view recipe steps")
            return
        }
        // Navigate to the page in not-readonly.
        //navigate(`/RecipeStepsPage/RecipeSetID/${recipeSetID}/RecipeName/${recipeName}/UrlSelectedStepIndex/-1/ReadOnly/${readOnly}`)
        navigate("/RecipeStepsPage", {
            state: {
                recipeSetID: recipeSetID,
                recipeName: recipeName,
                readOnly: readOnly,
                UrlSelectedStepIndex:-1
            }
        })
    }

    async function saveDuplicatedRecipe(duplicatedRecipeName, selectedRecipeSetID, flipEnabledStatus, currentStatus){
        var recipeData
        // The first step is to get the recipe data from the database for the selected recipe
        await FetchQueries.getStepsAndSubStepsOfRecipe(selectedRecipeSetID).then(result => {
            // Process the data into a usable format
            recipeData = HelperFunctions.ProcessFetchedRecipeData(result)
        }).catch(e => props.setDisplayErrorPage(true))

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
        var saveRecipeQuery = HelperFunctions.generateSaveRecipeQuery(loggedInUserID, recipeNameParamID, duplicatedRecipeName, recipeTypeParamID, recipeTypeParamValue, recipeStatusParamID, flipEnabledStatus?!currentStatus:currentStatus)

        // Execute the query to receive the new SetID for this recipe
        var newRecipeSetID = 0
        FetchQueries.executeQueryInDatabase(saveRecipeQuery).then(result => {
            newRecipeSetID = result[0][0]['ParamValue']

        }).then(r => {
            // Get the new SetID for the recipe
            // For every step in the recipeData,
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
                var stepInstructionsParamValue = step['Instructions']['ParamValue']

                var queryString = `EXEC sp_SaveParams ${loggedInUserID}, 'Recipe', '${ParamIDs.KeyToParentRecipeStep};${newRecipeSetID};${stepTypeParamID};${stepTypeParamValue};${stepNumberParamID};${stepNumberParamValue};${stepNameParamID};${stepNameParamValue};${stepImage1ParamID};${stepImage1ParamValue};${stepImage2ParamID};${stepImage2ParamValue};${stepInstructionsParamID};${stepInstructionsParamValue};'`
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
                                // The recipe set ID can only be updated here. otherwise the page will not refresh with the correct information
                                //setSelectedRecipeSetID(newRecipeSetID)

                                // Instead of selecting a new RecipeSetID, why not navigate to that new recipe setIDs page

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
            // Refresh the list of recipes
            props.refreshListOfRecipes()
        })
            .catch(e => {
                console.log(e)
                setDisplayErrorPage(true)
            })
    }

    function handleClickDuplicateRecipe(recipeSetID, recipeStatus){
        setDisplayDuplicateRecipeDialog(true)
        setSelectedRecipeSetID(recipeSetID)
        setSelectedRecipeActiveStatus(recipeStatus)
    }



    if(displayErrorPage){
        return <ErrorPage/>
    }else{
        return (
            <div id={"RecipeListTableMainDiv"}>
                <table id={"RecipeListMainTable"}>
                    <thead>
                    <tr id={"RecipeListMainTableHeadersRow"}>
                        <th>Recipe SetID</th>
                        <th>Recipe Name</th>
                        <th>Last Modified</th>
                        <th>Enabled</th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        props.listOfRecipes.filter(row => row['RecipeName'].includes(props.searchKeyWord) && (!props.showDisabledRecipes?row['Status']:true)).map((recipe, index) => (
                            <tr key={index} id={"RecipeListMainTableRow"} className={index%2===0?"EvenRecipeListTableRow":"OddRecipeListTableRow"}>
                                <td>
                                    <label>{recipe['SetID']}</label>
                                </td>
                                {/* Move this out and into helper functions */}
                                <td id={"RecipeNameDataCell"}>
                                    <button onClick={(event) => handleClickDuplicateRecipe(recipe['SetID'], recipe['Status'])} disabled={!Permissions.duplicateRecipe[HelperFunctions.getAccessLevelFromLocalStorage()]}>
                                        <FontAwesomeIcon icon={faClone}/>
                                    </button>
                                    <label onClick={(event) => navigateToRecipeStepsPage(event, recipe['SetID'], recipe['RecipeName'], false)}>{recipe['RecipeName']}</label>
                                </td>
                                <td>{HelperFunctions.formatDateTimeFromDataBase(recipe['CreationTime'])}</td>
                                <td>
                                    <input type={"checkbox"} checked={recipe["Status"]} onChange={(event) => {
                                        saveDuplicatedRecipe(recipe['RecipeName'], recipe['SetID'], true, recipe['Status']).then(r => {/* Loading animation */})
                                    }}/>
                                </td>
                            </tr>
                        ))
                    }
                    </tbody>
                </table>
                {
                    displayDuplicateRecipeDialog &&
                    <DuplicateRecipeDialogBox
                        saveDuplicatedRecipe={saveDuplicatedRecipe}
                        setDisplayDuplicateRecipeDialog={setDisplayDuplicateRecipeDialog}
                        setSelectedRecipeSetID={setSelectedRecipeSetID}
                        selectedRecipeSetID={selectedRecipeSetID}
                        selectedRecipeActiveStatus={selectedRecipeActiveStatus}
                    />
                }

            </div>
        )
    }


}

export default RecipeListTable