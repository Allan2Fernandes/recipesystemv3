import "./ReOrderStepsComponent.css"
import {Directions, Permissions} from "../../../../../../Constants";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowDown, faArrowUp} from "@fortawesome/free-solid-svg-icons";
import React, {useEffect} from "react";
import HelperFunctions from "../../../../../../HelperFunctions/HelperFunctions";

function ReOrderStepsComponent(props){

    useEffect(() => {
    }, [])

    function handleClickStepOrderChangeButtons(direction){
        if(direction === Directions.Up){
            // Return if stepIndex is 0
            if(props.stepIndex === 0){
                console.log("No Step above it")
            }else{
                // Get the step above it
                var aboveStep = props.recipeData[props.stepIndex-1]
                // Get the current step
                var belowStep = props.recipeData[props.stepIndex]
                // Swap places
                var newRecipData = structuredClone(props.recipeData)
                newRecipData[props.stepIndex-1] = belowStep
                newRecipData[props.stepIndex] = aboveStep
                props.setRecipeData(newRecipData)
            }
        }else if(direction === Directions.Down){
            // Return if stepIndex is at length
            if(props.stepIndex === props.recipeData.length-1){
                console.log("No Step below it")
            }else{
                // Get the step above it
                var aboveStep = props.recipeData[props.stepIndex]
                // Get the current step
                var belowStep = props.recipeData[props.stepIndex+1]
                // Swap places
                var newRecipData = structuredClone(props.recipeData)
                newRecipData[props.stepIndex] = belowStep
                newRecipData[props.stepIndex+1] = aboveStep
                props.setRecipeData(newRecipData)
            }
        }
    }

    return (
        <td>
            <div>
                <button id={"StepMoveUpButton"}
                        onClick={(event) => handleClickStepOrderChangeButtons(Directions.Up)}
                        disabled={!Permissions.editRecipeSteps[HelperFunctions.getAccessLevelFromLocalStorage()]}
                >
                    <FontAwesomeIcon icon={faArrowUp} />
                </button>
                <button id={"StepMoveDownButton"}
                        onClick={(event) => handleClickStepOrderChangeButtons(Directions.Down)}
                        disabled={!Permissions.editRecipeSteps[HelperFunctions.getAccessLevelFromLocalStorage()]}
                >
                    <FontAwesomeIcon icon={faArrowDown} />
                </button>
            </div>
        </td>
    )
}

export default ReOrderStepsComponent