USE [GO_PVG32BLOCK]
GO

/****** Object:  StoredProcedure [dbo].[sp_GetItemActiveStatusOnName]    Script Date: 28/09/2023 11.57.35 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO





/****** Script for SelectTopNRows command from SSMS  ******/

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
					AND ParamValue = @itemName
					)

			END




GO


