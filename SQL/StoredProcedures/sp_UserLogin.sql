USE [GO_PVG32BLOCK]
GO

/****** Object:  StoredProcedure [dbo].[sp_UserLogin]    Script Date: 07/09/2023 09.32.16 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO



CREATE PROCEDURE [dbo].[sp_UserLogin]
	@userName NVARCHAR(250),
	@password NVARCHAR(250)
		AS
			BEGIN
				-- Username should not be case sensitive
				IF EXISTS(SELECT 1 FROM [GO_PVG32BLOCK].[dbo].[User_STRING] WHERE ParamID = 39901 and ParamValue = @userName /*COLLATE Latin1_General_BIN*/ GROUP BY ParamValue)
					BEGIN
						SELECT 'Account Found' AS 'Found'
					END
				ELSE
					BEGIN
						SELECT 'Account Not Found' AS 'Found'
					END

				SELECT * FROM User_STRING WHERE
				ParamID = 39902
				and
				SetID = (
					SELECT max([SetID])
					FROM [GO_PVG32BLOCK].[dbo].[User_STRING] WHERE ParamID = 39901 and ParamValue = @userName /*COLLATE Latin1_General_BIN*/ GROUP BY ParamValue
				)
				and
				ParamValue = N'En_crypted:' + CONVERT(VARCHAR(32),HashBytes('MD5', @password) ,2)
			END
GO


