import React, {useEffect, useState} from "react";
import "./SubStepDivComponent.css"
import OrderChangeButtonsComponent from "./OrderChangeButtonsComponent/OrderChangeButtonsComponent";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTrash} from "@fortawesome/free-solid-svg-icons";
import {Permissions} from "../../../../../../Constants";
import HelperFunctions from "../../../../../../HelperFunctions/HelperFunctions";
import FetchQueries from "../../../../../../FetchHandler/FetchQueries";

function SubStepDivComponent(props){
    const [itemIsEnabled, setItemIsEnabled] = useState(true)

    useEffect(()=> {
        // Query the database to check if the item is disabled
        getActiveStatusOfItem()
    }, [props.subStep])

    function deleteSubStep(){
        var newRecipeData = structuredClone(props.recipeData)
        // Use the step and sub step indices to remove the data from recipeData
        newRecipeData[props.stepIndex]['SubSteps'].splice(props.subStepIndex, 1)
        props.setRecipeData(newRecipeData)
    }

    async function getActiveStatusOfItem(){
        var actionName = props.subStep['Action']['ParamValue']
        var itemName = props.subStep['Item']['ParamValue']
        await FetchQueries.executeGetItemStatus(actionName, itemName)
            .then(result => {
                setItemIsEnabled(result[0][0]['ParamValue'])
            }).catch(error => console.log(error))
    }

    function filterItemsForAction(){
        // This is a poor solution. Fix it
        try{
            return props.itemsAndTheirActions.filter(row => row['Action'] === props.subStep['Action']['ParamValue'])[0]['Items']
        }catch(error){
            console.log("Error in filter items for actions")
            return []
        }

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
                            style={{width:"100px"}}
                            disabled={!Permissions.editRecipeSteps[HelperFunctions.getAccessLevelFromLocalStorage()]}
                        />
                    </td>
                    <td>
                        <select value={props.subStep['Action']['ParamValue']}
                                onChange={(event) => props.changeHandlerSubStepName(event, "Action", props.stepIndex, props.subStepIndex)}
                                disabled={!Permissions.editRecipeSteps[HelperFunctions.getAccessLevelFromLocalStorage()]}
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
                                disabled={!Permissions.editRecipeSteps[HelperFunctions.getAccessLevelFromLocalStorage()]}
                                className={itemIsEnabled?"ItemIsEnabled":"ItemIsDisabled"}
                        >
                            {/*
                            Have to show the items which correspond to that action. Get the index which corresponds to the Action and then display those items
                             */}
                            {
                                filterItemsForAction().map((item, itemIndex) => (
                                    <option key={itemIndex}>{item['ParamValue']}</option>
                                ))
                            }
                        </select>
                    </td>
                    {
                        <td>
                            <div>
                                <OrderChangeButtonsComponent
                                    reorderSubSteps={props.reorderSubSteps}
                                    stepIndex={props.stepIndex}
                                    subStepIndex={props.subStepIndex}
                                    //pageIsReadOnly={props.pageIsReadOnly}
                                />
                            </div>
                        </td>
                    }
                    {
                        <td>
                            <button
                                onClick={deleteSubStep}
                                disabled={!Permissions.editRecipeSteps[HelperFunctions.getAccessLevelFromLocalStorage()]}
                            >
                                <FontAwesomeIcon icon={faTrash}/>
                            </button>
                        </td>
                    }

                </tr>
                </tbody>
            </table>
        </div>
    )
}

export default SubStepDivComponent