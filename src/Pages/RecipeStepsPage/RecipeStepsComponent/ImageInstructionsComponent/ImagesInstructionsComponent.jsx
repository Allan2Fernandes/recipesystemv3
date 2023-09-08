import "./ImagesInstructionsComponent.css"
import SingleImageComponent from "./SingleImageComponent/SingleImageComponent";


function ImagesInstructionsComponent(props){
    return (
        <div id={"ImagesInstructionsComponentMainDiv"}>
            <div id={"InstructionsDiv"}>
                <textarea id={"InstructionsTextArea"}
                          value={props.instructions}
                          disabled={props.selectedStepIndex < 0}
                          onChange={(event) => props.handleChangeSelectedStepInstructions(event)}
                ></textarea>
            </div>
            {/*<SingleImageComponent*/}
            {/*    image={props.image1}*/}
            {/*    selectedStepIndex={props.selectedStepIndex}*/}
            {/*    stepImageIdentifier={"Image1"}*/}
            {/*    handleChangeSelectedStepImage={props.handleChangeSelectedStepImage}*/}
            {/*    pageIsReadOnly={props.pageIsReadOnly}*/}
            {/*/>*/}
            <SingleImageComponent
                image={props.image2}
                selectedStepIndex={props.selectedStepIndex}
                stepImageIdentifier={"Image2"}
                handleChangeSelectedStepImage={props.handleChangeSelectedStepImage}
                //pageIsReadOnly={props.pageIsReadOnly}
                toggleDisplayImageSelectionPopUp={props.toggleDisplayImageSelectionPopUp}
                setSelectedImageIdentifier={props.setSelectedImageIdentifier}
            />

        </div>
    )
}

export default ImagesInstructionsComponent