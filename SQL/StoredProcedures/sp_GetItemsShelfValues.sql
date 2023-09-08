USE [GO_PVG32BLOCK]
GO

/****** Object:  StoredProcedure [dbo].[sp_GetItemsShelfValues]    Script Date: 08/09/2023 14.50.44 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO



ALTER PROCEDURE [dbo].[sp_GetItemsShelfValues]
	@action NVARCHAR(100)
		AS
			BEGIN
				declare @itemParamValue nvarchar(1)
				IF @action ='Pick'
					BEGIN
						SET @itemParamValue = '4'
					END
				IF @action ='Expander'
					BEGIN
						SET @itemParamValue = '5'
					END
				IF @action ='Kolver'
					BEGIN
						SET @itemParamValue = '6'
					END
				IF @action ='Atlas'
					BEGIN
						SET @itemParamValue = '7'
					END
				IF @action ='Press'
					BEGIN
						SET @itemParamValue = '8'
					END
				IF @action ='Orientation'
				BEGIN
					SET @itemParamValue = '9'
				END

				SELECT * FROM MergeTestParm WHERE SetID
				IN
				(SELECT MAX(SetID) FROM MergeTestParm WHERE SetID
				IN
				(SELECT SetID FROM MergeTestParm WHERE ParamValue = @itemParamValue and ParamID = 30004)
				AND ParamID = 30001 GROUP BY ParamValue)
			END
GO


