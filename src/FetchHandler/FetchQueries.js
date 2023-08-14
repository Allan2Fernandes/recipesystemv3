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
            console.log('Error:', error);
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


    static GetListOfRecipes(){
        var query = 'EXEC [dbo].[sp_GetListOfRecipes]'
        return this.executeQueryInDatabase(query)
    }

    static loginGetUserID(userName, password){
        var query = `EXEC [dbo].[sp_UserLogin] '${userName}', '${password}'`
        return this.executeQueryInDatabase(query)
    }
}

export default FetchQueries