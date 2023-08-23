import React from "react";
import "./ImageSelectionPopUp.css"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faClose,
    faClosedCaptioning,
    faFile,
    faFolderClosed,
    faUpload,
    faWindowClose
} from "@fortawesome/free-solid-svg-icons";
import secureLocalStorage from "react-secure-storage";

function ImageSelectionPopUp(props){

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
            b64Image = b64Image.replace(b64Prefix, "")
            // Construct a query to save the image in the database
            var query = `EXECUTE sp_SaveParams ${userID}, 'File', '35008;${image_file['name']};35009;${b64Image}'`
            console.log(query)
        };
        reader.readAsDataURL(image_file);
    }

    return (
        <div id={"ImageSelectionOverLay"} onClick={(event => handleClickOverlay(event))}>
            <div id={"ImageSelectionPopUpMainDiv"}>
                <button id={"PopUpCloseButton"} onClick={clickHandlerClosePopUp}>
                    <FontAwesomeIcon icon={faClose}/>
                </button>
                <div>
                    <input id={"UploadImageToDBFileInput"}
                           type={"file"}
                           onChange={(event) => handleChangeFileInput(event)}
                           style={{display:"none"}}
                    />
                    <label id={"UploadImageToDBButton"}
                           htmlFor={"UploadImageToDBFileInput"}>
                        <FontAwesomeIcon id={"UploadIcon"} icon={faUpload}/>
                        {"Upload to DB"}
                    </label>
                </div>
            </div>

        </div>

    )
}

export default ImageSelectionPopUp