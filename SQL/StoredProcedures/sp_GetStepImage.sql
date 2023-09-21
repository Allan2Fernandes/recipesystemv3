USE [GO_PVG32BLOCK]
GO

/****** Object:  StoredProcedure [dbo].[sp_GetStepImage]    Script Date: 20/09/2023 11.09.43 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

/* =============================================
Author:			AF
Create date:	2023-09-21
Description:    Returns the large image, small image and instructions of the specified recipe step. The purpose of this SP is to return data for the read-only webpage which is used by the operator.
Example call:	EXEC [dbo].[sp_GetStepImage] @selectedRecipeSetID = 501, @stepNo = 2
-- =============================================
*/

CREATE PROCEDURE [dbo].[sp_GetStepImage]
	@selectedRecipeSetID INT
	,@stepNo INT
		AS
			BEGIN
				SET NOCOUNT ON
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
				select
					T1.ParamID,
					--CASE WHEN T1.ParamID = 35001 OR T1.ParamID = 35002 THEN 'REMOVED IMAGE' ELSE T1.ParamValue END AS 'ParamValue',
					T1.ParamValue
				from Recipe_STRING T1 inner join @list3 T2
				on T1.SetID = T2.SetID
				where T1.SetID in (select SetID from @list3)
				and T2.ParamValue=@stepNo
				order by T2.ParamValue ASC

			END
GO


