USE [GO_PVG32BLOCK]
GO

/****** Object:  StoredProcedure [dbo].[sp_GetImageEncodingOnName]    Script Date: 19/09/2023 10.12.21 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

/* =============================================
Author:			AF
Create date:	2023-09-21
Description:	Get the B64 encoding of an image by searching for the name of the image. If multiple versions exist, the encoding with the highest setID(latest version) will be returned.
Example call:	EXEC [dbo].[sp_GetImageEncodingOnName] @imageName = 'img1.png'
-- =============================================
*/

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


