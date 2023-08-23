import "./SingleImageComponent.css"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faDatabase, faDownload, faFile, faUpload} from "@fortawesome/free-solid-svg-icons";
import {baseURL} from "../../../../../Constants";
import stockImage from "../../../../../Images/StockCadDrawing.png"
import {useEffect} from "react";
import FetchQueries from "../../../../../FetchHandler/FetchQueries";

function SingleImageComponent(props){

    useEffect(()=> {
    },[])

    function GetSelectedImage(event, stepIndex){
        var image_file = event.target.files[0]
        if(image_file === undefined){
            return;
        }
        // Clear the input value to allow selecting the same file again
        event.target.value = '';

        const reader = new FileReader();
        reader.onloadend = () => {
            props.handleChangeSelectedStepImage(reader.result, image_file['name'],stepIndex, props.stepImageIdentifier, "")
        };
        reader.readAsDataURL(image_file);
    }

    async function selectImageFromDatabase(){
        props.setSelectedImageIdentifier(props.stepImageIdentifier)
        // Construct a query to get all the distinct file names from the Database
        var query = "SELECT DISTINCT(ParamValue) FROM File_STRING WHERE ParamID = 35008"
        // Execute the query to get the names
        var result = await FetchQueries.executeQueryInDatabase(query)
        props.toggleDisplayImageSelectionPopUp()
    }

    return (
        <div id={props.stepImageIdentifier==="Image1"?"SingleImage1MainDiv":"SingleImageMainDiv"}>
            <img id={props.stepImageIdentifier==="Image1"?"Image1Element":"ImageElement"} src={props.image===stockImage?props.image:`${baseURL}api/Image/getImageOnFileName/${props.image}`} alt={"Stock"}/>
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
                    <FontAwesomeIcon id={"UploadIcon"} icon={faUpload}/>
                    {`${props.stepImageIdentifier}: Device`}
                </label>
                <button
                    id={"SelectImageFromDBButton"}
                    onClick={selectImageFromDatabase}
                    disabled={props.selectedStepIndex < 0 || props.pageIsReadOnly}
                >
                    <FontAwesomeIcon id={"FromDBIcon"} icon={faDatabase}/>
                    Database
                </button>
            </div>
        </div>
    )
}

export default SingleImageComponent