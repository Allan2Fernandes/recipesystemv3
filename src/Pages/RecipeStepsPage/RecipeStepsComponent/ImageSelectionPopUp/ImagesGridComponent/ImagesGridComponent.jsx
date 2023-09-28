import "./ImagesGridComponent.css"
import React, {useState} from "react";
import {baseURL, ParamIDs} from "../../../../../Constants";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCopy, faEdit, faTrash, faUpload} from "@fortawesome/free-solid-svg-icons";
import {click} from "@testing-library/user-event/dist/click";
import FetchQueries from "../../../../../FetchHandler/FetchQueries";
import secureLocalStorage from "react-secure-storage";

function ImagesGridComponent(props){

    function clickHandlerSelectImage(imageName){
        var fileName = imageName['ParamValue']
        props.handleChangeSelectedStepImageFromDatabase(fileName)
    }

    async function clickHandlerDisableImage(imageName){
        // Get the saved user details from storage
        var userDetails = secureLocalStorage.getItem("UserDetails")
        // Extract just the setID which is the UserID in the query
        var userID = userDetails['SetID']

        var reducedImageData = ""
        var statusString = `${ParamIDs.ImageActiveStatus};${ParamIDs.ImageDisabledParamValue};`

        var b64ImageData = await FetchQueries.executeQueryInDatabase(`[dbo].[sp_GetImageEncodingOnName] '${imageName}'`)
        var b64Image = b64ImageData[0][0]['ParamValue']
        var query = `EXECUTE sp_SaveParams ${userID}, 'File', '${ParamIDs.FileName};${imageName};${ParamIDs.HighResImageEncoding};${b64Image};${ParamIDs.LowResImageEncoding};${reducedImageData};${statusString}'`
        // TODO ERROR HANDLING
        await FetchQueries.executeQueryInDatabase(query).then(result => props.fetchAllImageNames())
    }

    function handleChangeInputOverrideImage(event, imageName){
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
            // Figure out the format of the base64 file
            var b64DeterminationCharacter = b64Image.split(',')[1][0]

            var b64Prefix = ""
            var reducedImageData = ""
            var statusString = `${ParamIDs.ImageActiveStatus};${ParamIDs.ImageEnabledParamValue};`

            if(b64DeterminationCharacter === '/'){
                b64Prefix = "data:image/jpeg;base64,"
            }else if(b64DeterminationCharacter === 'i'){
                b64Prefix = "data:image/png;base64,"
            }else{
                console.log("Invalid extension")
                return;
            }
            b64Image = b64Image.replace(b64Prefix, "")
            // Construct a query to save the image in the database
            var query = `EXECUTE sp_SaveParams ${userID}, 'File', '${ParamIDs.FileName};${imageName};${ParamIDs.HighResImageEncoding};${b64Image};${ParamIDs.LowResImageEncoding};${reducedImageData};${statusString}'`
            // TODO ERROR HANDLING
            FetchQueries.executeQueryInDatabase(query).then(result => props.fetchAllImageNames())
        };
        reader.readAsDataURL(image_file);
    }

    return (
        <div id={"ImagesGridComponentMainDiv"} className={"image-grid"}>
            {
                props.listOfImageNames.map((image, index) => (
                    <div key={index}>
                        <img
                            src={`${baseURL}api/Image/getImageOnFileName/${image['ParamValue']}/${new Date().getTime().toString()}`}
                            alt={`Image ${index}`}
                            className={"image-item"}
                            onClick={(event) => clickHandlerSelectImage(image)}
                        />
                        <center>
                            <button id={"DisableImageButton"} onClick={(event) => clickHandlerDisableImage(image['ParamValue'])} disabled={image['ParamValue'] === "blank_white_image.png"}>
                                <FontAwesomeIcon icon={faTrash}/>
                            </button>
                            <input id={`${image['ParamValue']}`}
                                   type={"file"}
                                   onChange={(event) => handleChangeInputOverrideImage(event, image['ParamValue'])}
                                   style={{display:"none"}}
                                   disabled={image['ParamValue'] === "blank_white_image.png"}
                            />
                            <label id={"OverrideImageButton"}
                                   htmlFor={`${image['ParamValue']}`}>
                                <FontAwesomeIcon id={"UploadIcon"} icon={faEdit}/>
                            </label>
                            <label id={"ImageNameLabel"}>{image['ParamValue']}</label>
                        </center>
                    </div>
                ))
            }
        </div>
    )
}

export default ImagesGridComponent