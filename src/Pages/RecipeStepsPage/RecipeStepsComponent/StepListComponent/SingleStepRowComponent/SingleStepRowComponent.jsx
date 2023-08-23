import "./SingleStepRowComponent.css"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronDown, faChevronUp, faX} from "@fortawesome/free-solid-svg-icons";
import SubStepDivComponent from "./SubStepDivComponent/SubStepDivComponent";
import {useEffect} from "react";


function SingleStepRowComponent(props){



    function clickHandlerRevealSubStepsButton(){
        props.revealSubStepsOnStepIndex(props.stepIndex)
    }

    function appendSubStep(){
        try{
            var maxExistingSubStepNumber = 0
            var newSubStepNumber = 1
            props.step['SubSteps'].forEach(subStep => {
                if(subStep['Name']['SubStepNumber'] > maxExistingSubStepNumber){
                    maxExistingSubStepNumber = subStep['Name']['SubStepNumber']
                }
            })
            newSubStepNumber += maxExistingSubStepNumber


            var placeHolderDetails = {
                Name:{
                    HeirarchyType: 3,
                    HeirarchyTypeParamID: 10002,
                    ParamID: 35007,
                    ParamValue: "",
                    RecipeSetID: props.selectedRecipeSetID,
                    StepSetID: props.step['Name']['StepSetID'],
                    SubStepNumber: newSubStepNumber,
                    SubStepNumberParamID: 10004,
                    SubStepSetID: -1
                },
                Action:{
                    HeirarchyType: 3,
                    HeirarchyTypeParamID: 10002,
                    ParamID: 35004,
                    ParamValue: props.itemsAndTheirActions[0]['Action'],
                    RecipeSetID: props.selectedRecipeSetID,
                    StepSetID: props.step['Name']['StepSetID'],
                    SubStepNumber: newSubStepNumber,
                    SubStepNumberParamID: 10004,
                    SubStepSetID: -1
                },
                Item:{
                    HeirarchyType: 3,
                    HeirarchyTypeParamID: 10002,
                    ParamID: 35005,
                    ParamValue: props.itemsAndTheirActions[0]['Items'][0]['ParamValue'],
                    RecipeSetID: props.selectedRecipeSetID,
                    StepSetID: props.step['Name']['StepSetID'],
                    SubStepNumber: newSubStepNumber,
                    SubStepNumberParamID: 10004,
                    SubStepSetID: -1
                }
            }
            props.addSubStepToStep(props.stepIndex, placeHolderDetails)
        }catch(error){
            console.log(error)
            props.setDisplayErrorPage(true)
        }

    }

    function deleteStep(){
        var newRecipeData = structuredClone(props.recipeData)
        newRecipeData.splice(props.stepIndex, 1)
        props.setRecipeData(newRecipeData)
        // Reset the selection every time a step is deleted
        props.selectStep(-1) // -1 signifies no step has been selected. It's the default value before any steps have been selected
    }

    function changeHandlerStepName(stepIndex, event){
        var newRecipeData = structuredClone(props.recipeData)
        newRecipeData[stepIndex]['Name']['ParamValue'] = event.target.value
        props.setRecipeData(newRecipeData)
    }

    return (
        <tr id={"SingleStepRowComponentMainRow"}
            className={`${props.isEvenStepRow?"IsEvenStepRow":"IsOddStepRow"} ${props.IsSelectedStepIndex?"IsSelectedStep":"IsNotSelectedStep"}`}
            onClick={(event) => {
                if(props.pageIsReadOnly){
                    console.log("Selection change not allowed in ReadOnly")
                    return;
                }
                // Do not select this row if the click originates from the delete button
                if(!event.target.closest('button')){
                    props.selectStep(props.stepIndex)
                }
            }}
        >
            <td id={"StepNameTDElement"}>
                <input
                    value={props.step['Name']['ParamValue']}
                    onChange={(event)=> changeHandlerStepName(props.stepIndex, event)}
                    disabled={props.pageIsReadOnly}
                    style={{width:"100px"}}
                />
            </td>
            <td colSpan={props.pageIsReadOnly?3:5}>
                <div id={"ToggleRevealSubStepsDiv"}>
                    <table id={"SubStepRevealDeleteStepButtonTable"}>
                        <tbody>
                        <tr>
                            <td>
                                <button onClick={clickHandlerRevealSubStepsButton}>
                                    <FontAwesomeIcon icon={props.step['RevealSubSteps']?faChevronUp:faChevronDown} />
                                </button>
                            </td>
                            <td></td>
                            <td></td>

                            {
                                !props.pageIsReadOnly &&
                                <td></td>
                            }
                            {
                                !props.pageIsReadOnly &&
                                <td>
                                    <button onClick={deleteStep} disabled={props.pageIsReadOnly}>
                                        <FontAwesomeIcon icon={faX}/>
                                    </button>
                                </td>
                            }

                        </tr>
                        </tbody>
                    </table>
                </div>
                {
                    (props.step['RevealSubSteps']) && props.step['SubSteps'].map((subStep, subStepIndex) => (
                        <SubStepDivComponent
                            key={subStepIndex}
                            subStep={subStep}
                            stepIndex={props.stepIndex}
                            subStepIndex={subStepIndex}
                            isEvenSubStep={subStepIndex%2===0}
                            itemsAndTheirActions={props.itemsAndTheirActions}
                            changeHandlerSubStepName={props.changeHandlerSubStepName}
                            reorderSubSteps={props.reorderSubSteps}
                            recipeData={props.recipeData}
                            setRecipeData={props.setRecipeData}
                            pageIsReadOnly={props.pageIsReadOnly}
                        />
                    ))
                }
                {
                    ((props.step['RevealSubSteps']) && !props.pageIsReadOnly) &&
                    <div id={"AppendSubStepDiv"} className={props.step['SubSteps'].length%2===0?"IsEvenAddSubStepButton":"IsOddAddSubStepButton"}>
                        <table>
                            <tbody>
                            <tr>
                                <td colSpan={5}>
                                    <button onClick={appendSubStep} disabled={props.pageIsReadOnly}>Add Sub Step</button>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                }
            </td>
        </tr>
    )
}

export default SingleStepRowComponent