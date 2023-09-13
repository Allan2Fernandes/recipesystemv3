USE [GO_PVG32BLOCK]
GO

/****** Object:  StoredProcedure [dbo].[sp_GetRecipeHistory]    Script Date: 12/09/2023 08.47.13 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO



ALTER PROCEDURE [dbo].[sp_GetRecipeHistory]
	@RecipeName NVARCHAR(50)
		AS
			BEGIN
				SELECT
					T1.SetID,
					T1.ParamValue AS 'RecipeName',
					T2.UserID AS 'UserID',
					T2.ParamValue AS 'LastModifiedDate',
					T4.ParamValue AS 'ModifiedByUser'
				FROM
					Recipe_STRING T1 -- Get Recipe names
				INNER JOIN
					Recipe_DATETIME T2 -- Get the last modified dates for every recipe
				ON T1.SetID = T2.SetID
				INNER JOIN
					User_STRING T4 -- Get the user who modified the recipe last
				ON T2.UserID = T4.SetID
				WHERE T1.SetID IN
				-- Filter on recipe SetIDs
				(SELECT T3.[SetID] FROM [Recipe_INT] T3 WHERE T3.ParamID = 10002 AND T3.ParamValue = 1)
				AND T4.ParamID = 39901
				AND T1.ParamValue = @RecipeName
			END
GO


