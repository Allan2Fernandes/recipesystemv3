import "./SingleStepRowComponent.css"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronDown, faChevronUp} from "@fortawesome/free-solid-svg-icons";


function SingleStepRowComponent(props){

    function clickHandlerRevealSubStepsButton(){
        props.revealSubStepsOnStepIndex(props.stepIndex)
    }

    return (
        <tr id={"SingleStepRowComponentMainRow"} className={props.isEvenStepRow?"IsEvenStepRow":"IsOddStepRow"}>
            <td id={"StepNameTDElement"}>{props.step['Name']['ParamValue']}</td>
            <td>
                <button onClick={clickHandlerRevealSubStepsButton}>
                    <FontAwesomeIcon icon={props.step['RevealSubSteps']?faChevronUp:faChevronDown} />
                </button>
            </td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
        </tr>
    )
}

export default SingleStepRowComponent