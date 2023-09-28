import React, {useEffect, useState} from "react";
import "./ImageSelectionPopUp.css"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faClose, faSearch,
    faUpload
} from "@fortawesome/free-solid-svg-icons";
import secureLocalStorage from "react-secure-storage";
import FetchQueries from "../../../../FetchHandler/FetchQueries";
import ImagesGridComponent from "./ImagesGridComponent/ImagesGridComponent";
import {ParamIDs} from "../../../../Constants";

function ImageSelectionPopUp(props){
    const [listOfImageNames, setListOfImageNames] = useState([])
    const [searchKeyWord, setSearchKeyWord] = useState("")
    const [filteredListOfImages, setFilteredListOfImages] = useState([])

    useEffect(() => {
        fetchAllImageNames()
    }, [])

    useEffect(() => {
        filterListOfImagesByKeyWord()
    }, [searchKeyWord])

    async function fetchAllImageNames(){
        // TODO Turn this into a stored procedure
        var query = `select T1.ParamValue from File_STRING T1 inner join File_BOOL T2 on T1.SetID = T2.SetID where T1.SetID in (select MAX(SetID) from File_STRING where ParamID = ${ParamIDs.FileName} group by ParamValue) and T2.ParamValue = ${ParamIDs.ImageEnabledParamValue} and T1.ParamID = ${ParamIDs.FileName}`
        await FetchQueries.executeQueryInDatabase(query).then(result => {
            setListOfImageNames(result[0])
            setFilteredListOfImages(result[0])
        }).catch(error => props.setDisplayErrorPage(true))
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
            var query = `EXECUTE sp_SaveParams ${userID}, 'File', '${ParamIDs.FileName};${image_file['name']};${ParamIDs.HighResImageEncoding};${b64Image};${ParamIDs.LowResImageEncoding};${reducedImageData};${statusString}'`

            FetchQueries.executeQueryInDatabase(query).then(result => fetchAllImageNames()).catch(error => props.setDisplayErrorPage(true))
        };
        reader.readAsDataURL(image_file);
    }

    function changeHandlerSearchKeyWord(event){
        setSearchKeyWord(event.target.value)
    }

    function filterListOfImagesByKeyWord(){
        var filteredList = listOfImageNames.filter(image => image['ParamValue'].toString().toLowerCase().includes(searchKeyWord.toLowerCase()))
        setFilteredListOfImages(filteredList)
    }

    return (
        <div id={"ImageSelectionOverLay"} onClick={(event => handleClickOverlay(event))}>
            <div id={"ImageSelectionPopUpMainDiv"}>
                <div id={"ImageSelectorTopBar"}>
                    <label id={"ImageSelectorTopBarLabel"}>Image Selection</label>
                    <button id={"PopUpCloseButton"} onClick={clickHandlerClosePopUp}>
                        <FontAwesomeIcon icon={faClose}/>
                    </button>
                </div>
                <ImagesGridComponent
                    listOfImageNames={filteredListOfImages}
                    handleChangeSelectedStepImageFromDatabase={props.handleChangeSelectedStepImageFromDatabase}
                    fetchAllImageNames={fetchAllImageNames}
                />
                <div>
                    <div id={"ImageSearchDiv"}>
                        <FontAwesomeIcon icon={faSearch}/>
                        <input
                            id={"ImageSearchInput"}
                            type={"text"}
                            value={searchKeyWord}
                            onChange={(event) => changeHandlerSearchKeyWord(event)}
                        />
                    </div>
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