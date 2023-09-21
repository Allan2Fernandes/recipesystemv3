USE [GO_PVG32BLOCK]
GO

/****** Object:  StoredProcedure [dbo].[sp_UserLogin]    Script Date: 08/09/2023 14.51.58 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

/* =============================================
Author:			AF
Create date:	2023-09-21
Description:    Given the log-in details of a user, the SP either returns a result set with the user details or not, depending on if the password was correct. If the username is not found, the SP returns 'Account Not Found'
Example call:	EXEC [dbo].[sp_UserLogin] @userName = 'Admin', @password = '100'
-- =============================================
*/


ALTER PROCEDURE [dbo].[sp_UserLogin]
	@userName NVARCHAR(250),
	@password NVARCHAR(250)
		AS
			BEGIN
				-- Username should not be case sensitive
				-- Look for accounts which are not disabled
				IF EXISTS
				(
					SELECT * FROM User_STRING T1 INNER JOIN User_DINT T2
					ON T1.SetID = T2.SetID
					WHERE T1.SetID =
					(
					    -- The username is not case sensitive, so 'COLLATE Latin1_General_BIN' was disabled
						SELECT MAX(T1.SetID) FROM user_STRING T1 WHERE T1.ParamID = 39901 and T1.ParamValue = @userName /*COLLATE Latin1_General_BIN*/ GROUP BY T1.ParamValue
					) AND T2.ParamValue IN (0, 1)
				)
					BEGIN
						SELECT 'Account Found' AS 'Found'
					END
				ELSE
					BEGIN
						SELECT 'Account Not Found' AS 'Found'
					END

				SELECT T1.*,
				--T2.ParamValue AS 'AccessLevel'
				CASE
					WHEN T2.ParamValue = 0 THEN 'Admin'
					WHEN T2.ParamValue = 1 THEN 'User'
					WHEN T2.ParamValue = -1 THEN 'Disabled'
				ELSE 'UNDEFINED' END AS 'AccessLevel'
				FROM User_STRING T1 INNER JOIN User_DINT T2
				ON T1.SetID = T2.SetID
				WHERE
				T1.ParamID = 39902
				and
				T1.SetID = (
					SELECT max(T3.[SetID])
					FROM User_STRING T3 WHERE T3.ParamID = 39901 and T3.ParamValue = @userName /*COLLATE Latin1_General_BIN*/ GROUP BY T3.ParamValue
				)
				and
				T1.ParamValue = N'En_crypted:' + CONVERT(VARCHAR(32),HashBytes('MD5', @password) ,2)
			END
GO


