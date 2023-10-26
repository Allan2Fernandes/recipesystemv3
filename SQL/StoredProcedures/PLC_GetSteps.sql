USE [GO_PVG32BLOCK]
GO

/****** Object:  StoredProcedure [dbo].[PLC_GetSteps]    Script Date: 26-10-2023 08:13:22 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO



/* =============================================
Changed:		2023-09-08 AJO First version, based on Allan's sp_GetStepsAndSubStepsOnRecipeSetID and sp_GetItemsShelfValues
Description:    Get a Set of Value's to PLC from Recipe
                Returned DataSet is based on filters given as input.
                Input can be multiple pairs containing ParamID and ParamValue.
                ParamID tells which parameter to search for and ParamValue is the search string.
				Returned data must be a pair of ParamID, ParamValue, each datatype in its own resultset, and cast data to the right datatype for PLCSQL ParamID ranges
Example:        EXEC PLC_GetSteps @tstring,@debug
				EXEC PLC_GetSteps '30001;157B6000'
				EXEC PLC_GetSteps '30001;157B6000',1
				EXEC PLC_GetSteps '30001;11008852'
=============================================
*/
CREATE PROCEDURE [dbo].[PLC_GetSteps]
	@tstring VARCHAR(250)
	,@debug INT=0 --Set to true to show additional data
	AS
BEGIN
SET NOCOUNT ON

DECLARE @ParamID NVARCHAR(MAX)
DECLARE @ParamValue NVARCHAR(MAX)
DECLARE @selectedRecipeSetID INT

--WHILE LEN( @tstring ) > 0 BEGIN 
	--Find ParamID in first part of Where Pair
	SELECT @ParamID = ExtractedValue, @tstring = RestString FROM dbo.ufn_StringEater(@tstring)

	--Find Search Criteria
	SELECT @ParamValue = ExtractedValue, @tstring = RestString FROM dbo.ufn_StringEater(@tstring)

	IF @debug=1 SELECT @ParamID,@ParamValue
--END	--END WHILE tstring

--Find SetID for the given recipe search
SELECT @selectedRecipeSetID=MAX(SetID) FROM Recipe_STRING WHERE ParamValue = @ParamValue AND ParamID=35006
		-- SetIDs of the steps and sub steps. The sub steps could connect to recipes
		DECLARE @list1 TABLE (
			SetID INT
		);
		INSERT INTO @list1 (SetID)
		SELECT SetID
		FROM Recipe_DINT
		WHERE ParamValue = @selectedRecipeSetID and ParamID = 15001;

		-- Filter the SetIDs to only get StepIds
		DECLARE @list2 TABLE (
			SetID INT
		);

		INSERT INTO @list2
		SELECT ri.SetID
		FROM Recipe_INT ri
		WHERE ri.SetID IN (SELECT l.SetID FROM @list1 l)
				AND ri.ParamID = 10002
				AND ri.ParamValue = 2;

		-- Get the steps in the correct order
		DECLARE @list3 TABLE (
			SetID INT,
			ParamID INT,
			ParamValue INT
		);

		INSERT INTO @list3
		SELECT *
		FROM Recipe_INT
		WHERE SetID IN (SELECT SetID FROM @list2)
				AND ParamID = 10003
		ORDER BY ParamValue;

		if @debug=1 select ParamID,ParamValue from @list3

		-- Declare a table variable to store the concatenated results
		DECLARE @ConcatenatedResults TABLE (
			SubStepSetID INT,
			ParamID INT,
			ParamValue NVARCHAR(255),
			MainStepNumber INT,
			SubStepNumber INT,
			StepSetID INT,
			RecipeSetID INT
		);

		DECLARE @SetID INT
		DECLARE stepCursor CURSOR FOR
		SELECT SetID, ParamValue FROM @list3
		OPEN stepCursor;
		FETCH NEXT FROM stepCursor INTO @SetID, @ParamValue
		WHILE @@FETCH_STATUS = 0
		BEGIN
			DECLARE @selectedStepID INT = @SetID

			-- Get the list of set IDs which connect to step ID 29 whilst ALSO being a sub step
			DECLARE @list4 TABLE (
				SetID INT
			);

			INSERT INTO @list4 (SetID)
			SELECT SetID
			FROM Recipe_DINT
			WHERE ParamValue = @selectedStepID and ParamID = 15001;

			-- This is a list of steps and sub steps which connect to the selected step id. the selected step id could also be a recipe, so we have to filter it down to only sub steps
			DECLARE @list5 TABLE (
				SetID INT
			);
			INSERT INTO @list5
			SELECT ri.SetID
			FROM Recipe_INT ri
			WHERE ri.SetID IN (SELECT l.SetID FROM @list4 l)
					AND ri.ParamID = 10002
					AND ri.ParamValue = 3;


			-- Get the sub steps in the correct order
			DECLARE @list6 TABLE (
				SetID INT,
				ParamID INT,
				ParamValue INT
			);

			INSERT INTO @list6
			SELECT *
			FROM Recipe_INT
			WHERE SetID IN (SELECT SetID FROM @list5)
					AND ParamID = 10004
			ORDER BY ParamValue asc;

			INSERT INTO @ConcatenatedResults
			select T2.SetID as 'SubStepSetID',
				T2.ParamID,
				T2.ParamValue,
				T3.ParamValue as 'MainStepNumber',
				T1.ParamValue as 'SubStepNumber',
				@selectedStepID as 'StepSetID',
				@selectedRecipeSetID as 'RecipeSetID'
			from @list6 T1 inner join Recipe_STRING T2
			on T1.SetID = T2.SetID
			left join @list3 T3
				on @selectedStepID = T3.SetID
			order by MainStepNumber,SubStepNumber

			DELETE FROM @list4
			DELETE FROM @list5
			DELETE FROM @list6
			FETCH NEXT FROM stepCursor INTO @SetID, @ParamValue
		END
		CLOSE stepCursor
		DEALLOCATE stepCursor
		/*IF @Debug=1 SELECT T1.*,
		10002 as 'HeirarchyTypeParamID',
		3 as 'HeirarchyType',
		10004 as 'SubStepNumberParamID'
		from @ConcatenatedResults T1 ORDER BY StepSetID, SubStepNumber*/
		--IF @debug=1 select * from @ConcatenatedResults T1 WHERE ParamID=35004 ORDER BY StepSetID, SubStepNumber
		IF @debug=1 select * from @ConcatenatedResults T1 ORDER BY StepSetID, SubStepNumber
		--IF @debug=1 select ParamValue,SubStepNumber from @ConcatenatedResults T1 ORDER BY StepSetID, SubStepNumber
		
		--------------------PLC DATA BELOW:----------------------------------------------------------------------------------------------------
		IF @debug=1 SELECT 'list3',* FROM @list3
		IF @debug=1 SELECT '@ConcatenatedResults',* FROM @ConcatenatedResults ORDER BY MainStepNumber, SubStepNumber


		--Temp tables for parameter data to PLC
		DECLARE @PLC_Real TABLE (ParamID INT, ParamValue REAL)
		DECLARE @PLC_INT TABLE (ParamID INT, ParamValue smallint)
		DECLARE @PLC_DINT TABLE (ParamID INT, ParamValue INT)
		DECLARE @PLC_STRING TABLE (ParamID INT, ParamValue VARCHAR(254))
		
		DECLARE @MainStepNr INT=1
		DECLARE @SubStepNr INT=1
		DECLARE @TotalStepNr INT=0
		DECLARE @oldStepSetID INT
				
		--Loop through each step
		DECLARE stepCursor CURSOR FOR
		SELECT StepSetID, MainStepNumber,SubStepNumber, ParamValue FROM @ConcatenatedResults WHERE ParamID=35004 ORDER BY MainStepNumber, SubStepNumber
		OPEN stepCursor;
		FETCH NEXT FROM stepCursor INTO @SetID, @MainStepNr, @SubStepNr, @ParamValue
		WHILE @@FETCH_STATUS = 0
		BEGIN
		 --IF @oldStepSetID <> @SetID SET @MainStepNr=@MainStepNr+1
		 --SELECT @SetID,@ParamValue,ufn_GetSetupValue(@ParamValue)
		 IF @debug=1 SELECT dbo.ufn_GetSetupValue(@ParamValue) Action,@ParamValue
		 --IF @debug=1 SELECT @MainStepNr MainStepNr, @SubStepNr SubStep, @TotalStepNr TotalStep
		 
		 SET @ParamID=10001+(@TotalStepNr*10)
		 INSERT INTO @PLC_INT (ParamID,ParamValue) VALUES (@ParamID, dbo.ufn_GetSetupValue(@ParamValue)) --Action, ParamID 10001
		 
			--Lookup action detail (pick lamp number, tool number etc): (10002)
			SET @ParamID=@ParamID+1
			INSERT INTO @PLC_INT  (ParamID,ParamValue) VALUES 
			(@ParamID,
				(
					SELECT ParamValue FROM MergeTestParm WHERE ParamID=10005 AND  SetID --10005 is lamp number
					IN
					(SELECT MAX(SetID) FROM MergeTestParm WHERE SetID --Select newest
						IN
						(SELECT SetID FROM MergeTestParm WHERE ParamValue =  dbo.ufn_GetSetupValue(@ParamValue) and ParamID = 30004)
						AND ParamID = 30001 AND ParamValue=
						(
							SELECT ParamValue FROM Recipe_STRING WHERE ParamID=30001 AND SetID =
								(
									SELECT MAX(SetID) FROM Recipe_INT WHERE ParamID=10006 AND ParamValue=(SELECT ParamValue FROM @ConcatenatedResults WHERE StepSetID=@SetID AND SubStepNumber=@SubStepNr AND ParamID=35005)
								)
						) --Action type			
					)
				)
			)

		  --SELECT ParamValue FROM MergeTestParm WHERE ParamID=10005 
		  --AND  SetID --10005 is lamp number
				--IN
				--(
				--	SELECT MAX(SetID) FROM MergeTestParm WHERE SetID --Select newest
				--	IN
				--		(SELECT SetID FROM MergeTestParm WHERE ParamValue =  dbo.ufn_GetSetupValue(@ParamValue) and ParamID = 30004)
				--		AND ParamID = 30001 AND ParamValue=
				--			(
				--				SELECT ParamValue FROM Recipe_STRING WHERE ParamID=30001 AND SetID =
				--					(
				--						SELECT MAX(SetID) FROM Recipe_INT WHERE ParamID=10006 AND ParamValue=(SELECT ParamValue FROM @ConcatenatedResults WHERE StepSetID=@SetID AND SubStepNumber=@SubStepNr AND ParamID=35005)
				--					)
				--			) --Action type				
				--)

				--SELECT * FROM MergeTestParm WHERE SetID --Select newest
				--IN
				--(SELECT SetID FROM MergeTestParm WHERE ParamValue =  dbo.ufn_GetSetupValue(@ParamValue) and ParamID = 30004)
				--AND ParamID = 30001
				----SELECT ParamValue FROM @ConcatenatedResults WHERE StepSetID=@SetID AND SubStepNumber=@SubStepNr AND ParamID=35005
				--SELECT ParamValue FROM Recipe_STRING WHERE ParamID=30001 AND SetID =
				--(
				--SELECT MAX(SetID) FROM Recipe_INT WHERE ParamID=10006 AND ParamValue=(SELECT ParamValue FROM @ConcatenatedResults WHERE StepSetID=@SetID AND SubStepNumber=@SubStepNr AND ParamID=35005)
				--)
	
		 --MainStepNr 10003
		 SET @ParamID=@ParamID+1
		 INSERT INTO @PLC_INT  (ParamID,ParamValue) VALUES (@ParamID,@MainStepNr)

		 --Substepnr 10004
		 SET @ParamID=@ParamID+1
		 INSERT INTO @PLC_INT  (ParamID,ParamValue) VALUES (@ParamID,@SubStepNr-1)
		 
		 --Totalstepnr 10005
		 SET @ParamID=@ParamID+1
		 INSERT INTO @PLC_INT  (ParamID,ParamValue) VALUES (@ParamID,@TotalStepNr)

		 --REAL Values for current substep:
		 IF @debug=1 SELECT @ParamValue ParamValue,@ParamID ParamID,dbo.ufn_GetSetupValue(@ParamValue) ParamValueNr
		 SET @ParamID=10*@TotalStepNr
		 INSERT INTO @PLC_REAL  (ParamID,ParamValue) (
		  SELECT @ParamID+ParamID, 
			 case 
				when T1.ParamID = 4 
				then CAST ((select ParamValue from Recipe_INT where SetID = (select max(SetID) from Recipe_INT where ParamValue = T1.ParamValue  and ParamID = 10006) and ParamID = 10005 AND T1.ParamID = 4)   AS FLOAT)
				else T1.ParamValue
				end
			 FROM MergeTestParm T1 WHERE ParamID<1000 AND SetID
				IN
				(SELECT MAX(SetID) FROM MergeTestParm WHERE SetID --Find only newest setup entry
				IN
				(SELECT SetID FROM MergeTestParm WHERE ParamValue = dbo.ufn_GetSetupValue(@ParamValue) and ParamID = 30004) --Look up in setup table where action type number is equal to current step
				AND ParamID = 30001 AND ParamValue=
				(
					(
							SELECT ParamValue FROM Recipe_STRING WHERE ParamID=30001 AND SetID =
								(
									SELECT MAX(SetID) FROM Recipe_INT WHERE ParamID=10006 AND ParamValue=(SELECT ParamValue FROM @ConcatenatedResults WHERE StepSetID=@SetID AND SubStepNumber=@SubStepNr AND ParamID=35005)
								)
						) --Action type		
				))
				--ORDER BY ParamID
			)

			 --SELECT @ParamID+ParamID, 
			 --case 
				--when T1.ParamID = 4 
				--then CAST ((select ParamValue from Recipe_INT where SetID = (select max(SetID) from Recipe_INT where ParamValue = T1.ParamValue  and ParamID = 10006) and ParamID = 10005 AND T1.ParamID = 4)   AS FLOAT)
				--else T1.ParamValue
				--end
			 --FROM MergeTestParm T1 WHERE ParamID<1000 AND SetID
				--IN
				--(SELECT MAX(SetID) FROM MergeTestParm WHERE SetID --Find only newest setup entry
				--IN
				--(SELECT SetID FROM MergeTestParm WHERE ParamValue = dbo.ufn_GetSetupValue(@ParamValue) and ParamID = 30004) --Look up in setup table where action type number is equal to current step
				--AND ParamID = 30001 AND ParamValue=
				--(
				--	(
				--			SELECT ParamValue FROM Recipe_STRING WHERE ParamID=30001 AND SetID =
				--				(
				--					SELECT MAX(SetID) FROM Recipe_INT WHERE ParamID=10006 AND ParamValue=(SELECT ParamValue FROM @ConcatenatedResults WHERE StepSetID=@SetID AND SubStepNumber=@SubStepNr AND ParamID=35005)
				--				)
				--		) --Action type		
				--))
				----ORDER BY ParamID

			
			
		 SET @oldStepSetID=@SetID
		 FETCH NEXT FROM stepCursor INTO @SetID, @MainStepNr, @SubStepNr, @ParamValue
		 SET @TotalStepNr=@TotalStepNr+1
		END
		CLOSE stepCursor
		DEALLOCATE stepCursor
		

		--DINT header data
		SET @ParamID=15001 --Recipesetid 
		INSERT INTO @PLC_DINT (ParamID,ParamValue) VALUES (@ParamID,@selectedRecipeSetID)

		--String header data
		SET @ParamID=30001 --Current timestamp
		INSERT INTO @PLC_STRING (ParamID,ParamValue) VALUES (@ParamID,CONVERT(VARCHAR(254), GETDATE(), 120))

		SET @ParamID=30002 --Recipe timestamp
		INSERT INTO @PLC_STRING (ParamID,ParamValue) VALUES (@ParamID,(SELECT CONVERT(VARCHAR(254), ParamValue, 120) FROM Recipe_DATETIME WHERE SetID=@selectedRecipeSetID))

		SET @ParamID=30003 --Recipe name
		INSERT INTO @PLC_STRING (ParamID,ParamValue) VALUES (@ParamID,(SELECT ParamValue FROM Recipe_STRING WHERE SetID=@selectedRecipeSetID AND ParamID=35006))

		--Final output to PLC:
		SELECT ParamID,ParamValue FROM @PLC_REAL ORDER BY ParamID --Output REAL to PLC
		SELECT ParamID,ParamValue FROM @PLC_INT ORDER BY ParamID  --Output INT to PLC

		SELECT ParamID,ParamValue FROM @PLC_DINT ORDER BY ParamID  --Output DINT to PLC
		SELECT ParamID,ParamValue FROM @PLC_STRING ORDER BY ParamID  --Output STRING to PLC
	END
GO

