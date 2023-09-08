import React from "react";
import "./OrderChangeButtonsComponent.css"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowDown, faArrowUp} from "@fortawesome/free-solid-svg-icons";
import {Directions, Permissions} from "../../../../../../../Constants";
import HelperFunctions from "../../../../../../../HelperFunctions/HelperFunctions";

function OrderChangeButtonsComponent(props){
    return (
        <div>
            <button id={"MoveUpButton"}
                    onClick={(event) => props.reorderSubSteps(event, props.stepIndex, props.subStepIndex, Directions.Up)}
                    disabled={!Permissions.editRecipeSteps[HelperFunctions.getAccessLevelFromLocalStorage()]}
            >
                <FontAwesomeIcon icon={faArrowUp} />
            </button>
            <button id={"MoveDownButton"}
                    onClick={(event) => props.reorderSubSteps(event, props.stepIndex, props.subStepIndex, Directions.Down)}
                    disabled={!Permissions.editRecipeSteps[HelperFunctions.getAccessLevelFromLocalStorage()]}
            >
                <FontAwesomeIcon icon={faArrowDown} />
            </button>
        </div>
    )
}

export default OrderChangeButtonsComponent