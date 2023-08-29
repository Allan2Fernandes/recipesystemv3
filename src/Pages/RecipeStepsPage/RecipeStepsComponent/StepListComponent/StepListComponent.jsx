import "./StepListComponent.css"
import SingleStepRowComponent from "./SingleStepRowComponent/SingleStepRowComponent";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSave} from "@fortawesome/free-solid-svg-icons";
//import stockImage from "../../../../Images/StockCadDrawing.png"
import {useEffect, useState} from "react";
import {ParamIDs} from "../../../../Constants";
import {blank_image} from "../../../../Constants";

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
                ParamValue: "Insert Step Name",
                RecipeSetID: commonRecipeSetID,
                StepNumber: newStepNumber,
                StepNumberParamID: commonStepNumberParamID,
                StepSetID: commonPlaceHolderStepSetID
            },
            Image1:{
                HeirarchyType: commonHeirarchyType,
                HeirarchyTypeParamID: commonHeirarchyTypeParamID,
                ParamID: ParamIDs.StepImage1,
                ParamValue: blank_image,
                RecipeSetID: commonRecipeSetID,
                StepNumber: newStepNumber,
                StepNumberParamID:commonStepNumberParamID,
                StepSetID: commonPlaceHolderStepSetID
            },
            Image2:{
                HeirarchyType: commonHeirarchyType,
                HeirarchyTypeParamID: commonHeirarchyTypeParamID,
                ParamID: ParamIDs.StepImage2,
                ParamValue: blank_image,
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
        newRecipeData.push(newStep)
        props.setRecipeData(newRecipeData)
    }


    return (
        <div id={"StepListComponentMainDiv"}>
            <div id={"RecipeTableTitleDiv"}>
                <center>
                    <label>{props.selectedRecipeName}</label>
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
                        {
                            !props.pageIsReadOnly &&
                            <th>Order</th>
                        }
                        {
                            !props.pageIsReadOnly &&
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
                                reorderSubSteps={props.reorderSubSteps}
                                setDisplayErrorPage={props.setDisplayErrorPage}
                                addSubStepToStep={props.addSubStepToStep}
                                selectedRecipeSetID={props.selectedRecipeSetID}
                                recipeData={props.recipeData}
                                setRecipeData={props.setRecipeData}
                                selectStep={props.selectStep}
                                IsSelectedStepIndex={props.selectedStepIndex===stepIndex}
                                pageIsReadOnly={props.pageIsReadOnly}
                            />
                        ))
                    }
                    <tr>
                    {/*
                        A row with buttons to save the recipe
                    */}
                        {
                            !props.pageIsReadOnly &&
                            <td id={"CreateStepSaveTableButtonsRow"} colSpan={6} style={{textAlign: "center"}} className={props.recipeData.length%2===0?"IsEvenStepRow":"IsOddStepRow"}>
                                <button onClick={clickHandlerCreateStep} disabled={props.pageIsReadOnly}>
                                    Create step
                                </button>
                                <button onClick={(event) => props.saveRecipe(props.recipeData)} disabled={props.pageIsReadOnly}>
                                    <FontAwesomeIcon icon={faSave}/>
                                    <label>Save Recipe</label>
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