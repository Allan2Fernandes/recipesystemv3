USE [GO_PVG32BLOCK]
GO

/****** Object:  StoredProcedure [dbo].[sp_GetItemActiveStatusOnName]    Script Date: 20/09/2023 11.05.50 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

/* =============================================
Author:			AF
Create date:	2023-09-21
Description:	This stored procedure returns 0 or 1, depending on if the item is enabled (1) or disabled (0)
Example call:	EXEC [dbo].[sp_GetItemActiveStatusOnName] @action = 'Expander', @itemName = 'EXP_1'
-- =============================================
*/

CREATE PROCEDURE [dbo].[sp_GetItemActiveStatusOnName]
	@action nvarchar(50),
	@itemName nvarchar(50)
		AS
			BEGIN
				DECLARE @itemParamValue nvarchar(10)
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
					IF @action ='Acknowledge'
						BEGIN
							SET @itemParamValue = '10'
						END


					SELECT ParamValue FROM Recipe_BOOL WHERE SetID =
					(
					SELECT MAX(SetID) FROM Recipe_STRING WHERE SetID IN
					(SELECT SetID FROM Recipe_STRING WHERE ParamID = 30004 AND ParamValue = @itemParamValue)
					AND ParamValue = @itemName -- Search the max setID for the chosen item name. Then using that SetID, get the status from another table, Recipe_BOOL
					)

			END




GO


