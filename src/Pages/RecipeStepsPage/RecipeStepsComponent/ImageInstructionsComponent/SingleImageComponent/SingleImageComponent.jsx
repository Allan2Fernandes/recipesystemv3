import "./SingleImageComponent.css"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faFile} from "@fortawesome/free-solid-svg-icons";
import {baseURL} from "../../../../../Constants";
import stockImage from "../../../../../Images/StockCadDrawing.png"

function SingleImageComponent(props){

    function GetSelectedImage(event, stepIndex){ //TODO There is an issue with the ONCHANGE. The same image cannot be selected too many times.
        var image_file = event.target.files[0]
        if(image_file === undefined){
            return;
        }
        // Clear the input value to allow selecting the same file again
        event.target.value = '';
        
        const reader = new FileReader();
        reader.onloadend = () => {
            props.handleChangeSelectedStepImage(reader.result, image_file['name'],stepIndex, props.stepImageIdentifier)
        };
        reader.readAsDataURL(image_file);
    }


    return (
        <div id={"SingleImageMainDiv"}>
            <img id={"ImageElement"} src={props.image===stockImage?props.image:`${baseURL}api/Image/getImageOnFileName/${props.image}`} alt={"Stock"}/>
            <div id={"UploadNewImageDiv"}>
                <input type={"file"}
                    // The image index and step index are necessary otherwise images will be uploaded to the wrong step or index
                       id={`UploadNew${props.stepImageIdentifier}Button`}
                    // CSS here was needed because the ID is not a constant and classNames would not work
                       style={{display:"none"}}
                       disabled={props.selectedStepIndex < 0 || props.pageIsReadOnly}
                       onChange={(event) => GetSelectedImage(event, props.selectedStepIndex)}
                />
                <label id={`UploadNew${props.stepImageIdentifier}Label`}
                       htmlFor={`UploadNew${props.stepImageIdentifier}Button`}
                       className={props.selectedStepIndex < 0?"StepNotSelectedDisabled":"StepSelectedEnabled"}>
                    <FontAwesomeIcon id={"UploadIcon"} icon={faFile}/>
                    {`Upload ${props.stepImageIdentifier}`}
                </label>
            </div>
        </div>
    )
}

export default SingleImageComponent