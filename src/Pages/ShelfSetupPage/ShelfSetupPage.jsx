import "./ShelfSetupPage.css"
import TopBar from "../../SharedComponents/TopBar/TopBar";
import {useEffect, useState} from "react";
import FetchQueries from "../../FetchHandler/FetchQueries";
import ErrorPage from "../../ErrorHandling/ErrorPage";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faAdd, faSearch} from "@fortawesome/free-solid-svg-icons";
import secureLocalStorage from "react-secure-storage";
import HelperFunctions from "../../HelperFunctions/HelperFunctions";
import {ParamIDs} from "../../Constants";

function ShelfSetupPage(){
    const [allPossibleActions, setAllPossibleActions] = useState([])
    const [allActionsItems, setAllActionsItems] = useState([])
    const [displayErrorPage, setDisplayErrorPage] = useState(false)
    const [selectedAction, setSelectedAction] = useState("")
    const [itemProperties, setItemProperties] = useState([])
    const [newItemPropertyValues, setNewItemPropertyValues] = useState({
        itemName: "",
        property1: "",
        property2: "",
        property3: "",
        property4: ""
    })
    const [dataIsLoading, setDataIsLoading] = useState(false)
    const [searchPhrase, setSearchPhrase] = useState("")
    const [orientationOptions, setOrientationOptions] = useState([])
    const [selectedItemRowIndex, setSelectedItemRowIndex] = useState(-1)
    const [itemsUpdated, setItemsUpdated] = useState(false)

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
    useEffect(() => {
        fetchItemsForAction(selectedAction)
        fetchOrientationOptions()
        setSelectedItemRowIndex(-1)
        setItemsUpdated(false)
        console.log(allActionsItems)
    },  [selectedAction])

    async function fetchItemsForAction(action){
        setDataIsLoading(true)
        // Construct the query
        var query = `EXECUTE [dbo].[sp_GetItemsShelfValues] '${action}'`
        // Execute the query and get the returned data
        FetchQueries.executeQueryInDatabase(query).then(result => {
            // Pre-process the result
            var processedData = HelperFunctions.processFetchedShelfValuesData(result, action)
            setAllActionsItems(processedData)
        })
            .then(result => setDataIsLoading(false))
            .catch(error => setDisplayErrorPage(true))
    }

    async function fetchOrientationOptions(){
        var action = "Orientation"
        var query = `EXECUTE [dbo].[sp_GetItemsShelfValues] '${action}'`

        FetchQueries.executeQueryInDatabase(query).then(result => {
            // Pre-process the result
            var processedData = HelperFunctions.processFetchedShelfValuesData(result, action)
            setOrientationOptions(processedData)
        })
            .catch(error => setDisplayErrorPage(true))
    }

    function setItemPropertiesOnAction(action){
        if(action === "Expander"){
            setItemProperties(["X", "Y", "Z", "Orientation"])
        }else if(action === "Pick"){
            setItemProperties(["Shelf Number"])
        }else if(action === "Kolver" || action === "Atlas" || action === "Press"){
            setItemProperties(["Program Number"])
        }else if(action === "Orientation"){
            setItemProperties(["Value"])
        }
    }

    async function fetchActions(){
        var actionsData = await FetchQueries.executeGetActionOptions().catch(e => setDisplayErrorPage(true))
        setAllPossibleActions(actionsData[0])
        var selectedDefaultAction = actionsData[0][0]['Action']
        setSelectedAction(selectedDefaultAction)
        setItemPropertiesOnAction(selectedDefaultAction)
        await fetchItemsForAction(selectedDefaultAction)
    }

    function changeHandlerActionSelection(event){
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
        var currentNewItemPropertyValues = structuredClone(newItemPropertyValues)
        if(itemIndex===0){
            currentNewItemPropertyValues['itemName'] = event.target.value
        }else{
            currentNewItemPropertyValues['property' + (itemIndex)] = event.target.value
        }
        setNewItemPropertyValues(currentNewItemPropertyValues)
    }

    function changeHandlerSearchPhrase(event){
        setSearchPhrase(event.target.value)
    }

    function changeHandlerNewlySelectedOrientation(event){
        var newItemPropertyValuesClone = structuredClone(newItemPropertyValues)
        newItemPropertyValuesClone.property4 = event.target.value
        setNewItemPropertyValues(newItemPropertyValuesClone)
    }

    async function clickHandlerCreateNewItem(){
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
        }else if(selectedAction==="Orientation" || selectedAction ==="Pick" || selectedAction ==="Kolver" || selectedAction ==="Atlas" || selectedAction ==="Press"){
            if(newItemPropertyValues.itemName ===""){
                console.log("Item name not specified")
                return
            }
            if(newItemPropertyValues.property1 ===""){
                console.log("Item value not specified")
                return
            }
        }
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
        if(selectedAction === "Expander"){
            // Add on the item property values
            const xParamID = ParamIDs.ExpanderXCoord
            const yParamID = ParamIDs.ExpanderYCoord
            const zParamID = ParamIDs.ExpanderZCoord
            const orientationParamID = ParamIDs.ExpanderOrientation
            var xString = `${xParamID};${newItemPropertyValues.property1};`
            var yString = `${yParamID};${newItemPropertyValues.property2};`
            var zString = `${zParamID};${newItemPropertyValues.property3};`
            var orientationString = `${orientationParamID};${orientationOptions.filter(row => row['Name']['ParamValue'] === newItemPropertyValues.property4)[0]['ShelfValue']['ParamValue']}`

            createItemQuery = `EXECUTE sp_SaveParams ${userID}, 'Recipe', '${actionParamID};${ParamIDs.ExpanderActionTypeParamValue};${itemParamID};${newItemPropertyValues.itemName};${xString}${yString}${zString}${orientationString}'`
        }else if(selectedAction === "Pick"){
            var shelfString = `${shelfNumberParamID};${newItemPropertyValues.property1};`
            createItemQuery = `EXECUTE sp_SaveParams ${userID}, 'Recipe', '${actionParamID};${ParamIDs.PickActionTypeParamValue};${itemParamID};${newItemPropertyValues.itemName};${shelfString}'`
        }else if(selectedAction === "Kolver"){
            var shelfString = `${shelfNumberParamID};${newItemPropertyValues.property1};`
            createItemQuery = `EXECUTE sp_SaveParams ${userID}, 'Recipe', '${actionParamID};${ParamIDs.KolverActionTypeParamValue};${itemParamID};${newItemPropertyValues.itemName};${shelfString}'`
        }else if(selectedAction === "Atlas"){
            var shelfString = `${shelfNumberParamID};${newItemPropertyValues.property1};`
            createItemQuery = `EXECUTE sp_SaveParams ${userID}, 'Recipe', '${actionParamID};${ParamIDs.AtlasActionTypeParamValue};${itemParamID};${newItemPropertyValues.itemName};${shelfString}'`
        }else if(selectedAction === "Press"){
            var shelfString = `${shelfNumberParamID};${newItemPropertyValues.property1};`
            createItemQuery = `EXECUTE sp_SaveParams ${userID}, 'Recipe', '${actionParamID};${ParamIDs.PressActionTypeParamValue};${itemParamID};${newItemPropertyValues.itemName};${shelfString}'`
        }else if(selectedAction === "Orientation"){
            var shelfString = `${shelfNumberParamID};${newItemPropertyValues.property1};`
            createItemQuery = `EXECUTE sp_SaveParams ${userID}, 'Recipe', '${actionParamID};${ParamIDs.OrientationActionTypeParamValue};${itemParamID};${newItemPropertyValues.itemName};${shelfString}'`
        }
        console.log(createItemQuery)
        FetchQueries.executeQueryInDatabase(createItemQuery).then(result => {
            fetchItemsForAction(selectedAction)
            setSearchPhrase("")
            setItemsUpdated(false)
            setSelectedItemRowIndex(-1)
        }).catch(error => {
            setDisplayErrorPage(true)
        })
    }

    function clickHandlerSelectItemRow(event, itemIndex){
        setSelectedItemRowIndex(itemIndex)
    }

    function fieldEditChangeHandler(event, itemIndex, propertyName){
        setItemsUpdated(true)
        var newAllActionsItems = structuredClone(allActionsItems)
        newAllActionsItems[itemIndex][propertyName]['ParamValue'] = event.target.value
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
        if(selectedAction==="Expander"){
            // Add on the item property values
            allActionsItems.forEach(item => {
                const xParamID = ParamIDs.ExpanderXCoord
                const yParamID = ParamIDs.ExpanderYCoord
                const zParamID = ParamIDs.ExpanderZCoord
                const orientationParamID = ParamIDs.ExpanderOrientation
                var xString = `${xParamID};${item['XCoord']['ParamValue']};`
                var yString = `${yParamID};${item['YCoord']['ParamValue']};`
                var zString = `${zParamID};${item['ZCoord']['ParamValue']};`
                var orientationString = `${orientationParamID};${item['orientation']['ParamValue']}`
                var createItemQuery = `EXECUTE sp_SaveParams ${userID}, 'Recipe', '${actionParamID};${ParamIDs.ExpanderActionTypeParamValue};${itemParamID};${item['Name']['ParamValue']};${xString}${yString}${zString}${orientationString}'`
                createItemsQuery += createItemQuery
            })
        }else if(selectedAction ==="Kolver"){
            allActionsItems.forEach(item => {
                var shelfString = `${shelfNumberParamID};${item['ShelfValue']['ParamValue']};`
                var createItemQuery = `EXECUTE sp_SaveParams ${userID}, 'Recipe', '${actionParamID};${ParamIDs.KolverActionTypeParamValue};${itemParamID};${item['Name']['ParamValue']};${shelfString}'`
                createItemsQuery += createItemQuery
            })
        }else if(selectedAction ==="Atlas"){
            allActionsItems.forEach(item => {
                var shelfString = `${shelfNumberParamID};${item['ShelfValue']['ParamValue']};`
                var createItemQuery = `EXECUTE sp_SaveParams ${userID}, 'Recipe', '${actionParamID};${ParamIDs.AtlasActionTypeParamValue};${itemParamID};${item['Name']['ParamValue']};${shelfString}'`
                createItemsQuery += createItemQuery
            })
        }else if(selectedAction ==="Press"){
            allActionsItems.forEach(item => {
                var shelfString = `${shelfNumberParamID};${item['ShelfValue']['ParamValue']};`
                var createItemQuery = `EXECUTE sp_SaveParams ${userID}, 'Recipe', '${actionParamID};${ParamIDs.PressActionTypeParamValue};${itemParamID};${item['Name']['ParamValue']};${shelfString}'`
                createItemsQuery += createItemQuery
            })
        }else if(selectedAction ==="Pick"){
            allActionsItems.forEach(item => {
                var shelfString = `${shelfNumberParamID};${item['ShelfValue']['ParamValue']};`
                var createItemQuery = `EXECUTE sp_SaveParams ${userID}, 'Recipe', '${actionParamID};${ParamIDs.PickActionTypeParamValue};${itemParamID};${item['Name']['ParamValue']};${shelfString}'`
                createItemsQuery += createItemQuery
            })
        }else if(selectedAction === "Orientation"){
            return
        }
        console.log(createItemsQuery)
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
        var row
        if(selectedAction === 'Expander'){
            row = allActionsItems.filter(row => row['Name']['ParamValue'].includes(searchPhrase)).map((item, itemIndex) => (
                <tr key={itemIndex} className={`ActionShelfSetupRow ${itemIndex%2===1?"EvenActionShelfSetupRow":"OddActionShelfSetupRow"} ItemRow`} onClick={(event) => clickHandlerSelectItemRow(event, itemIndex)}>
                    <td>
                        {
                            <label>{item['Name']['ParamValue']}</label>
                        }
                    </td>
                    <td>
                        {
                            item['XCoord'] && // Error if this condition isn't included. Ensure it's not null
                            (
                                itemIndex!==selectedItemRowIndex?
                                    <label>{item['XCoord']['ParamValue']}</label>:
                                    <input type={"number"} value={item['XCoord']['ParamValue']} className={"EditInputField"} onChange={(event) => fieldEditChangeHandler(event, itemIndex, "XCoord")}/>
                            )
                        }
                    </td>
                    <td>
                        {
                            item['YCoord'] &&
                            (
                                itemIndex!==selectedItemRowIndex?
                                    <label>{item['YCoord']['ParamValue']}</label>:
                                    <input type={"number"} value={item['YCoord']['ParamValue']} className={"EditInputField"} onChange={(event) => fieldEditChangeHandler(event, itemIndex, "YCoord")}/>
                            )
                        }
                    </td>
                    <td>
                        {
                            item['ZCoord'] &&
                            (
                                itemIndex!==selectedItemRowIndex?
                                    <label>{item['ZCoord']['ParamValue']}</label>:
                                    <input type={"number"} value={item['ZCoord']['ParamValue']} className={"EditInputField"} onChange={(event) => fieldEditChangeHandler(event, itemIndex, "ZCoord")}/>
                            )
                        }
                    </td>
                    <td>
                        {
                            item['orientation'] &&
                            (
                                <label>{item['orientation']['ParamValue']}</label>
                            )
                        }
                    </td>
                </tr>
            ))
        }else if(selectedAction === "Pick" || selectedAction === "Kolver" || selectedAction === "Atlas" || selectedAction === "Press" || selectedAction === "Orientation"){
            row = allActionsItems.filter(row => row['Name']['ParamValue'].includes(searchPhrase)).map((item, itemIndex) => (
                <tr key={itemIndex} className={`ActionShelfSetupRow ${itemIndex%2===1?"EvenActionShelfSetupRow":"OddActionShelfSetupRow"} ItemRow`} onClick={(event) => clickHandlerSelectItemRow(event, itemIndex)}>
                    <td>
                        {
                            item['Name']['ParamValue']
                        }
                    </td>
                    <td>
                        {
                            item['ShelfValue'] &&
                            (
                                itemIndex===selectedItemRowIndex&&selectedAction!=="Orientation"?
                                    <input type={"number"} value={item['ShelfValue']['ParamValue']} className={"EditInputField"} onChange={(event) => fieldEditChangeHandler(event, itemIndex, "ShelfValue")}/>:
                                    <label>{item['ShelfValue']['ParamValue']}</label>

                            )
                        }
                    </td>
                </tr>
            ))
        }
        return row
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
                            <button onClick={saveItemChangesInDatabase} disabled={selectedAction==="Orientation"}>Save changes</button>
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
                                <tr id={"CreateItemRow"} className={"EvenActionShelfSetupRow"}>
                                    <td>
                                        <button id={"CreateItemButton"} onClick={clickHandlerCreateNewItem}>
                                            <FontAwesomeIcon icon={faAdd}/>
                                        </button>
                                        <input type={"text"} onChange={(event) => changeHandlerNewItemPropertyValues(event, 0)} value={newItemPropertyValues['itemName']}/>
                                    </td>
                                    {
                                        itemProperties.map((property, propertyIndex) => (
                                            selectedAction === "Expander"?propertyIndex < itemProperties.length -1 &&
                                                <td key={propertyIndex}>
                                                    <input
                                                        className={"SetupInputField"}
                                                        type={"number"}
                                                        onChange={(event) => changeHandlerNewItemPropertyValues(event, 1+ propertyIndex)}
                                                        value={newItemPropertyValues['property' + (1+propertyIndex)]}
                                                    />
                                                </td>:
                                                <td key={propertyIndex}>
                                                    <input
                                                        className={"SetupInputField"}
                                                        type={"number"}
                                                        onChange={(event) => changeHandlerNewItemPropertyValues(event, 1+ propertyIndex)}
                                                        value={newItemPropertyValues['property' + (1+propertyIndex)]}
                                                    />
                                                </td>


                                        ))
                                    }
                                    {
                                        selectedAction === "Expander" &&
                                        <td>
                                            <select value={newItemPropertyValues.property4} onChange={(event) => changeHandlerNewlySelectedOrientation(event)}>
                                                <option>Select Angle</option>
                                                {
                                                    orientationOptions.map((orientation, orientationIndex) => (
                                                        <option key={orientationIndex}>{orientation['Name']['ParamValue']}</option>
                                                    ))
                                                }
                                            </select>
                                        </td>
                                    }

                                </tr>
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