USE [GO_PVG32BLOCK]
GO

/****** Object:  StoredProcedure [dbo].[sp_CreateAccount]    Script Date: 08/09/2023 14.50.05 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO



CREATE PROCEDURE [dbo].[sp_CreateAccount]
	@Username NVARCHAR(200),
	@Password NVARCHAR(200),
	@AccessLevel NVARCHAR(1),
	@OverrideUserNameCheck BIT = 0
		AS
			BEGIN
				-- Search for existing usernames in the database
				IF(EXISTS(SELECT * FROM [GO_PVG32BLOCK].[dbo].[User_STRING] WHERE ParamID = 39901 AND ParamValue = @Username) AND @OverrideUserNameCheck = 0)
					BEGIN
						SELECT '0' AS 'Created User'
					END
				ELSE
					BEGIN
						SELECT '1' AS 'Created User'
						DECLARE @DynamicString NVARCHAR(100);
						SET @DynamicString = CONCAT('39901;', @Username, ';15002;', @AccessLevel, ';STRING39902;', @Password);
						EXECUTE sp_SaveParams 1, 'User', @DynamicString;
					END

			END
GO


