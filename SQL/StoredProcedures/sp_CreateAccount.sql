use [go_pvg32block]
go

/****** object:  storedprocedure [dbo].[sp_createaccount]    script date: 08/09/2023 14.50.05 ******/
set ansi_nulls on
go

set quoted_identifier on
go

/*
author:             af
creation date:      08/09/2023
example use:        exec [dbo].[sp_createaccount] 'username', 'password', 0, 1(optional)
description:        the stored procedure creates an with the specified username and password.
*/


CREATE PROCEDURE [dbo].[sp_CreateAccount]
	@Username NVARCHAR(200),
	@Password NVARCHAR(200),
	@AccessLevel NVARCHAR(10),
	@OverrideUserNameCheck BIT = 0
		AS
			BEGIN
				-- Search for existing usernames in the database
				IF(EXISTS(SELECT * FROM [GO_PVG32BLOCK].[dbo].[User_STRING] WHERE ParamID = 39901 AND ParamValue = @Username) AND @OverrideUserNameCheck = 0)
					BEGIN
					    -- If a user is unsuccessfully created, return 0.
						SELECT '0' AS 'Created User'
					END
				ELSE
					BEGIN
					    -- If the user is not found in the database, assume that the user will be created without any issues. return 1 to notify the front end that the user was successfully created
						SELECT '1' AS 'Created User'
						DECLARE @DynamicString NVARCHAR(100);
						SET @DynamicString = CONCAT('39901;', @Username, ';15002;', @AccessLevel, ';STRING39902;', @Password);
						EXECUTE sp_SaveParams 1, 'User', @DynamicString;
					END

			END
go


