import React, {useState} from "react";
import "./RecipeTable.css"
import CreateRecipeComponent from "./CreateRecipeComponent/CreateRecipeComponent";
import RecipeSearchComponent from "./RecipeSearchComponent/RecipeSearchComponent";
import RecipeListTable from "./RecipeListTable/RecipeListTable";

function RecipeTable(props){
    const [searchKeyWord, setSearchKeyWord] = useState("")

    return (
        <div id={"RecipesTableContainer"}>
            <div id={"RecipesTableTitleDiv"}>
                <center>
                    <label>Recipes</label>
                </center>

            </div>
            <CreateRecipeComponent refreshListOfRecipes={props.refreshListOfRecipes}/>
            <RecipeSearchComponent searchKeyWord={searchKeyWord} setSearchkeyWord={setSearchKeyWord}/>
            <RecipeListTable listOfRecipes={props.listOfRecipes} searchKeyWord={searchKeyWord}/>
        </div>
    )
}

export default RecipeTable