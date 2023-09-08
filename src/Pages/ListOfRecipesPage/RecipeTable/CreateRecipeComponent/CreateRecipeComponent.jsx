import "./CreateRecipeComponent.css"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faAdd} from "@fortawesome/free-solid-svg-icons";
import {useState} from "react";
import secureLocalStorage from "react-secure-storage";
import FetchQueries from "../../../../FetchHandler/FetchQueries";
import {ParamIDs, Permissions} from "../../../../Constants";
import HelperFunctions from "../../../../HelperFunctions/HelperFunctions";

function CreateRecipeComponent(props){
    const [newRecipeName, setNewRecipeName] = useState("") // The value shown in the input field

    function changeHandlerNewRecipeName(event){ // Change event handler for the input field
        setNewRecipeName(event.target.value)
    }

    async function clickHandlerCreateRecipe(){
        // Check if the recipe name is blank
        if(newRecipeName ===""){
            console.log("Invalid recipe name")
            return
        }

        // Check if a recipe with that name already exists. If it does, do not save the new recipe
        if(props.listOfRecipes.filter(recipe => recipe['RecipeName'] === newRecipeName).length > 0){
            console.log("Recipe name already exists")
            return;
        }



        // Get the constants needed for the query
        var paramIDs = [ParamIDs.RecipeName, ParamIDs.CommonHierarchyType]
        var paramValues = [newRecipeName, ParamIDs.CommonHierarchyTypeRecipeValue] // 1 is the ParamValue for Recipes
        // Get the saved user details from storage
        var userDetails = secureLocalStorage.getItem("UserDetails")
        // Extract just the setID which is the UserID in the query
        var userID = userDetails['SetID']
        // Construct the query
        var createRecipeQuery = `EXEC sp_SaveParams ${userID}, 'Recipe', '${paramIDs[0]};${paramValues[0]};${paramIDs[1]};${paramValues[1]}'`
        // Execute the query in the database
        await FetchQueries.executeQueryInDatabase(createRecipeQuery)
        // Refresh the list of recipes in the table
        await props.refreshListOfRecipes()
    }

    return (
        <div id={"CreateRecipeComponentMainDiv"}>
            <button onClick={clickHandlerCreateRecipe} disabled={!Permissions.createRecipe[HelperFunctions.getAccessLevelFromLocalStorage()]}>
                <FontAwesomeIcon icon={faAdd}/>
                Create Recipe
            </button>
            <input id={"NewRecipeNameInputField"} value={newRecipeName} onChange={(event) => changeHandlerNewRecipeName(event)}/>
        </div>
    )
}

export default CreateRecipeComponent