import "./RecipeStepsComponent.css"
import {useEffect, useState} from "react";
import FetchQueries from "../../../FetchHandler/FetchQueries";
import HelperFunctions from "../../../HelperFunctions/HelperFunctions"
import StepListComponent from "./StepListComponent/StepListComponent";


function RecipeStepsComponent(props){
    const [recipeData, setRecipeData] = useState([])

    useEffect(() => {
        // Fetch the recipes
        fetchRecipeData()
    }, [props.selectedRecipeSetID])

    async function fetchRecipeData(){
        await FetchQueries.getStepsAndSubStepsOfRecipe(props.selectedRecipeSetID).then(result => {
            // Process the data into a usable format
            var processedData = HelperFunctions.ProcessFetchedData(result)
            setRecipeData(processedData)
        }).catch(e => console.log(e))
    }

    return (
        <div id={"RecipeStepsComponentMainDiv"}>
            <StepListComponent selectedRecipeName={props.selectedRecipeName} recipeData={recipeData} setRecipeData={setRecipeData}/>
        </div>
    )
}

export default RecipeStepsComponent