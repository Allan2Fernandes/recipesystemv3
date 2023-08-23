import "./ReOrderStepsComponent.css"
import {Directions} from "../../../../../../Constants";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowDown, faArrowUp} from "@fortawesome/free-solid-svg-icons";
import React, {useEffect} from "react";

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
                <button id={"MoveUpButton"}
                        onClick={(event) => handleClickStepOrderChangeButtons(Directions.Up)}
                >
                    <FontAwesomeIcon icon={faArrowUp} />
                </button>
                <button id={"MoveDownButton"}
                        onClick={(event) => handleClickStepOrderChangeButtons(Directions.Down)}
                >
                    <FontAwesomeIcon icon={faArrowDown} />
                </button>
            </div>
        </td>
    )
}

export default ReOrderStepsComponent