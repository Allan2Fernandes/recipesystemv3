import "./ShelfSetupPage.css"
import TopBar from "../../SharedComponents/TopBar/TopBar";
import {useEffect, useState} from "react";
import FetchQueries from "../../FetchHandler/FetchQueries";
import ErrorPage from "../../ErrorHandling/ErrorPage";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faAdd, faSearch} from "@fortawesome/free-solid-svg-icons";
import secureLocalStorage from "react-secure-storage";
import HelperFunctions from "../../HelperFunctions/HelperFunctions";
import {ParamIDs, Permissions} from "../../Constants";

function ShelfSetupPage(){
    // List of all Actions
    const [allPossibleActions, setAllPossibleActions] = useState([])
    // List of all items for the selected action
    const [allActionsItems, setAllActionsItems] = useState([])
    // Unmodified items. This was set up for the requirement to allow the user to change item names. But changing item names has been disabled.
    const [originalAllActionsItems, setOriginalAllActionsItems] = useState([])
    // Boolean state flag, deciding whether to show the actual shelf set up page or the error page in place of it.
    const [displayErrorPage, setDisplayErrorPage] = useState(false)
    // The selected action is selected from the drop down box. The selected action needs to be saved to then show items for that action
    const [selectedAction, setSelectedAction] = useState("")
    // The list of properties is different for every action. The item properties are therefore set, depending on the selected action
    const [itemProperties, setItemProperties] = useState([])
    // Different actions have a different number of properties or property values. This arrangement can be improved to just a list of properties.
    const [newItemPropertyValues, setNewItemPropertyValues] = useState({
        itemName: "",
        property1: "",
        property2: "",
        property3: "",
        property4: ""
    })
    // State flag for loading
    const [dataIsLoading, setDataIsLoading] = useState(false)
    // The items in the list are filtered, depending on the search phrase.
    const [searchPhrase, setSearchPhrase] = useState("")
    // One of the actions, Expander, is dependent on another set of action's items. Hence, the orientation options (expander depends on it) is fetched and saved by default
    const [orientationOptions, setOrientationOptions] = useState([])
    // When a row is clicked, if properties of the item are editable, the labels will turn to inputs and checkboxes will become enabled
    const [selectedItemRowIndex, setSelectedItemRowIndex] = useState(-1)
    // TODO Remove Unused state
    const [itemsUpdated, setItemsUpdated] = useState(false)
    // Boolean state flag, either to filter out disabled items or not.
    const [showDisabledItems, setShowDisabledItems] = useState(false)

    // Use effect to fetch actions
    useEffect(() => {
        var userDetails = secureLocalStorage.getItem("UserDetails")
        if(userDetails === null || userDetails === undefined){
            setDisplayErrorPage(true)
        }
        // Get the list of actions
        fetchActions().catch(e => setDisplayErrorPage(true))
    }, [])

    // Use effect to fetch items for selected action
    useEffect( () => {
        fetchItemsForAction(selectedAction)
            .then(_ => { // The result does not matter here.
                fetchOrientationOptions()
                    .then(_ => {
                        setSelectedItemRowIndex(-1)
                        setItemsUpdated(false)
                    }).catch(e => setDisplayErrorPage(true))
            }).catch(e => setDisplayErrorPage(true))
    },  [selectedAction])

    async function fetchItemsForAction(action){
        setDataIsLoading(true)
        // Given the action, execute a stored procedure to get all the items for that action and set the state
        await FetchQueries.executeFetchItemShelfDataForAction(action)
            .then(result => {
                    // Pre-process the result
                    var processedData = HelperFunctions.processFetchedShelfValuesData(result, action)
                    setAllActionsItems(processedData)
                    setOriginalAllActionsItems(processedData)
            })
            .then(result => setDataIsLoading(false))
            .catch(error => {
                setDisplayErrorPage(true)
            })
    }

    async function fetchOrientationOptions(){
        var action = "Orientation"

        await FetchQueries.executeFetchItemShelfDataForAction(action).then(result => {
            // Pre-process the result
            var processedData = HelperFunctions.processFetchedShelfValuesData(result, action)
            setOrientationOptions(processedData)
        })
            .catch(error => setDisplayErrorPage(true))
    }

    function setItemPropertiesOnAction(action){
        // Property names are dependent on the action
        if(action === "Expander"){
            setItemProperties(["X", "Y", "Z", "Orientation", "Status"])
        }else if(action === "Pick"){
            setItemProperties(["Shelf Number", "Status"])
        }else if(action === "Kolver" || action === "Atlas" || action === "Press" || action === "ProductType"){
            setItemProperties(["Program Number", "Status"])
        }else if(action === "Orientation"){
            setItemProperties(["Value", "Status"])
        }else if(action === "Acknowledge"){
            setItemProperties(["Value", "Status"])
        }
    }

    async function fetchActions(){
        // Get all the actions
        var actionsData = await FetchQueries.executeGetActionOptions().catch(e => setDisplayErrorPage(true))
        setAllPossibleActions(actionsData[0])
        var selectedDefaultAction = actionsData[0][0]['Action']
        setSelectedAction(selectedDefaultAction)
        setItemPropertiesOnAction(selectedDefaultAction)
        // Get all the items for the action
        await fetchItemsForAction(selectedDefaultAction)
    }

    async function fetchMaxItemIdentifier(){
        var query = ` select MAX(ParamValue) AS 'MaxID' from [dbo].[Recipe_INT] where ParamID = ${ParamIDs.ItemIdentifier}`
        var fetchedData = await FetchQueries.executeQueryInDatabase(query).catch(e => setDisplayErrorPage(true))
        return fetchedData[0]
    }

    function changeHandlerActionSelection(event){
        // Triggered when the selected action from the drop down box changes
        var newlySelectedAction = event.target.value
        setSelectedAction(newlySelectedAction)
        setItemPropertiesOnAction(newlySelectedAction)
        // Reset the entered values and search phrases
        setNewItemPropertyValues({
            itemName: "",
            property1: "",
            property2: "",
            property3: "",
            property4: ""
        })
        setSearchPhrase("")
    }

    function changeHandlerNewItemPropertyValues(event, itemIndex){
        // The first row in the table is for entering values to create a new item. When the value in any of those inputs changes, this function is called.
        var currentNewItemPropertyValues = structuredClone(newItemPropertyValues)
        if(itemIndex===0){
            currentNewItemPropertyValues['itemName'] = event.target.value
        }else{
            currentNewItemPropertyValues['property' + (itemIndex)] = event.target.value
        }
        setNewItemPropertyValues(currentNewItemPropertyValues)
    }

    function changeHandlerSearchPhrase(event){
        // Triggered when the value in the input field to search for items is changed.
        setSearchPhrase(event.target.value)
    }

    function changeHandlerNewlySelectedOrientation(event){
        // When the expander action is selected, new expander items can be created. To create the item, an orientation has to be selected.
        // This function is triggered when the orientation of the new expander item is selected.
        var newItemPropertyValuesClone = structuredClone(newItemPropertyValues)
        newItemPropertyValuesClone.property4 = event.target.value
        setNewItemPropertyValues(newItemPropertyValuesClone)
    }

    async function clickHandlerCreateNewItem(){
        // Checks in case the property values of the new item have not been entered.
        if(selectedAction ==="Expander"){
            if(newItemPropertyValues.property4==="" || newItemPropertyValues.property4 ==="Select Angle"){
                console.log("No Angle selected")
                return
            }
            if(newItemPropertyValues.itemName ===""){
                console.log("Expander item name not specified")
                return
            }
            if(newItemPropertyValues.property1==="" || newItemPropertyValues.property2==="" || newItemPropertyValues.property3 ===""){
                console.log("Expander coordinates not specified")
                return
            }
        }else if(selectedAction==="Orientation" || selectedAction ==="Pick" || selectedAction ==="Kolver" || selectedAction ==="Atlas" || selectedAction ==="Press" || selectedAction === "Acknowledge" || selectedAction === "ProductType"){
            if(newItemPropertyValues.itemName ===""){
                console.log("Item name not specified")
                return
            }
            if(newItemPropertyValues.property1 ===""){
                console.log("Item value not specified")
                return
            }
        }
        // Get the next item identifier by getting the current max and incrementing it by 1.
        var maxCurrentItemIdentifier = await fetchMaxItemIdentifier()
        // Get the UserID
        var userDetails = secureLocalStorage.getItem("UserDetails")
        // Extract just the setID which is the UserID in the query
        var userID = userDetails['SetID']
        // Define values for the saveparams SP
        const actionParamID = ParamIDs.ActionType
        const itemParamID = ParamIDs.ItemName
        const shelfNumberParamID = ParamIDs.ShelfNumber
        // Set up the creation query
        var createItemQuery = ""
        const itemIdentiferString = `${ParamIDs.ItemIdentifier};${parseInt(maxCurrentItemIdentifier===''?0:(maxCurrentItemIdentifier[0]['MaxID']) + 1)};`
        var enabledStatusString = `${ParamIDs.ItemActiveStatus};${ParamIDs.ItemEnabledParamValue};`
        if(selectedAction === "Expander"){
            // Add on the item property values
            const xParamID = ParamIDs.ExpanderXCoord
            const yParamID = ParamIDs.ExpanderYCoord
            const zParamID = ParamIDs.ExpanderZCoord
            const orientationParamID = ParamIDs.ExpanderOrientation
            // Create strings to save every property.
            var xString = `${xParamID};${newItemPropertyValues.property1};`
            var yString = `${yParamID};${newItemPropertyValues.property2};`
            var zString = `${zParamID};${newItemPropertyValues.property3};`
            // Put all those strings together
            var orientationString = `${orientationParamID};${orientationOptions.filter(row => row['Name']['ParamValue'] === newItemPropertyValues.property4)[0]['uniqueItemIdentifier']['ParamValue']};`
            // Finally use that string in the string in the query.
            createItemQuery = `EXECUTE sp_SaveParams ${userID}, 'Recipe', '${actionParamID};${ParamIDs.ExpanderActionTypeParamValue};${itemParamID};${newItemPropertyValues.itemName};${xString}${yString}${zString}${orientationString}${enabledStatusString}${itemIdentiferString}'`
        }else if(selectedAction === "Pick"){
            // For the rest of the actions, it is a single property that has to be put into the query string. The ParamValue for the different actions is different.
            var shelfString = `${shelfNumberParamID};${newItemPropertyValues.property1};`
            createItemQuery = `EXECUTE sp_SaveParams ${userID}, 'Recipe', '${actionParamID};${ParamIDs.PickActionTypeParamValue};${itemParamID};${newItemPropertyValues.itemName};${shelfString}${enabledStatusString}${itemIdentiferString}'`
        }else if(selectedAction === "Kolver"){
            var shelfString = `${shelfNumberParamID};${newItemPropertyValues.property1};`
            createItemQuery = `EXECUTE sp_SaveParams ${userID}, 'Recipe', '${actionParamID};${ParamIDs.KolverActionTypeParamValue};${itemParamID};${newItemPropertyValues.itemName};${shelfString}${enabledStatusString}${itemIdentiferString}'`
        }else if(selectedAction === "Atlas"){
            var shelfString = `${shelfNumberParamID};${newItemPropertyValues.property1};`
            createItemQuery = `EXECUTE sp_SaveParams ${userID}, 'Recipe', '${actionParamID};${ParamIDs.AtlasActionTypeParamValue};${itemParamID};${newItemPropertyValues.itemName};${shelfString}${enabledStatusString}${itemIdentiferString}'`
        }else if(selectedAction === "Press"){
            var shelfString = `${shelfNumberParamID};${newItemPropertyValues.property1};`
            createItemQuery = `EXECUTE sp_SaveParams ${userID}, 'Recipe', '${actionParamID};${ParamIDs.PressActionTypeParamValue};${itemParamID};${newItemPropertyValues.itemName};${shelfString}${enabledStatusString}${itemIdentiferString}'`
        }else if(selectedAction === "Orientation"){
            var shelfString = `${shelfNumberParamID};${newItemPropertyValues.property1};`
            createItemQuery = `EXECUTE sp_SaveParams ${userID}, 'Recipe', '${actionParamID};${ParamIDs.OrientationActionTypeParamValue};${itemParamID};${newItemPropertyValues.itemName};${shelfString}${enabledStatusString}${itemIdentiferString}'`
        }else if(selectedAction === "Acknowledge"){
            var shelfString = `${shelfNumberParamID};${newItemPropertyValues.property1};`
            createItemQuery = `EXECUTE sp_SaveParams ${userID}, 'Recipe', '${actionParamID};${ParamIDs.AcknowledgeActionTypeParamValue};${itemParamID};${newItemPropertyValues.itemName};${shelfString}${enabledStatusString}${itemIdentiferString}'`
        }else if(selectedAction === "ProductType"){
            var shelfString = `${shelfNumberParamID};${newItemPropertyValues.property1};`
            createItemQuery = `EXECUTE sp_SaveParams ${userID}, 'Recipe', '${actionParamID};${ParamIDs.ProductTypeActionActionTypeParamValue};${itemParamID};${newItemPropertyValues.itemName};${shelfString}${enabledStatusString}${itemIdentiferString}'`
        }
        //Execute the query after it has been constructed.
        FetchQueries.executeQueryInDatabase(createItemQuery).then(result => {
            fetchItemsForAction(selectedAction)
            // Reset states after the save.
            setSearchPhrase("")
            setItemsUpdated(false)
            setSelectedItemRowIndex(-1)
            setNewItemPropertyValues({
                itemName: "",
                property1: "",
                property2: "",
                property3: "",
                property4: ""
            })
        }).catch(error => {
            setDisplayErrorPage(true)
        })
    }

    function clickHandlerSelectItemRow(event, itemIndex){
        // When a row is clicked, set the selectedItemRowIndex corresponding to the index of that row.
        if(!Permissions.editShelfSetUpValues[HelperFunctions.getAccessLevelFromLocalStorage()]){
            return;
        }
        setSelectedItemRowIndex(itemIndex)
    }

    function fieldEditChangeHandler(event, itemIdentifier, propertyName){
        // This single function handles the onChange events for all properties of items of all actions.
        setItemsUpdated(true)
        var newAllActionsItems = structuredClone(allActionsItems)
        var rowToUpdate = newAllActionsItems.filter(row => row['Name']['SetID'] === itemIdentifier)[0]
        if(propertyName !== "Status"){
            rowToUpdate[propertyName]['ParamValue'] = event.target.value
        }else{
            rowToUpdate['Status'] = !rowToUpdate['Status']
        }
        setAllActionsItems(newAllActionsItems)
    }

    function saveItemChangesInDatabase(){
        if(allActionsItems.length===0){
            console.log("Nothing to save")
            return;
        }
        // Get the UserID
        var userDetails = secureLocalStorage.getItem("UserDetails")
        // Extract just the setID which is the UserID in the query
        var userID = userDetails['SetID']
        // Define values for the saveparams SP
        const actionParamID = ParamIDs.ActionType
        const itemParamID = ParamIDs.ItemName
        const shelfNumberParamID = ParamIDs.ShelfNumber
        var createItemsQuery = ""
        // The string to disable the overridden items
        var disableItemString = `${ParamIDs.ItemActiveStatus};${ParamIDs.ItemDisabledParamValue};`
        if(selectedAction==="Expander"){
            // Add on the item property values
            allActionsItems.forEach((item, index) => {
                const uniqueIdentifier = item['uniqueItemIdentifier']['ParamValue']
                const itemIdentiferString = `${ParamIDs.ItemIdentifier};${parseInt(uniqueIdentifier)};`
                const xParamID = ParamIDs.ExpanderXCoord
                const yParamID = ParamIDs.ExpanderYCoord
                const zParamID = ParamIDs.ExpanderZCoord
                const orientationParamID = ParamIDs.ExpanderOrientation
                var xString = `${xParamID};${item['XCoord']['ParamValue']};`
                var yString = `${yParamID};${item['YCoord']['ParamValue']};`
                var zString = `${zParamID};${item['ZCoord']['ParamValue']};`
                var orientationString = `${orientationParamID};${item['orientation']['ParamValue']};`
                var StatusString = `${ParamIDs.ItemActiveStatus};${item['Status']?ParamIDs.ItemEnabledParamValue:ParamIDs.ItemDisabledParamValue};`
                var createItemQuery = `EXECUTE sp_SaveParams ${userID}, 'Recipe', '${actionParamID};${ParamIDs.ExpanderActionTypeParamValue};${itemParamID};${item['Name']['ParamValue']};${xString}${yString}${zString}${orientationString}${StatusString}${itemIdentiferString}'`
                // Update the original item and disable it
                // var disableOriginalItemQuery =`EXECUTE sp_SaveParams ${userID}, 'Recipe', '${actionParamID};${ParamIDs.ExpanderActionTypeParamValue};${itemParamID};${originalAllActionsItems[index]['Name']['ParamValue']};${xString}${yString}${zString}${orientationString}${disableItemString}'`
                // // It is important to disable first and then create the new item.
                // createItemsQuery += disableOriginalItemQuery
                createItemsQuery += createItemQuery

            })
        }else if(selectedAction ==="Kolver"){
            allActionsItems.forEach((item, index) => {
                const uniqueIdentifier = item['uniqueItemIdentifier']['ParamValue']
                const itemIdentiferString = `${ParamIDs.ItemIdentifier};${parseInt(uniqueIdentifier)};`
                var shelfString = `${shelfNumberParamID};${item['ShelfValue']['ParamValue']};`
                var StatusString = `${ParamIDs.ItemActiveStatus};${item['Status']?ParamIDs.ItemEnabledParamValue:ParamIDs.ItemDisabledParamValue};`
                var createItemQuery = `EXECUTE sp_SaveParams ${userID}, 'Recipe', '${actionParamID};${ParamIDs.KolverActionTypeParamValue};${itemParamID};${item['Name']['ParamValue']};${shelfString}${StatusString}${itemIdentiferString}'`
                // Update the original item and disable it
                // var disableOriginalItemQuery = `EXECUTE sp_SaveParams ${userID}, 'Recipe', '${actionParamID};${ParamIDs.KolverActionTypeParamValue};${itemParamID};${originalAllActionsItems[index]['Name']['ParamValue']};${shelfString}${disableItemString}'`
                // createItemsQuery += disableOriginalItemQuery
                createItemsQuery += createItemQuery
            })
        }else if(selectedAction ==="Atlas"){
            allActionsItems.forEach((item, index) => {
                const uniqueIdentifier = item['uniqueItemIdentifier']['ParamValue']
                const itemIdentiferString = `${ParamIDs.ItemIdentifier};${parseInt(uniqueIdentifier)};`
                var shelfString = `${shelfNumberParamID};${item['ShelfValue']['ParamValue']};`
                var StatusString = `${ParamIDs.ItemActiveStatus};${item['Status']?ParamIDs.ItemEnabledParamValue:ParamIDs.ItemDisabledParamValue};`
                // Create a new Item by using saveParams with the updated details
                var createItemQuery = `EXECUTE sp_SaveParams ${userID}, 'Recipe', '${actionParamID};${ParamIDs.AtlasActionTypeParamValue};${itemParamID};${item['Name']['ParamValue']};${shelfString}${StatusString}${itemIdentiferString}'`
                // Update the original item and disable it
                // var disableOriginalItemQuery = `EXECUTE sp_SaveParams ${userID}, 'Recipe', '${actionParamID};${ParamIDs.AtlasActionTypeParamValue};${itemParamID};${originalAllActionsItems[index]['Name']['ParamValue']};${shelfString}${disableItemString}'`
                // createItemsQuery += disableOriginalItemQuery
                createItemsQuery += createItemQuery
            })
        }else if(selectedAction ==="Press"){
            allActionsItems.forEach((item, index) => {
                const uniqueIdentifier = item['uniqueItemIdentifier']['ParamValue']
                const itemIdentiferString = `${ParamIDs.ItemIdentifier};${parseInt(uniqueIdentifier)};`
                var shelfString = `${shelfNumberParamID};${item['ShelfValue']['ParamValue']};`
                var StatusString = `${ParamIDs.ItemActiveStatus};${item['Status']?ParamIDs.ItemEnabledParamValue:ParamIDs.ItemDisabledParamValue};`
                var createItemQuery = `EXECUTE sp_SaveParams ${userID}, 'Recipe', '${actionParamID};${ParamIDs.PressActionTypeParamValue};${itemParamID};${item['Name']['ParamValue']};${shelfString}${StatusString}${itemIdentiferString}'`
                // Update the original item and disable it
                // var disableOriginalItemQuery =`EXECUTE sp_SaveParams ${userID}, 'Recipe', '${actionParamID};${ParamIDs.PressActionTypeParamValue};${itemParamID};${originalAllActionsItems[index]['Name']['ParamValue']};${shelfString}${disableItemString}'`
                // createItemsQuery += disableOriginalItemQuery
                createItemsQuery += createItemQuery

            })
        }else if(selectedAction === "ProductType"){
            console.log(allActionsItems)
            allActionsItems.forEach((item, index) => {
                const uniqueIdentifier = item['uniqueItemIdentifier']['ParamValue']
                const itemIdentiferString = `${ParamIDs.ItemIdentifier};${parseInt(uniqueIdentifier)};`
                var shelfString = `${shelfNumberParamID};${item['ShelfValue']['ParamValue']};`
                var StatusString = `${ParamIDs.ItemActiveStatus};${item['Status']?ParamIDs.ItemEnabledParamValue:ParamIDs.ItemDisabledParamValue};`
                var createItemQuery = `EXECUTE sp_SaveParams ${userID}, 'Recipe', '${actionParamID};${ParamIDs.ProductTypeActionActionTypeParamValue};${itemParamID};${item['Name']['ParamValue']};${shelfString}${StatusString}${itemIdentiferString}'`
                // Update the original item and disable it
                // var disableOriginalItemQuery =`EXECUTE sp_SaveParams ${userID}, 'Recipe', '${actionParamID};${ParamIDs.PressActionTypeParamValue};${itemParamID};${originalAllActionsItems[index]['Name']['ParamValue']};${shelfString}${disableItemString}'`
                // createItemsQuery += disableOriginalItemQuery
                createItemsQuery += createItemQuery

            })
        }else if(selectedAction ==="Pick"){
            allActionsItems.forEach((item, index) => {
                const uniqueIdentifier = item['uniqueItemIdentifier']['ParamValue']
                const itemIdentiferString = `${ParamIDs.ItemIdentifier};${parseInt(uniqueIdentifier)};`
                var shelfString = `${shelfNumberParamID};${item['ShelfValue']['ParamValue']};`
                var StatusString = `${ParamIDs.ItemActiveStatus};${item['Status']?ParamIDs.ItemEnabledParamValue:ParamIDs.ItemDisabledParamValue};`
                var createItemQuery = `EXECUTE sp_SaveParams ${userID}, 'Recipe', '${actionParamID};${ParamIDs.PickActionTypeParamValue};${itemParamID};${item['Name']['ParamValue']};${shelfString}${StatusString}${itemIdentiferString}'`
                // Update the original item and disable it
                // var disableOriginalItemQuery =`EXECUTE sp_SaveParams ${userID}, 'Recipe', '${actionParamID};${ParamIDs.PickActionTypeParamValue};${itemParamID};${originalAllActionsItems[index]['Name']['ParamValue']};${shelfString}${disableItemString}'`
                // createItemsQuery += disableOriginalItemQuery
                createItemsQuery += createItemQuery
            })
        }else if(selectedAction === "Orientation"){
            // No updates can be made to orientations
            allActionsItems.forEach((item, index) => {
                const uniqueIdentifier = item['uniqueItemIdentifier']['ParamValue']
                const itemIdentiferString = `${ParamIDs.ItemIdentifier};${parseInt(uniqueIdentifier)};`
                var shelfString = `${shelfNumberParamID};${item['ShelfValue']['ParamValue']};`
                var StatusString = `${ParamIDs.ItemActiveStatus};${item['Status']?ParamIDs.ItemEnabledParamValue:ParamIDs.ItemDisabledParamValue};`
                var createItemQuery = `EXECUTE sp_SaveParams ${userID}, 'Recipe', '${actionParamID};${ParamIDs.OrientationActionTypeParamValue};${itemParamID};${item['Name']['ParamValue']};${shelfString}${StatusString}${itemIdentiferString}'`
                createItemsQuery += createItemQuery
            })
        }else if(selectedAction === "Acknowledge"){
            allActionsItems.forEach((item, index) => {
                const uniqueIdentifier = item['uniqueItemIdentifier']['ParamValue']
                const itemIdentiferString = `${ParamIDs.ItemIdentifier};${parseInt(uniqueIdentifier)};`
                var shelfString = `${shelfNumberParamID};${item['ShelfValue']['ParamValue']};`
                var StatusString = `${ParamIDs.ItemActiveStatus};${item['Status']?ParamIDs.ItemEnabledParamValue:ParamIDs.ItemDisabledParamValue};`
                var createItemQuery = `EXECUTE sp_SaveParams ${userID}, 'Recipe', '${actionParamID};${ParamIDs.AcknowledgeActionTypeParamValue};${itemParamID};${item['Name']['ParamValue']};${shelfString}${StatusString}${itemIdentiferString}'`
                // Update the original item and disable it
                //var disableOriginalItemQuery =`EXECUTE sp_SaveParams ${userID}, 'Recipe', '${actionParamID};${ParamIDs.AcknowledgeActionTypeParamValue};${itemParamID};${originalAllActionsItems[index]['Name']['ParamValue']};${shelfString}${disableItemString}${itemIdentiferString}'`
                //createItemsQuery += disableOriginalItemQuery
                createItemsQuery += createItemQuery
            })
        }
        
        //Execute the query in the database.
        FetchQueries.executeQueryInDatabase(createItemsQuery).then(result => {
            fetchItemsForAction(selectedAction)
            setSearchPhrase("")
            setItemsUpdated(false)
            setSelectedItemRowIndex(-1)
        }).catch(error => {
            setDisplayErrorPage(true)
        })
        
        
        

    }


    function getTableRowsOfItems(){
        var rows
        // The structure of the row/table is different depending on the action. Mostly it is expander different compared to the rest.
        if(selectedAction === 'Expander'){
            rows = allActionsItems.filter(row => row['Name']['ParamValue'].includes(searchPhrase) && (showDisabledItems || row['Status'])).map((item, itemIndex) => (
                <tr key={itemIndex} className={`ActionShelfSetupRow ${itemIndex%2===1?"EvenActionShelfSetupRow":"OddActionShelfSetupRow"} ItemRow`} onClick={(event) => clickHandlerSelectItemRow(event, itemIndex)}>
                    <td>
                        {
                            itemIndex===selectedItemRowIndex?
                                <input type={"text"} value={item['Name']['ParamValue']} className={"EditInputField"} onChange={(event) => fieldEditChangeHandler(event, item['Name']['SetID'], "Name")}/>
                                :
                                <label>{item['Name']['ParamValue']}</label>
                        }
                    </td>
                    <td>
                        {
                            item['XCoord'] && // Error if this condition isn't included. Ensure it's not null
                            (
                                itemIndex!==selectedItemRowIndex?
                                    <label>{item['XCoord']['ParamValue']}</label>:
                                    <input type={"number"} value={item['XCoord']['ParamValue']} className={"EditInputField"} onChange={(event) => fieldEditChangeHandler(event, item['Name']['SetID'], "XCoord")}/>
                            )
                        }
                    </td>
                    <td>
                        {
                            item['YCoord'] &&
                            (
                                itemIndex!==selectedItemRowIndex?
                                    <label>{item['YCoord']['ParamValue']}</label>:
                                    <input type={"number"} value={item['YCoord']['ParamValue']} className={"EditInputField"} onChange={(event) => fieldEditChangeHandler(event, item['Name']['SetID'], "YCoord")}/>
                            )
                        }
                    </td>
                    <td>
                        {
                            item['ZCoord'] &&
                            (
                                itemIndex!==selectedItemRowIndex?
                                    <label>{item['ZCoord']['ParamValue']}</label>:
                                    <input type={"number"} value={item['ZCoord']['ParamValue']} className={"EditInputField"} onChange={(event) => fieldEditChangeHandler(event, item['Name']['SetID'], "ZCoord")}/>
                            )
                        }
                    </td>
                    <td>
                        {
                            item['orientation'] &&
                            (
                                // <label>{item['orientation']['ParamValue']}</label>
                                <label>{orientationOptions.filter(row => row['uniqueItemIdentifier']['ParamValue'] === item['orientation']['ParamValue'])[0]['ShelfValue']['ParamValue']}</label>
                            )
                        }
                    </td>
                    <td>
                        {
                            <input type={"checkbox"} checked={item['Status']} disabled={itemIndex!==selectedItemRowIndex} onChange={(event) => fieldEditChangeHandler(event, item['Name']['SetID'], "Status")}/>
                        }
                    </td>
                </tr>
            ))
        }else if(selectedAction === "Pick" || selectedAction === "Kolver" || selectedAction === "Atlas" || selectedAction === "Press" || selectedAction === "Orientation" || selectedAction === "Acknowledge" || selectedAction === "ProductType"){
            rows = allActionsItems.filter(row => row['Name']['ParamValue'].includes(searchPhrase) && (showDisabledItems || row['Status'])).map((item, itemIndex) => (
                <tr key={itemIndex} className={`ActionShelfSetupRow ${itemIndex%2===1?"EvenActionShelfSetupRow":"OddActionShelfSetupRow"} ItemRow`} onClick={(event) => clickHandlerSelectItemRow(event, itemIndex)}>
                    <td>
                        {
                            itemIndex===selectedItemRowIndex
                            // &&
                            // selectedAction!=="Orientation"
                                ?
                                <input type={"text"} value={item['Name']['ParamValue']} className={"EditInputField"} onChange={(event) => fieldEditChangeHandler(event, item['Name']['SetID'], "Name")}/>
                                :
                                <label>{item['Name']['ParamValue']}</label>
                        }
                    </td>
                    <td>
                        {
                            item['ShelfValue'] &&
                            (
                                itemIndex===selectedItemRowIndex
                                // &&
                                // selectedAction!=="Orientation"
                                    ?
                                    <input type={"number"} value={item['ShelfValue']['ParamValue']} className={"EditInputField"} onChange={(event) => fieldEditChangeHandler(event, item['Name']['SetID'], "ShelfValue")}/>
                                    :
                                    <label>{item['ShelfValue']['ParamValue']}</label>

                            )
                        }
                    </td>
                    <td>
                        {
                            <input type={"checkbox"} checked={item['Status']} disabled={itemIndex!==selectedItemRowIndex || selectedAction==="Orientation"} onChange={(event) => fieldEditChangeHandler(event, item['Name']['SetID'], "Status")}/>
                        }
                    </td>
                </tr>
            ))
        }
        return rows
    }

    if(displayErrorPage){
        return <ErrorPage parentPageIsLogin={false} setDisplayErrorPage={setDisplayErrorPage}/>
    }else if(dataIsLoading){
        return (
            <div>data is loading</div>
        )
    }else{
        return (
            <div id={"ShelfSetupPageMainDiv"}>
                <TopBar IsLoggedIn={true} ParentPage={"ShelfSetupPage"}/>
                <div id={"ActionsItemsSetUpDiv"}>
                    <div id={"ShelfSetUpTitleDiv"}>
                        <center>
                            <label>Setup</label>
                        </center>
                    </div>
                    <div id={"ActionSelectionDiv"}>
                        <select value={selectedAction} onChange={changeHandlerActionSelection}>
                            {
                                allPossibleActions.map((row, index) => (
                                    <option key={index}>{row['Action']}</option>
                                ))
                            }
                        </select>
                        <div id={"ItemSearchDiv"}>
                            <FontAwesomeIcon id={"SearchIcon"} icon={faSearch}/>
                            <input value={searchPhrase} onChange={(event) => changeHandlerSearchPhrase(event)}/>
                        </div>
                        <div id={"SaveChangesDiv"}>
                            <button
                                onClick={saveItemChangesInDatabase}
                                disabled={
                                // selectedAction==="Orientation" ||
                                    !Permissions.editShelfSetUpValues[HelperFunctions.getAccessLevelFromLocalStorage()]}>
                                Save changes
                            </button>
                        </div>
                        <div id={"ShowDisabledItemsDiv"}>
                            <input type={"checkbox"} checked={showDisabledItems} onChange={() => {
                                setShowDisabledItems(!showDisabledItems)
                                setSelectedItemRowIndex(-1)
                            }}/>
                            Show Disabled Items
                        </div>
                    </div>
                    <div id={"ActionsItemsDisplayDiv"}>
                        <table id={"ActionsItemsDisplayTable"}>
                            <thead>
                                <tr id={"ActionsItemsDisplayTableHeadersRow"}>
                                    <th>Item Name</th>
                                    {
                                        itemProperties.map((property, index) => (
                                            <th key={index}>{property}</th>
                                        ))
                                    }
                                </tr>
                            </thead>
                            <tbody>
                                {/*
                                This entire row is just about creating new items
                                */}
                                <tr id={"CreateItemRow"} className={"EvenActionShelfSetupRow"}>
                                    <td>
                                        <button id={"CreateItemButton"} onClick={clickHandlerCreateNewItem} disabled={!Permissions.editShelfSetUpValues[HelperFunctions.getAccessLevelFromLocalStorage()]}>
                                            <FontAwesomeIcon icon={faAdd}/>
                                        </button>
                                        <input
                                            type={"text"}
                                            onChange={(event) => changeHandlerNewItemPropertyValues(event, 0)}
                                            value={newItemPropertyValues['itemName']}
                                            disabled={!Permissions.editShelfSetUpValues[HelperFunctions.getAccessLevelFromLocalStorage()]}
                                        />
                                    </td>
                                    {
                                        itemProperties.map((property, propertyIndex) => (
                                            selectedAction === "Expander"?
                                                propertyIndex < itemProperties.length -2 &&
                                                <td key={propertyIndex}>
                                                    <input
                                                        className={"SetupInputField"}
                                                        type={"number"}
                                                        onChange={(event) => changeHandlerNewItemPropertyValues(event, 1+ propertyIndex)}
                                                        value={newItemPropertyValues['property' + (1+propertyIndex)]}
                                                        disabled={!Permissions.editShelfSetUpValues[HelperFunctions.getAccessLevelFromLocalStorage()]}
                                                    />
                                                </td>
                                                :
                                                propertyIndex < itemProperties.length -1 &&
                                                <td key={propertyIndex}>
                                                    <input
                                                        className={"SetupInputField"}
                                                        type={"number"}
                                                        onChange={(event) => changeHandlerNewItemPropertyValues(event, 1+ propertyIndex)}
                                                        value={newItemPropertyValues['property' + (1+propertyIndex)]}
                                                        disabled={!Permissions.editShelfSetUpValues[HelperFunctions.getAccessLevelFromLocalStorage()]}
                                                    />
                                                </td>


                                        ))
                                    }
                                    {
                                        selectedAction === "Expander" &&
                                        <td>
                                            <select
                                                value={newItemPropertyValues.property4}
                                                onChange={(event) => changeHandlerNewlySelectedOrientation(event)}
                                                disabled={!Permissions.editShelfSetUpValues[HelperFunctions.getAccessLevelFromLocalStorage()]}>
                                                <option>Select Angle</option>
                                                {
                                                    orientationOptions.map((orientation, orientationIndex) => (
                                                        <option key={orientationIndex}>{orientation['Name']['ParamValue']}</option>
                                                    ))
                                                }
                                            </select>
                                        </td>
                                    }
                                    {/*TODO Implement the onChange property*/}
                                    {/* Might leave it as true by default because the user shouldn't be able to create a disabled item */}
                                    <td>
                                        <input type={"checkbox"} disabled={true} checked={true} onChange={() => {}}/>
                                    </td>


                                </tr>
                                {/*
                                The following function gets all the items of the action.
                                */}
                                {getTableRowsOfItems()}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        )
    }
}

export default ShelfSetupPage