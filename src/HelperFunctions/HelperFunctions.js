class HelperFunctions{
    static ProcessFetchedData(fetchedData){
        var listOfStepsData = []
        var stepsData = fetchedData[0]
        var subStepsData = fetchedData[1]
        // First construct the steps
        // Get the unique stepNumbers
        var uniqueStepNumbers = new Set()
        stepsData.forEach(row => uniqueStepNumbers.add(row['StepNumber']))
        uniqueStepNumbers = Array.from(uniqueStepNumbers)
        uniqueStepNumbers = uniqueStepNumbers.sort()

        // For every stepNumber, filter the list and locate each attribute like image1, image2, name, instructions, etc
        uniqueStepNumbers.forEach(uniqueStepNumber => {
            // First find the step data for just the relevant step number
            var relevantStepData = stepsData.filter(row => row['StepNumber']===uniqueStepNumber)
            // find the name of the step
            // Step name has a ParamID of 35007
            var stepNameData = relevantStepData.filter(row => row['ParamID']===35007)[0]
            // Step Instructions has a ParamID of 35003
            var stepInstructionsData = relevantStepData.filter(row => row['ParamID'] === 35003)[0]
            // Image1 has a ParamID of 35001
            var stepImage1Data = relevantStepData.filter(row => row['ParamID'] === 35001)[0]
            // Image2 has a ParamID of 35002
            var stepImage2Data = relevantStepData.filter(row => row['ParamID'] === 35002)[0]

            // Process sub step data for each step
            var stepSetID = stepNameData['StepSetID']
            var relevantSubStepData = subStepsData.filter(row => row['StepSetID'] === stepSetID)
            // Get the unique subStepSetIDs for this step
            var uniqueSubStepNumbers = new Set()
            relevantSubStepData.forEach(row => uniqueSubStepNumbers.add(row['SubStepNumber']))
            // Sort the set of unique sub step IDs
            // Have to convert to an array first
            uniqueSubStepNumbers = Array.from(uniqueSubStepNumbers)
            uniqueSubStepNumbers = uniqueSubStepNumbers.sort()

            var listOfSubSteps = []
            //Loop through the sub step IDs for this particular step
            uniqueSubStepNumbers.forEach(subStepNumber => {
                // Extract the Sub step name, Action and Item for every sub step in this tep
                // Sub step name ParamID = 35007
                var subStepNameData = relevantSubStepData.filter(row => row['ParamID'] === 35007 && row['SubStepNumber'] === subStepNumber)[0]
                // Sub step Action ParamID = 35004
                var subStepActionData = relevantSubStepData.filter(row => row['ParamID'] === 35004 && row['SubStepNumber'] === subStepNumber)[0]
                // Sub step Item ParamID = 35005
                var subStepItemData = relevantSubStepData.filter(row => row['ParamID'] === 35005 && row['SubStepNumber'] === subStepNumber)[0]

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


}

export default HelperFunctions