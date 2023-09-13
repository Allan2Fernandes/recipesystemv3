import "./RecipeHistoryPopUp.css"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faClose} from "@fortawesome/free-solid-svg-icons";
import {Directions, Permissions} from "../../../../Constants";
import React, {useEffect, useState} from "react";
import HelperFunctions from "../../../../HelperFunctions/HelperFunctions";
import {useNavigate} from "react-router-dom";
import FetchQueries from "../../../../FetchHandler/FetchQueries";


function RecipeHistoryPopUp(props){
    const navigate = useNavigate()
    const [recipeHistoryData, setRecipeHistoryData] = useState([])

    useState(() => {
        fetchRecipeHistoryData()
    }, [])

    async function fetchRecipeHistoryData(){
        var query = `EXECUTE [dbo].[sp_GetRecipeHistory] @RecipeName = '${props.selectedRecipeName}'`
        var fetchedRecipeHistoryData = await FetchQueries.executeQueryInDatabase(query).catch(e => props.setDisplayErrorPage(true))
        setRecipeHistoryData(fetchedRecipeHistoryData[0])
    }


    function handleClickOverlay(event){
        if(event.target.id === "RecipeHistoryPopUpOverlay"){
            // Ensure that the click on popup doesn't close it.
            props.toggleRecipeHistoryPopUp(Directions.Close)
        }
    }

    function navigateToRecipeStepsPage(event, recipeSetID, recipeName, readOnly){
        if(!Permissions.viewRecipeStepsPage[HelperFunctions.getAccessLevelFromLocalStorage()]){
            console.log("Doesn't have permission to view recipe steps")
            return
        }
        props.toggleRecipeHistoryPopUp(Directions.Close)
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

    return (
        <div id={"RecipeHistoryPopUpOverlay"} onClick={(event) => handleClickOverlay(event)}>
            <div id={"RecipeHistoryPopUpMainDiv"}>
                <div id={"RecipeHistoryPopUpToBar"}>
                    <label id={"RecipeHistoryTopBarLabel"}>Recipe History</label>
                    <button id={"RecipeHistoryPopUpCloseButton"} onClick={(event) => props.toggleRecipeHistoryPopUp(Directions.Close)}>
                        <FontAwesomeIcon icon={faClose}/>
                    </button>
                </div>
                <div id={"RecipeHistoryPopUpBody"}>
                    <table id={"RecipeHistoryDataTable"}>
                        <thead>
                        <tr>
                            <td>SetID</td>
                            <td>Modified By</td>
                            <td>Modified Date</td>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            recipeHistoryData.map((recipeHistory, recipeHistoryIndex) => (
                                <tr key={recipeHistoryIndex}>
                                    <td>
                                        <button
                                            id={"NavigateToRecipeSetIDButton"}
                                            onClick={(event) => navigateToRecipeStepsPage(event, recipeHistory['SetID'], recipeHistory['RecipeName'], false)}>
                                            {recipeHistory['SetID']}
                                        </button>
                                    </td>
                                    <td>{recipeHistory['ModifiedByUser']}</td>
                                    <td>{HelperFunctions.formatDateTimeFromDataBase(recipeHistory['LastModifiedDate'])}</td>
                                </tr>
                            ))
                        }
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default RecipeHistoryPopUp