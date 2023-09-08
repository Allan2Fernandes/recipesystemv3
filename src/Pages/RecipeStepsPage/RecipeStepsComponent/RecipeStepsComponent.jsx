import "./RecipeStepsComponent.css"
import {useEffect, useState} from "react";
import FetchQueries from "../../../FetchHandler/FetchQueries";
import HelperFunctions from "../../../HelperFunctions/HelperFunctions"
import StepListComponent from "./StepListComponent/StepListComponent";
import {Directions, ParamIDs} from "../../../Constants";
//import stockImage from "../../../Images/StockCadDrawing.png"
import ImagesInstructionsComponent from "./ImageInstructionsComponent/ImagesInstructionsComponent";
import secureLocalStorage from "react-secure-storage";
import SingleImageComponent from "./ImageInstructionsComponent/SingleImageComponent/SingleImageComponent";
import ImageSelectionPopUp from "./ImageSelectionPopUp/ImageSelectionPopUp";
import {blank_image} from "../../../Constants";


function RecipeStepsComponent(props){
    const [recipeData, setRecipeData] = useState([])
    const [allPossibleActions, setAllPossibleActions] = useState([])
    const [itemsAndTheirActions, setItemsAndTheirActions] = useState([])
    const [selectedStepIndex, setSelectedStepIndex] = useState(-1)
    const [selectedImageIdentifier, setSelectedImageIdentifier] = useState("")
    const [displayImageSelectionPopUp, setDisplayImageSelectionPopUp] = useState(false)

    useEffect(() => {
        // Fetch the recipes
        fetchRecipeData().catch(e => props.setDisplayErrorPage(true))
        fetchActionsAndTheirItems().catch(e => props.setDisplayErrorPage(true))
    }, [props.selectedRecipeSetID, props.preDefinedSelectedStepIndex])

    async function fetchRecipeData(){
        await FetchQueries.getStepsAndSubStepsOfRecipe(props.selectedRecipeSetID).then(result => {
            // Process the data into a usable format
            var processedData = HelperFunctions.ProcessFetchedRecipeData(result)

            processedData.forEach((step, stepIndex) => {
                if(step['Name']['StepNumber']===props.preDefinedSelectedStepIndex){
                    setSelectedStepIndex(stepIndex)
                }
            })
            setRecipeData(processedData)
        }).catch(e => props.setDisplayErrorPage(true))
    }

    async function fetchActionsAndTheirItems(){
        var actionsData = await FetchQueries.executeGetActionOptions().catch(e => props.setDisplayErrorPage(true))
        setAllPossibleActions(actionsData[0])
        var itemsData = await FetchQueries.executeGetItemsForEachAction(actionsData[0]).catch(e => props.setDisplayErrorPage(true))
        setItemsAndTheirActions(itemsData)
    }

    function changeHandlerSubStepProperty(event, fieldName, stepIndex, subStepIndex){
        try{
            var newRecipeData = structuredClone(recipeData)
            newRecipeData[stepIndex]['SubSteps'][subStepIndex][fieldName]['ParamValue'] = event.target.value

            if(fieldName==="Action"){
                // Change the action for this sub step too. It has to be the default value for this action
                var selectedAction = itemsAndTheirActions.filter(row => row['Action'] === event.target.value)[0]
                var defaultItem = selectedAction['Items'][0]['ParamValue']
                newRecipeData[stepIndex]['SubSteps'][subStepIndex]['Item']['ParamValue'] = defaultItem
            }
            setRecipeData(newRecipeData)
        }catch(error){
            console.log(error)
            props.setDisplayErrorPage(true)
        }
    }

    function reorderSubSteps(event, stepIndex, subStepIndex, direction){
        // Have to swap the recipe values only and nothing else.
        var listOfPropertiesToSwap = ['Name', 'Action', 'Item']

        var newRecipeData = structuredClone(recipeData)
        if(direction === Directions.Up){
            // If it is at sub step index 0, cannot swap upwards
            if(subStepIndex === 0){
                console.log("0th Index, cannot swap upwards")
                return;
            }

            // Swap them
            // Copy every property from the previous step to the new step

            listOfPropertiesToSwap.forEach((property) => {
                newRecipeData[stepIndex]['SubSteps'][subStepIndex-1][property]['ParamValue'] = recipeData[stepIndex]['SubSteps'][subStepIndex][property]['ParamValue']
                newRecipeData[stepIndex]['SubSteps'][subStepIndex][property]['ParamValue'] = recipeData[stepIndex]['SubSteps'][subStepIndex-1][property]['ParamValue']
            })
        }else{
            // If it is at the last sub step index, cannot swap downwards
            if(subStepIndex === newRecipeData[stepIndex]['SubSteps'].length-1){
                console.log("Final index, cannot swap down")
                return;
            }

            // Swap them
            listOfPropertiesToSwap.forEach((property) => {
                newRecipeData[stepIndex]['SubSteps'][subStepIndex][property]['ParamValue'] = recipeData[stepIndex]['SubSteps'][subStepIndex + 1][property]['ParamValue']
                newRecipeData[stepIndex]['SubSteps'][subStepIndex + 1][property]['ParamValue'] = recipeData[stepIndex]['SubSteps'][subStepIndex][property]['ParamValue']
            })
        }
        setRecipeData(newRecipeData)
    }

    function addSubStepToStep(stepIndex, subStep){
        var newRecipeData = structuredClone(recipeData)
        newRecipeData[stepIndex]['SubSteps'].push(subStep)
        setRecipeData(newRecipeData)
    }

    function selectStep(stepIndex){
        setSelectedStepIndex(stepIndex)
    }

    function handleChangeSelectedStepInstructions(event){
        var newRecipeData = structuredClone(recipeData)
        newRecipeData[selectedStepIndex]['Instructions']['ParamValue'] = event.target.value
        setRecipeData(newRecipeData)
    }

    function handleChangeSelectedStepImage(b64Image, image_name, stepIndex, imageIdentifier, reducedImageData){
        var userDetails = secureLocalStorage.getItem("UserDetails")
        var userID = userDetails['SetID']

        // Figure out the format of the base64 file
        var b64DeterminationCharacter = b64Image.split(',')[1][0]

        var b64Prefix = ""

        if(b64DeterminationCharacter === '/'){
            b64Prefix = "data:image/jpeg;base64,"
        }else if(b64DeterminationCharacter === 'i'){
            b64Prefix = "data:image/png;base64,"
        }else{
            console.log("Invalid extension")
            return;
        }
        b64Image = b64Image.replace(b64Prefix, "")
        reducedImageData = reducedImageData.replace(b64Prefix, "")
        // Construct a query to save the image b64 and the name. Save them together for a common setID

        var query = `EXEC sp_SaveParams ${userID}, 'File', '${ParamIDs.FileName};${image_name};${ParamIDs.HighResImageEncoding};${b64Image};${ParamIDs.LowResImageEncoding};${reducedImageData}'`
        // Update the recipe data with the file name in the ParamValue for the step image
        FetchQueries.executeQueryInDatabase(query).then(result => {
            var newRecipeData = structuredClone(recipeData)
            newRecipeData[stepIndex][imageIdentifier]['ParamValue'] = image_name
            setRecipeData(newRecipeData)
        }).catch(error => {
            props.setDisplayErrorPage(true)
        })
    }

    function toggleDisplayImageSelectionPopUp(){
        setDisplayImageSelectionPopUp(!displayImageSelectionPopUp)
    }

    function handleChangeSelectedStepImageFromDatabase(imageName){
        var newRecipeData = structuredClone(recipeData)
        newRecipeData[selectedStepIndex][selectedImageIdentifier]['ParamValue'] = imageName
        setRecipeData(newRecipeData)
        setDisplayImageSelectionPopUp(false)

    }


    return (
        <div id={"RecipeStepsComponentMainDiv"}>
            {
                displayImageSelectionPopUp &&
                <ImageSelectionPopUp
                    toggleDisplayImageSelectionPopUp={toggleDisplayImageSelectionPopUp}
                    setDisplayErrorPage={props.setDisplayErrorPage}
                    handleChangeSelectedStepImageFromDatabase={handleChangeSelectedStepImageFromDatabase}
                />
            }
            <SingleImageComponent
                image={selectedStepIndex>=0?recipeData[selectedStepIndex]['Image1']['ParamValue']:blank_image}
                selectedStepIndex={selectedStepIndex}
                stepImageIdentifier={"Image1"}
                handleChangeSelectedStepImage={handleChangeSelectedStepImage}
                //pageIsReadOnly={props.pageIsReadOnly}
                toggleDisplayImageSelectionPopUp={toggleDisplayImageSelectionPopUp}
                setSelectedImageIdentifier={setSelectedImageIdentifier}
            />
            <StepListComponent
                selectedRecipeName={props.selectedRecipeName}
                selectedRecipeSetID={props.selectedRecipeSetID}
                recipeData={recipeData}
                setRecipeData={setRecipeData}
                itemsAndTheirActions={itemsAndTheirActions}
                changeHandlerSubStepName={changeHandlerSubStepProperty}
                reorderSubSteps={reorderSubSteps}
                setDisplayErrorPage={props.setDisplayErrorPage}
                saveRecipe={props.saveRecipe}
                addSubStepToStep={addSubStepToStep}
                selectStep={selectStep}
                selectedStepIndex={selectedStepIndex}
                //pageIsReadOnly={props.pageIsReadOnly}
            />

            <ImagesInstructionsComponent
                selectedStepIndex={selectedStepIndex}
                image1={selectedStepIndex>=0?recipeData[selectedStepIndex]['Image1']['ParamValue']:blank_image}
                image2={selectedStepIndex>=0?recipeData[selectedStepIndex]['Image2']['ParamValue']:blank_image}
                instructions={selectedStepIndex>=0?recipeData[selectedStepIndex]['Instructions']['ParamValue']:"Step not selected"}
                handleChangeSelectedStepInstructions={handleChangeSelectedStepInstructions}
                handleChangeSelectedStepImage={handleChangeSelectedStepImage}
                //pageIsReadOnly={props.pageIsReadOnly}
                toggleDisplayImageSelectionPopUp={toggleDisplayImageSelectionPopUp}
                setSelectedImageIdentifier={setSelectedImageIdentifier}
            />
        </div>
    )
}

export default RecipeStepsComponent