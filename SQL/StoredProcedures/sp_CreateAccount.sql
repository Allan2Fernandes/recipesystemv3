USE [GO_PVG32BLOCK]
GO

/****** Object:  StoredProcedure [dbo].[sp_CreateAccount]    Script Date: 07/09/2023 09.29.53 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[sp_CreateAccount]
	@Username NVARCHAR(200),
	@Password NVARCHAR(200)
		AS
			BEGIN
				-- Search for existing usernames in the database
				IF(EXISTS(SELECT * FROM [GO_PVG32BLOCK].[dbo].[User_STRING] WHERE ParamID = 39901 AND ParamValue = @Username))
					BEGIN
						SELECT '0' AS 'Created User'
					END
				ELSE
					BEGIN
						SELECT '1' AS 'Created User'
						DECLARE @DynamicString NVARCHAR(100);
						SET @DynamicString = CONCAT('39901;', @Username, ';STRING39902;', @Password);
						EXECUTE sp_SaveParams 1, 'User', @DynamicString;
					END

			END
GO


