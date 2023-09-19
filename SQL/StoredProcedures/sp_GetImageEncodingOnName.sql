USE [GO_PVG32BLOCK]
GO

/****** Object:  StoredProcedure [dbo].[sp_GetImageEncodingOnName]    Script Date: 19/09/2023 10.12.21 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO


CREATE PROCEDURE [dbo].[sp_GetImageEncodingOnName]
	@imageName NVARCHAR(300)
		AS
			BEGIN
				SELECT ParamValue
				FROM [File_STRING]
				WHERE
				SetID =
				(
					SELECT MAX(SetID) FROM [File_STRING] WHERE ParamValue = @imageName GROUP BY ParamValue
				)
				AND ParamID = 35009
			END
GO


