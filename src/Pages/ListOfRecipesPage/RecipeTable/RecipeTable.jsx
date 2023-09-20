import React, {useState} from "react";
import "./RecipeTable.css"
import CreateRecipeComponent from "./CreateRecipeComponent/CreateRecipeComponent";
import RecipeSearchComponent from "./RecipeSearchComponent/RecipeSearchComponent";
import RecipeListTable from "./RecipeListTable/RecipeListTable";

function RecipeTable(props){
    const [searchKeyWord, setSearchKeyWord] = useState("")

    /*
    * This component is made up of 3 parts - the search component, create new recipe component and a table to display recipes.
    * */

    return (
        <div id={"RecipesTableContainer"}>
            <div id={"RecipesTableTitleDiv"}>
                <center>
                    <label>Recipes</label>
                </center>

            </div>
            <CreateRecipeComponent refreshListOfRecipes={props.refreshListOfRecipes} listOfRecipes={props.listOfRecipes}/>
            <RecipeSearchComponent
                searchKeyWord={searchKeyWord}
                setSearchkeyWord={setSearchKeyWord}
                showDisabledRecipes={props.showDisabledRecipes}
                handleChangeShowDisabledRecipes={props.handleChangeShowDisabledRecipes}
            />
            <RecipeListTable
                listOfRecipes={props.listOfRecipes}
                searchKeyWord={searchKeyWord}
                refreshListOfRecipes={props.refreshListOfRecipes}
                showDisabledRecipes={props.showDisabledRecipes}
            />
        </div>
    )
}

export default RecipeTable