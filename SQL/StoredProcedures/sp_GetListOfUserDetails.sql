USE [GO_PVG32BLOCK]
GO

/****** Object:  StoredProcedure [dbo].[sp_GetListOfUserDetails]    Script Date: 08/09/2023 14.51.23 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO





ALTER PROCEDURE [dbo].[sp_GetListOfUserDetails]
	AS
		BEGIN

		DECLARE @UserDetails TABLE(
			SetID INT,
			UserName NVARCHAR(200),
			Password NVARCHAR(200),
			AccessLevel NVARCHAR(10)
		)

		INSERT INTO @UserDetails
		SELECT
			T1.SetID,
			T1.ParamValue AS 'UserName',
			T2.ParamValue AS 'Password',
			CASE
				WHEN T3.ParamValue = 0 THEN 'Admin'
				WHEN T3.ParamValue = 1 THEN 'User'
				WHEN T3.ParamValue = -1 THEN 'Disabled'
			ELSE 'UNDEFINED' END AS 'AccessLevel'
		FROM
			User_STRING T1
		INNER JOIN
			User_STRING T2
		ON T1.SetID = T2.SetID
		INNER JOIN
			User_DINT T3
		ON T1.SetID = T3.SetID
		where
			T1.ParamID = 39901
		AND
			T2.ParamID = 39902

		SELECT * from @UserDetails WHERE SetID IN (SELECT MAX(SetID) FROM @UserDetails GROUP BY UserName) ORDER BY UserName
		END
GO


