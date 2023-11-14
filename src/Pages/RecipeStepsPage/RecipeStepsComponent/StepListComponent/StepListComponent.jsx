import "./StepListComponent.css"
import SingleStepRowComponent from "./SingleStepRowComponent/SingleStepRowComponent";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faHistory, faSave} from "@fortawesome/free-solid-svg-icons";
import {Directions, ParamIDs, Permissions} from "../../../../Constants";
import {blank_image} from "../../../../Constants";
import HelperFunctions from "../../../../HelperFunctions/HelperFunctions";

function StepListComponent(props){


    function revealSubStepsOnStepIndex(stepIndex){
        var newRecipeData = structuredClone(props.recipeData)
        newRecipeData[stepIndex]['RevealSubSteps'] = !props.recipeData[stepIndex]['RevealSubSteps']
        props.setRecipeData(newRecipeData)
    }

    function clickHandlerCreateStep(){
        var newRecipeData = structuredClone(props.recipeData)
        var newStepNumber = 1
        var maxExistingStepNumber = 0
        newRecipeData.forEach(step => {
            if(step['Name']['StepNumber'] > maxExistingStepNumber){
                maxExistingStepNumber = step['Name']['StepNumber']
            }
        })
        newStepNumber += maxExistingStepNumber


        const commonHeirarchyType = ParamIDs.CommonHierarchyTypeStepValue
        const commonHeirarchyTypeParamID = ParamIDs.CommonHierarchyType
        const commonRecipeSetID = props.selectedRecipeSetID
        const commonStepNumberParamID = ParamIDs.StepNumber
        const commonPlaceHolderStepSetID = -1
        var newStep = {
            Name:{
                HeirarchyType: commonHeirarchyType,
                HeirarchyTypeParamID: commonHeirarchyTypeParamID,
                ParamID: ParamIDs.StepSubStepName,
                ParamValue: "",
                RecipeSetID: commonRecipeSetID,
                StepNumber: newStepNumber,
                StepNumberParamID: commonStepNumberParamID,
                StepSetID: commonPlaceHolderStepSetID
            },
            Image1:{
                HeirarchyType: commonHeirarchyType,
                HeirarchyTypeParamID: commonHeirarchyTypeParamID,
                ParamID: ParamIDs.StepImage1,
                ParamValue: "blank_white_image.png", //blank_image,
                RecipeSetID: commonRecipeSetID,
                StepNumber: newStepNumber,
                StepNumberParamID:commonStepNumberParamID,
                StepSetID: commonPlaceHolderStepSetID
            },
            Image2:{
                HeirarchyType: commonHeirarchyType,
                HeirarchyTypeParamID: commonHeirarchyTypeParamID,
                ParamID: ParamIDs.StepImage2,
                ParamValue: "blank_white_image.png", //blank_image,
                RecipeSetID: commonRecipeSetID,
                StepNumber: newStepNumber,
                StepNumberParamID:commonStepNumberParamID,
                StepSetID: commonPlaceHolderStepSetID
            },
            Instructions:{
                HeirarchyType: commonHeirarchyType,
                HeirarchyTypeParamID: commonHeirarchyTypeParamID,
                ParamID: ParamIDs.StepInstructions,
                ParamValue: "Insert Instructions",
                RecipeSetID: commonRecipeSetID,
                StepNumber: newStepNumber,
                SubStepNumberParamID:commonStepNumberParamID,
                StepSetID: commonPlaceHolderStepSetID
            },
            RevealSubSteps: false,
            SubSteps: []
        }
        // push to the top of the list when a step isn't selected. 
        // If a step is selected, put it in the list at that index and push the rest of thems down 1 index.
        console.log(props.selectedStepIndex)
        if(props.selectedStepIndex === -1){
            newRecipeData.push(newStep)
        }else{
            newRecipeData.splice(props.selectedStepIndex+1, 0, newStep)
        }
  
        props.setRecipeData(newRecipeData)
    }


    return (
        <div id={"StepListComponentMainDiv"}>
            <div id={"RecipeTableTitleDiv"}>
                <label>
                    {props.selectedRecipeName}
                </label>
                <button id={"DisplayHistoryPopUpButton"} onClick={(event) => props.toggleRecipeHistoryPopUp(Directions.Open)}>
                    <FontAwesomeIcon icon={faHistory}/>
                </button>
            </div>
            <div id={"StepListTableDiv"}>
                <table>
                    <thead>
                    <tr id={"StepListTableTitleRow"}>
                        <th>Step Name</th>
                        <th>Sub Step Name</th>
                        <th>Action</th>
                        <th>Item</th>
                        {
                            <th>Order</th>
                        }
                        {
                            <th>Create / Delete</th>
                        }

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
                                itemsAndTheirActions={props.itemsAndTheirActions}
                                changeHandlerSubStepName={props.changeHandlerSubStepName}
                                changeHandlerSubStepItem={props.changeHandlerSubStepItem}
                                reorderSubSteps={props.reorderSubSteps}
                                setDisplayErrorPage={props.setDisplayErrorPage}
                                addSubStepToStep={props.addSubStepToStep}
                                selectedRecipeSetID={props.selectedRecipeSetID}
                                recipeData={props.recipeData}
                                setRecipeData={props.setRecipeData}
                                selectStep={props.selectStep}
                                IsSelectedStepIndex={props.selectedStepIndex===stepIndex}
                                //pageIsReadOnly={props.pageIsReadOnly}
                            />
                        ))
                    }
                    <tr>
                    {/*
                        A row with buttons to save the recipe
                    */}
                        {
                            <td id={"CreateStepSaveTableButtonsRow"} colSpan={6} style={{textAlign: "center"}} className={props.recipeData.length%2===0?"IsEvenStepRow":"IsOddStepRow"}>
                                <button
                                    onClick={clickHandlerCreateStep}
                                    disabled={!Permissions.editRecipeSteps[HelperFunctions.getAccessLevelFromLocalStorage()]}
                                >
                                    Create step
                                </button>
                                <button
                                    onClick={(event) => props.saveRecipe(props.recipeData)}
                                    disabled={!Permissions.editRecipeSteps[HelperFunctions.getAccessLevelFromLocalStorage()]}
                                >
                                    <FontAwesomeIcon icon={faSave}/>
                                    <label id={"SaveRecipeLabel"}>Save Recipe</label>
                                </button>
                            </td>
                        }
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default StepListComponent