USE [GO_PVG32BLOCK]
GO

/****** Object:  StoredProcedure [dbo].[sp_GetStepsAndSubStepsOnRecipeSetID]    Script Date: 28/09/2023 11.59.38 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO









CREATE PROCEDURE [dbo].[sp_GetStepsAndSubStepsOnRecipeSetID]
	@selectedRecipeSetID INT
		AS
			BEGIN
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


				-- Recipes and their instructions
				select T1.SetID as 'StepSetID',
					10002 as 'HeirarchyTypeParamID',
					2 as 'HeirarchyType',
					10003 as 'StepNumberParamID',
					T2.ParamValue as 'StepNumber',
					T1.ParamID,
					--CASE WHEN T1.ParamID = 35001 OR T1.ParamID = 35002 THEN 'REMOVED IMAGE' ELSE T1.ParamValue END AS 'ParamValue',
					T1.ParamValue,
					@selectedRecipeSetID as 'RecipeSetID'
				from Recipe_STRING T1 inner join @list3 T2
				on T1.SetID = T2.SetID
				where T1.SetID in (select SetID from @list3)
				order by T2.ParamValue ASC

				--select * from @list3

				-- Declare a table variable to store the concatenated results
				DECLARE @ConcatenatedResults TABLE (
					SubStepSetID INT,
					ParamID INT,
					ParamValue NVARCHAR(255),
					SubStepNumber INT,
					StepSetID INT,
					RecipeSetID INT
				);

				DECLARE @SetID INT, @ParamValue INT
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
						T1.ParamValue as 'SubStepNumber',
						@selectedStepID as 'StepSetID',
						@selectedRecipeSetID as 'RecipeSetID'
					from @list6 T1 inner join Recipe_STRING T2
					on T1.SetID = T2.SetID
					order by T1.ParamValue asc

					DELETE FROM @list4
					DELETE FROM @list5
					DELETE FROM @list6
					FETCH NEXT FROM stepCursor INTO @SetID, @ParamValue
				END

				SELECT T1.*,
				10002 as 'HeirarchyTypeParamID',
				3 as 'HeirarchyType',
				10004 as 'SubStepNumberParamID'
				from @ConcatenatedResults T1 ORDER BY StepSetID, SubStepNumber
			END
GO


