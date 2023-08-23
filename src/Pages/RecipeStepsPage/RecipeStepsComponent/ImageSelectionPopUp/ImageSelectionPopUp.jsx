import React, {useEffect, useState} from "react";
import "./ImageSelectionPopUp.css"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faClose,
    faUpload
} from "@fortawesome/free-solid-svg-icons";
import secureLocalStorage from "react-secure-storage";
import FetchQueries from "../../../../FetchHandler/FetchQueries";
import ImagesGridComponent from "./ImagesGridComponent/ImagesGridComponent";

function ImageSelectionPopUp(props){
    const [listOfImageNames, setListOfImageNames] = useState([])

    useEffect(() => {
        fetchAllImageNames()
    }, [])

    function fetchAllImageNames(){
        var query = "SELECT DISTINCT(ParamValue) FROM File_STRING WHERE ParamID = 35008"
        FetchQueries.executeQueryInDatabase(query).then(result => setListOfImageNames(result[0])).catch(error => props.setDisplayErrorPage(true))
    }

    function handleClickOverlay(event){
        if(event.target.id === "ImageSelectionOverLay"){
            // Ensure that the click on popup doesn't close it.
            props.toggleDisplayImageSelectionPopUp()
        }
    }


    function clickHandlerClosePopUp(){
        props.toggleDisplayImageSelectionPopUp()
    }

    function handleChangeFileInput(event){
        var image_file = event.target.files[0]
        if(image_file === undefined){
            return;
        }
        // Clear the input value to allow selecting the same file again
        event.target.value = '';
        const reader = new FileReader();
        reader.onloadend = () => {
            var b64Image = reader.result
            // Get the saved user details from storage
            var userDetails = secureLocalStorage.getItem("UserDetails")
            // Extract just the setID which is the UserID in the query
            var userID = userDetails['SetID']
            var b64Prefix = "data:image/jpeg;base64,"
            var reducedImageData = ""
            b64Image = b64Image.replace(b64Prefix, "")
            // Construct a query to save the image in the database
            var query = `EXECUTE sp_SaveParams ${userID}, 'File', '35008;${image_file['name']};35009;${b64Image};35010;${reducedImageData}'`
            FetchQueries.executeQueryInDatabase(query).then(result => fetchAllImageNames()).catch(error => props.setDisplayErrorPage(true))
        };
        reader.readAsDataURL(image_file);
    }

    return (
        <div id={"ImageSelectionOverLay"} onClick={(event => handleClickOverlay(event))}>
            <div id={"ImageSelectionPopUpMainDiv"}>
                <div id={"ImageSelectorTopBar"}>
                    <button id={"PopUpCloseButton"} onClick={clickHandlerClosePopUp}>
                        <FontAwesomeIcon icon={faClose}/>
                    </button>
                </div>

                <ImagesGridComponent
                    listOfImageNames={listOfImageNames}
                    handleChangeSelectedStepImageFromDatabase={props.handleChangeSelectedStepImageFromDatabase}
                />

                <div>
                    <input id={"UploadImageToDBFileInput"}
                           type={"file"}
                           onChange={(event) => handleChangeFileInput(event)}
                           style={{display:"none"}}
                    />
                    <label id={"UploadImageToDBButton"}
                           htmlFor={"UploadImageToDBFileInput"}>
                        <FontAwesomeIcon id={"UploadIcon"} icon={faUpload}/>
                        {"Upload image to DB"}
                    </label>
                </div>
            </div>

        </div>

    )
}

export default ImageSelectionPopUp