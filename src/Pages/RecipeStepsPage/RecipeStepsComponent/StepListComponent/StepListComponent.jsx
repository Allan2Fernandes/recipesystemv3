import "./StepListComponent.css"
import SingleStepRowComponent from "./SingleStepRowComponent/SingleStepRowComponent";
import recipeTable from "../../../ListOfRecipesPage/RecipeTable/RecipeTable";

function StepListComponent(props){

    function revealSubStepsOnStepIndex(stepIndex){
        var newRecipeData = structuredClone(props.recipeData)
        newRecipeData[stepIndex]['RevealSubSteps'] = !props.recipeData[stepIndex]['RevealSubSteps']
        props.setRecipeData(newRecipeData)
    }


    return (
        <div id={"StepListComponentMainDiv"}>
            <div id={"RecipeTableTitleDiv"}>
                <center>
                    <label>{props.selectedRecipeName===""?"Recipe Steps":props.selectedRecipeName}</label>
                </center>
            </div>
            <div id={"StepListTableDiv"}>
                <table>
                    <thead>
                    <tr id={"StepListTableTitleRow"}>
                        <th>Step Name</th>
                        <th>Sub Step Name</th>
                        <th>Action</th>
                        <th>Item</th>
                        <th>Order</th>
                        <th>Create / Delete</th>
                    </tr>
                    </thead>
                    <tbody id={"StepListTableBody"}>
                    {
                        props.recipeData.map((step, stepIndex) => (
                            <SingleStepRowComponent
                                key={stepIndex}
                                step={step}
                                isEvenStepRow={stepIndex%2===0}
                                revealSubStepsOnStepIndex={revealSubStepsOnStepIndex}
                                stepIndex={stepIndex}
                            />
                        ))
                    }
                    <tr>

                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default StepListComponent