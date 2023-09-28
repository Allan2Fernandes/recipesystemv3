USE [GO_PVG32BLOCK]
GO

/****** Object:  StoredProcedure [dbo].[sp_GetDropDownList]    Script Date: 28/09/2023 11.57.05 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO








/* =============================================
Author:			AJO/AF
Create date:	2023-06-14
Description:	Return af list of possible selectable items from the normalized data
Example call:	EXEC sp_GetDropDownList
				EXEC sp_GetDropDownList 'Pick'
				EXEC sp_GetDropDownList 'Tool'
				EXEC sp_GetDropDownList 'Expander'
-- =============================================
*/
CREATE PROCEDURE [dbo].[sp_GetDropDownList]
	@ListName VARCHAR(100)='Actions'
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

	IF @ListName = 'Actions' --If no Listname is given, return list of possible actions
	BEGIN
		SELECT 'Pick' AS Action
		UNION SELECT 'Expander'
		UNION SELECT 'Kolver'
		UNION SELECT 'Atlas'
		UNION SELECT 'Press'
		UNION SELECT 'Orientation'
		UNION SELECT 'Acknowledge'
	END

	IF @ListName='Pick'
	BEGIN
		SELECT DISTINCT ParamValue FROM MergeTestParm WHERE ParamID=30001 AND SetID IN
		(SELECT SetID FROM MergeTestParm WHERE ParamID=30004 AND ParamValue='4')
	END

	IF @ListName='Expander'
	BEGIN
		SELECT DISTINCT ParamValue FROM MergeTestParm WHERE ParamID=30001 AND SetID IN
		(SELECT SetID FROM MergeTestParm WHERE ParamID=30004 AND ParamValue='5')
	END

	IF @ListName='Kolver'
	BEGIN
		SELECT DISTINCT ParamValue FROM MergeTestParm WHERE ParamID=30001 AND SetID IN
		(SELECT SetID FROM MergeTestParm WHERE ParamID=30004 AND ParamValue='6')
	END
	IF @ListName='Atlas'
	BEGIN
		SELECT DISTINCT ParamValue FROM MergeTestParm WHERE ParamID=30001 AND SetID IN
		(SELECT SetID FROM MergeTestParm WHERE ParamID=30004 AND ParamValue='7')
	END
	IF @ListName='Press'
	BEGIN
		SELECT DISTINCT ParamValue FROM MergeTestParm WHERE ParamID=30001 AND SetID IN
		(SELECT SetID FROM MergeTestParm WHERE ParamID=30004 AND ParamValue='8')
	END
	IF @ListName='Orientation'
	BEGIN
		SELECT DISTINCT ParamValue FROM MergeTestParm WHERE ParamID=30001 AND SetID IN
		(SELECT SetID FROM MergeTestParm WHERE ParamID=30004 AND ParamValue='9')
	END
	IF @ListName='Acknowledge'
	BEGIN
		SELECT DISTINCT ParamValue FROM MergeTestParm WHERE ParamID=30001 AND SetID IN
		(SELECT SetID FROM MergeTestParm WHERE ParamID=30004 AND ParamValue='10')
	END

END
GO


