import {baseURL} from "../Constants";

class FetchQueries{
    static async queryData(url, options = {}) {
        try {
            const response = await fetch(url, options);
            if (!response.ok) {
                throw new Error('Fetch request failed');
            }
            return await response.json();
        } catch (error) {
            // You can handle error states or throw an error as per your project's requirements
            throw error
        }
    }

    static executeQueryInDatabase(query){
        var url = `${baseURL}api/Main/ExecuteRawQueryFromBody`
        var requestBody = {
            query: query
        }
        var requestOptions = {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': '*',
                'Access-Control-Allow-Headers': '*'
            },
            body: JSON.stringify(requestBody)
        }
        return this.queryData(url, requestOptions)
    }


    static getListOfRecipes(){
        var query = 'EXEC [dbo].[sp_GetListOfRecipes]'
        return this.executeQueryInDatabase(query)
    }

    static loginGetUserID(userName, password){
        var query = `EXEC [dbo].[sp_UserLogin] '${userName}', '${password}'`
        return this.executeQueryInDatabase(query)
    }

    static getStepsAndSubStepsOfRecipe(selectedRecipeID){
        var query = `EXEC [dbo].[sp_GetStepsAndSubStepsOnRecipeSetID] @selectedRecipeSetID = ${selectedRecipeID}`
        return this.executeQueryInDatabase(query)
    }

    static getListOfUsersDetails(){
        var query = "EXEC [dbo].[sp_GetListOfUserDetails]"
        return this.executeQueryInDatabase(query)
    }

    static executeGetActionOptions(){
        var query = "EXEC [dbo].[sp_GetDropDownListV3]"
        return this.executeQueryInDatabase(query)
    }

    static async executeGetItemsForEachAction(actions){
        var itemsAndActions = []
        var actionsClone = structuredClone(actions)
        // Base stored procedure name. Add paramters to the stored procedure later
        var baseStoredProcedureString =  "EXECUTE [dbo].[sp_GetDropDownListV3]"
        for (let i = 0; i < actionsClone.length; i++) {
            var action = actionsClone[i]
            var storedProcedure = `${baseStoredProcedureString} ${action['Action']}`
            var items = await this.executeQueryInDatabase(storedProcedure)
            var set = {
                Action: action['Action'],
                Items: items[0]
            }
            itemsAndActions.push(set)
        }
        return itemsAndActions
    }

    static async executeFetchItemShelfDataForAction(action){
        var query = `EXECUTE [dbo].[sp_GetItemsShelfValues] '${action}'`
        return await this.executeQueryInDatabase(query)
    }

    static async executeGetItemStatus(actionName, itemName){
        var query = `EXECUTE [dbo].[sp_GetItemActiveStatusOnName] @action = '${actionName}', @itemName = '${itemName}'`
        return await this.executeQueryInDatabase(query)
    }


}

export default FetchQueries