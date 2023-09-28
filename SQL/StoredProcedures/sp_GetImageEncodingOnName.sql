USE [GO_PVG32BLOCK]
GO

/****** Object:  StoredProcedure [dbo].[sp_GetImageEncodingOnName]    Script Date: 28/09/2023 11.57.17 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO



CREATE PROCEDURE [dbo].[sp_GetImageEncodingOnName]
	@imageName NVARCHAR(300)
		AS
			BEGIN
				DECLARE @imageIsEnabled BIT;
				SELECT @imageIsEnabled = T2.ParamValue
				FROM File_STRING T1
				INNER JOIN File_BOOL T2 ON T1.SetID = T2.SetID
				WHERE T1.SetID = (SELECT MAX(SetID) FROM File_STRING WHERE ParamValue = @imageName) AND T1.ParamID = 35008;

				-- If the image is disabled, return the blank image in it's place
				IF @imageIsEnabled = 0
					BEGIN
						SET @imageName = 'blank_white_image.png'
					END



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


