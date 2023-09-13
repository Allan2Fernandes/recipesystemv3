import "./DuplicateRecipeDialogBox.css"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheck, faClose} from "@fortawesome/free-solid-svg-icons";
import React, {useState} from "react";
import {Permissions} from "../../../../../Constants";
import HelperFunctions from "../../../../../HelperFunctions/HelperFunctions";

function DuplicateRecipeDialogBox(props){
    const [duplicateRecipeName, setDuplicateRecipeName] = useState("")

    function handleClickCloseButton(){
        props.setSelectedRecipeSetID(-1)
        props.setDisplayDuplicateRecipeDialog(false)
    }

    function handleClickConfirmButton(){
        if(duplicateRecipeName ===""){
            console.log("Invalid recipe name")
            return;
        }
        props.saveDuplicatedRecipe(duplicateRecipeName, props.selectedRecipeSetID, false, props.selectedRecipeActiveStatus)
        props.setSelectedRecipeSetID(-1)
        props.setDisplayDuplicateRecipeDialog(false)
    }

    function handleClickOverlay(event){
        if(event.target.id === "DuplicateRecipeDialogBoxOverlay"){
            // Ensure that the click on popup doesn't close it.
            props.setSelectedRecipeSetID(-1)
            props.setDisplayDuplicateRecipeDialog(false)
        }
    }

    function changeHandlerDuplicateRecipeName(event){
        setDuplicateRecipeName(event.target.value)
    }

    return (
        <div id={"DuplicateRecipeDialogBoxOverlay"} onClick={(event) => handleClickOverlay(event)}>
            <div id={"DialogBoxMainDiv"}>
                <div id={"DialogTopBar"}>
                    <label id={"TopBarLabel"}>Duplicate Recipe Name</label>
                    <button id={"DialogCloseButton"} onClick={handleClickCloseButton}>
                        <FontAwesomeIcon icon={faClose}/>
                    </button>
                </div>
                <div id={"DialogBoxBody"}>
                    <input type={"text"} value={duplicateRecipeName} onChange={(event) => changeHandlerDuplicateRecipeName(event)}/>
                    <button onClick={handleClickConfirmButton} disabled={!Permissions.duplicateRecipe[HelperFunctions.getAccessLevelFromLocalStorage()]}>
                        <FontAwesomeIcon icon={faCheck}/>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default DuplicateRecipeDialogBox