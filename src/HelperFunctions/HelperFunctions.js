import {ParamIDs} from "../Constants";
import secureLocalStorage from "react-secure-storage";
import {logDOM} from "@testing-library/react";

class HelperFunctions{
    static ProcessFetchedRecipeData(fetchedData){
        var listOfStepsData = []
        var stepsData = fetchedData[0]
        var subStepsData = fetchedData[1]
        // First construct the steps
        // Get the unique stepNumbers
        var uniqueStepNumbers = new Set()
        stepsData.forEach(row => uniqueStepNumbers.add(parseInt(row['StepNumber'])))
        uniqueStepNumbers = Array.from(uniqueStepNumbers)
        uniqueStepNumbers = uniqueStepNumbers.sort((a,b) => a-b)
        // For every stepNumber, filter the list and locate each attribute like image1, image2, name, instructions, etc
        uniqueStepNumbers.forEach(uniqueStepNumber => {
            // First find the step data for just the relevant step number
            var relevantStepData = stepsData.filter(row => row['StepNumber']===uniqueStepNumber)
            // find the name of the step
            // Step name has a ParamID of 35007
            var stepNameData = relevantStepData.filter(row => row['ParamID']===ParamIDs.StepSubStepName)[0]
            // Step Instructions has a ParamID of 35003
            var stepInstructionsData = relevantStepData.filter(row => row['ParamID'] === ParamIDs.StepInstructions)[0]
            // Image1 has a ParamID of 35001
            var stepImage1Data = relevantStepData.filter(row => row['ParamID'] === ParamIDs.StepImage1)[0]
            // Image2 has a ParamID of 35002
            var stepImage2Data = relevantStepData.filter(row => row['ParamID'] === ParamIDs.StepImage2)[0]

            // Process sub step data for each step
            var stepSetID = stepNameData['StepSetID']
            var relevantSubStepData = subStepsData.filter(row => row['StepSetID'] === stepSetID)
            // Get the unique subStepSetIDs for this step
            var uniqueSubStepNumbers = new Set()
            relevantSubStepData.forEach(row => uniqueSubStepNumbers.add(row['SubStepNumber']))
            // Sort the set of unique sub step IDs
            // Have to convert to an array first
            uniqueSubStepNumbers = Array.from(uniqueSubStepNumbers)
            // It has to be sorted this way to ensure it's not sorted in the form [1,10,11,12,2,3,4,...]
            uniqueSubStepNumbers = uniqueSubStepNumbers.sort((a,b) => a-b)

            var listOfSubSteps = []
            //Loop through the sub step IDs for this particular step
            uniqueSubStepNumbers.forEach(subStepNumber => {
                // Extract the Sub step name, Action and Item for every sub step in this tep
                // Sub step name ParamID = 35007
                var subStepNameData = relevantSubStepData.filter(row => row['ParamID'] === ParamIDs.StepSubStepName && row['SubStepNumber'] === subStepNumber)[0]
                // Sub step Action ParamID = 35004
                var subStepActionData = relevantSubStepData.filter(row => row['ParamID'] === ParamIDs.SubStepAction && row['SubStepNumber'] === subStepNumber)[0]
                // Sub step Item ParamID = 35005
                var subStepItemData = relevantSubStepData.filter(row => row['ParamID'] === ParamIDs.SubStepItem && row['SubStepNumber'] === subStepNumber)[0]

                var setOfSubStepData = {
                    Name: subStepNameData,
                    Action: subStepActionData,
                    Item: subStepItemData
                }
                listOfSubSteps.push(setOfSubStepData)
            })


            // Construct a set of this data
            var setOfStepData = {
                Name: stepNameData,
                Instructions: stepInstructionsData,
                Image1: stepImage1Data,
                Image2: stepImage2Data,
                SubSteps: listOfSubSteps,
                RevealSubSteps: false
            }
            listOfStepsData.push(setOfStepData)
        })
        return listOfStepsData
    }

    static processFetchedShelfValuesData(fetchedData, action){
        fetchedData = fetchedData[0]
        var processedData = []
        // First get the unique SetIDs
        var listOfUniqueSetIDs = new Set()
        // Group them up by SetIDs
        fetchedData.forEach(row => listOfUniqueSetIDs.add(row['SetID']))
        if(action === 'Expander'){
            listOfUniqueSetIDs.forEach(SetID => {
                var eachItemData = fetchedData.filter(data => data['SetID'] === SetID)
                const xCoord = eachItemData.filter(row => row['ParamID'] ===ParamIDs.ExpanderXCoord)[0]
                const yCoord = eachItemData.filter(row => row['ParamID'] ===ParamIDs.ExpanderYCoord)[0]
                const zCoord = eachItemData.filter(row => row['ParamID'] === ParamIDs.ExpanderZCoord)[0]
                const orientation = eachItemData.filter(row => row['ParamID'] === ParamIDs.ExpanderOrientation)[0]
                const modificationDate = eachItemData.filter(row => row['ParamID'] === ParamIDs.ModificationDate)[0]
                const itemName = eachItemData.filter(row => row['ParamID'] === ParamIDs.ItemName)[0]
                const itemEnabledStatus = eachItemData.filter(row => row['ParamID'] === ParamIDs.ItemActiveStatus)[0]
                const uniqueItemIdentifier = eachItemData.filter(row => row['ParamID'] === ParamIDs.ItemIdentifier)[0]
                const setOfData = {
                    Name: itemName,
                    XCoord: xCoord,
                    YCoord: yCoord,
                    ZCoord: zCoord,
                    orientation: orientation,
                    modificationDate: modificationDate,
                    Status: itemEnabledStatus['ParamValue']==='1',
                    uniqueItemIdentifier: uniqueItemIdentifier
                }
                processedData.push(setOfData)
            })
        }else{
            listOfUniqueSetIDs.forEach(SetID => {
                var eachItemData = fetchedData.filter(data => data['SetID'] === SetID)
                const ShelfValue = eachItemData.filter(row => row['ParamID'] ===ParamIDs.ShelfNumber)[0]
                const modificationDate = eachItemData.filter(row => row['ParamID'] === ParamIDs.ModificationDate)[0]
                const itemName = eachItemData.filter(row => row['ParamID'] === ParamIDs.ItemName)[0]
                const itemEnabledStatus = eachItemData.filter(row => row['ParamID'] === ParamIDs.ItemActiveStatus)[0]
                const uniqueItemIdentifier = eachItemData.filter(row => row['ParamID'] === ParamIDs.ItemIdentifier)[0]
                const setOfData = {
                    Name: itemName,
                    ShelfValue: ShelfValue,
                    ModificationDate: modificationDate,
                    Status: itemEnabledStatus['ParamValue']==='1',
                    uniqueItemIdentifier: uniqueItemIdentifier
                }
                processedData.push(setOfData)
            })
        }
        return processedData
    }

    static processItemsData(itemsData){
        // For every action
        itemsData.forEach(action => {
            // Get the unique SetIDs
            var listOfUniqueSetIDs = new Set()
            // Looping through the rows of the item list of every action
            action['Items'].forEach(row => {
                listOfUniqueSetIDs.add(row['SetID'])
            })
            // Using the unique SetIDs, Create a single row for every item.
            // The Properties are: ShelfNumber, ItemIdentifier, Active status, Modification date, ItemName, ActionType
            if(action['Action'] === "Expander"){
                // The structure of expander items is different to all the others
                // Properties for exapander are: xCoord, yCoord, zCoord, ExpanderOrientation, ItemIdentifier, Active status, modification date, itemName, action type
                var listOfItemsData = []
                listOfUniqueSetIDs.forEach(ID => {
                    var itemSet = action['Items'].filter(row => row['SetID'] === ID)
                    var xCoord = itemSet.filter(row => row['ParamID'] === ParamIDs.ExpanderXCoord)[0]['ParamValue']
                    var yCoord = itemSet.filter(row => row['ParamID'] === ParamIDs.ExpanderYCoord)[0]['ParamValue']
                    var zCoord = itemSet.filter(row => row['ParamID'] === ParamIDs.ExpanderZCoord)[0]['ParamValue']
                    var expanderOrientation = itemSet.filter(row => row['ParamID'] === ParamIDs.ExpanderOrientation)[0]['ParamValue']
                    var itemIdentifier = itemSet.filter(row => row['ParamID'] === ParamIDs.ItemIdentifier)[0]['ParamValue']
                    var status = itemSet.filter(row => row['ParamID'] === ParamIDs.ItemActiveStatus)[0]['ParamValue']
                    var modificationDate = itemSet.filter(row => row['ParamID'] === ParamIDs.ModificationDate)[0]['ParamValue']
                    var itemName = itemSet.filter(row => row['ParamID'] === ParamIDs.ItemName)[0]['ParamValue']
                    var actionType = itemSet.filter(row => row['ParamID'] === ParamIDs.ActionType)[0]['ParamValue']
                    var itemData = {
                        XCoord: xCoord,
                        YCoord: yCoord,
                        ZCoord: zCoord,
                        ExpanderOrientation: expanderOrientation,
                        ItemIdentifier: itemIdentifier,
                        Status: status,
                        ModificationDate: modificationDate,
                        ItemName: itemName,
                        ActionType: actionType
                    }
                    listOfItemsData.push(itemData)
                })
                action['Items'] = listOfItemsData
            }else{
                var listOfItemsData = []
                listOfUniqueSetIDs.forEach(ID => {
                    var itemSet = action['Items'].filter(row => row['SetID'] === ID)
                    var shelfNumber = itemSet.filter(row => row['ParamID'] ===ParamIDs.ShelfNumber)[0]['ParamValue']
                    var itemIdentifier = itemSet.filter(row => row['ParamID'] === ParamIDs.ItemIdentifier)[0]['ParamValue']
                    var status = itemSet.filter(row => row['ParamID'] === ParamIDs.ItemActiveStatus)[0]['ParamValue']
                    var modificationDate = itemSet.filter(row => row['ParamID'] === ParamIDs.ModificationDate)[0]['ParamValue']
                    var itemName = itemSet.filter(row => row['ParamID'] === ParamIDs.ItemName)[0]['ParamValue']
                    var actionType = itemSet.filter(row => row['ParamID'] === ParamIDs.ActionType)[0]['ParamValue']
                    var itemData = {
                        ShelfNumber: shelfNumber,
                        ItemIdentifier: itemIdentifier,
                        Status: status,
                        ModificationDate: modificationDate,
                        ItemName: itemName,
                        ActionType: actionType
                    }
                    listOfItemsData.push(itemData)
                })
                action['Items'] = listOfItemsData
            }
        })

    }

    static formatDateTimeFromDataBase(dateTimeFromDB){
        return new Date(dateTimeFromDB).toLocaleString('en-US',{hour12:false})
    }

    static getAccessLevelFromLocalStorage(){
        return secureLocalStorage.getItem("UserDetails")['AccessLevel']
    }

    static generateSaveRecipeQuery(userSetID, recipeNameParamID, recipeNameParamValue, hierarchyTypeParamID, hierarchyTypeParamValue, activeStatusParamID, activeStatusParamValue){
        return `EXEC sp_SaveParams ${userSetID}, 'Recipe', '${recipeNameParamID};${recipeNameParamValue};${hierarchyTypeParamID};${hierarchyTypeParamValue};${activeStatusParamID};${activeStatusParamValue}'`
    }


}

export default HelperFunctions