USE [GO_PVG32BLOCK]
GO

/****** Object:  StoredProcedure [dbo].[sp_GetListOfRecipes]    Script Date: 28/09/2023 11.58.45 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO




CREATE PROCEDURE [dbo].[sp_GetListOfRecipes]
	AS
		BEGIN
			-- Getting all the recipes
			select T1.SetID,
			T2.ParamID,
			T2.ParamValue as 'RecipeName',
			T3.ParamValue as 'CreationTime',
			T4.ParamValue as 'Status'
			from Recipe_INT T1
			inner join Recipe_STRING T2
			on T1.SetID = T2.SetID
			inner join Recipe_DATETIME T3
			on T1.SetID = T3.SetID
			inner join Recipe_BOOL T4
			on T1.SetID = T4.SetID
			where T1.ParamID = 10002 -- 10002 AND 1 means search for recipes only
			and T1.ParamValue = 1
			and T1.SetID in (SELECT MAX(SetID) from Recipe_STRING where ParamID = 35006 group by Recipe_STRING.ParamValue COLLATE Latin1_General_BIN)
			ORDER BY T2.ParamValue
		END
GO


