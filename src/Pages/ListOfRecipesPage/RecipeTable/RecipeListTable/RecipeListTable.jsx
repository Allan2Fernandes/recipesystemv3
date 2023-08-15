import "./RecipeListTable.css"
import {useNavigate} from "react-router-dom";

function RecipeListTable(props){
    const navigate = useNavigate()

    function navigateToRecipeStepsPage(event, recipeSetID, recipeName){
        navigate("/RecipeStepsPage", {
            state: {
                recipeSetID: recipeSetID,
                recipeName: recipeName
            }
        })
    }


    return (
        <div id={"RecipeListTableMainDiv"}>
            <table id={"RecipeListMainTable"}>
                <thead>
                <tr id={"RecipeListMainTableHeadersRow"}>
                    <th>Recipe SetID</th>
                    <th>Recipe Name</th>
                    <th>Creation Time</th>
                </tr>
                </thead>
                <tbody>
                {
                    props.listOfRecipes.filter(row => row['RecipeName'].includes(props.searchKeyWord)).map((recipe, index) => (
                        <tr key={index} id={"RecipeListMainTableRow"} className={index%2===0?"EvenRecipeListTableRow":"OddRecipeListTableRow"}>
                            <td>
                                <label>{recipe['SetID']}</label>
                            </td>
                            {/* Move this out and into helper functions */}
                            <td id={"RecipeNameDataCell"}>
                                <label onClick={(event) => navigateToRecipeStepsPage(event, recipe['SetID'], recipe['RecipeName'])}>{recipe['RecipeName']}</label>
                            </td>
                            <td>{recipe['CreationTime']}</td>
                        </tr>
                    ))
                }
                </tbody>
            </table>
        </div>
    )
}

export default RecipeListTable