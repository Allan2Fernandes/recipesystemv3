import React from "react";
import "./SubStepDivComponent.css"
import OrderChangeButtonsComponent from "./OrderChangeButtonsComponent/OrderChangeButtonsComponent";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTrash, faTrashCan} from "@fortawesome/free-solid-svg-icons";

function SubStepDivComponent(props){

    function deleteSubStep(){
        var newRecipeData = structuredClone(props.recipeData)
        // Use the step and sub step indices to remove the data from recipeData
        newRecipeData[props.stepIndex]['SubSteps'].splice(props.subStepIndex, 1)
        props.setRecipeData(newRecipeData)
    }

    return (
        <div id={"SubStepDivComponentMainDiv"}>
            <table id={"SubStepTable"}>
                <tbody>
                <tr id={"SubStepTableRow"} className={props.isEvenSubStep?"IsEvenSubStepRow":"IsOddSubStepRow"}>
                    <td>
                        {/*<label>{props.subStep['Name']['RecipeValue']}</label>*/}
                        <input
                            value={props.subStep['Name']['ParamValue']}
                            onChange={(event) => props.changeHandlerSubStepName(event, "Name", props.stepIndex, props.subStepIndex)}
                            disabled={props.pageIsReadOnly}
                        />
                    </td>
                    <td>
                        <select value={props.subStep['Action']['ParamValue']}
                                onChange={(event) => props.changeHandlerSubStepName(event, "Action", props.stepIndex, props.subStepIndex)}
                                disabled={props.pageIsReadOnly}
                        >
                            {
                                props.itemsAndTheirActions.map((everyAction, actionIndex) => (
                                    <option key={actionIndex}>{everyAction['Action']}</option>
                                ))
                            }
                        </select>
                    </td>
                    <td>
                        <select value={props.subStep['Item']['ParamValue']}
                                onChange={(event) => props.changeHandlerSubStepName(event, "Item", props.stepIndex, props.subStepIndex)}
                                disabled={props.pageIsReadOnly}
                        >
                            {/*
                            Have to show the items which correspond to that action. Get the index which corresponds to the Action and then display those items
                             */}
                            {
                                props.itemsAndTheirActions.filter(row => row['Action'] === props.subStep['Action']['ParamValue'])[0]['Items'].map((item, itemIndex) => (
                                    <option key={itemIndex}>{item['ParamValue']}</option>
                                ))
                            }

                        </select>
                    </td>
                    <td>
                        <div>
                            <OrderChangeButtonsComponent
                                reorderSubSteps={props.reorderSubSteps}
                                stepIndex={props.stepIndex}
                                subStepIndex={props.subStepIndex}
                                pageIsReadOnly={props.pageIsReadOnly}
                            />
                        </div>
                    </td>
                    <td>
                        <button onClick={deleteSubStep} disabled={props.pageIsReadOnly}>
                            <FontAwesomeIcon icon={faTrash}/>
                        </button>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
    )
}

export default SubStepDivComponent