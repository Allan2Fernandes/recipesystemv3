USE [GO_PVG32BLOCK]
GO

/****** Object:  StoredProcedure [dbo].[sp_GetDropDownListV2]    Script Date: 14/11/2023 10.09.31 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[sp_GetDropDownListV2]
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
		SELECT * FROM MergeTestParm WHERE SetID IN
		(
			SELECT MAX(SetID) FROM MergeTestParm WHERE SetID IN
			(
				SELECT SetID FROM MergeTestParm WHERE ParamID = 30004 AND ParamValue = '4'
			) AND ParamID = 10006 GROUP BY ParamValue
		)
	END

	IF @ListName='Expander'
	BEGIN
		SELECT * FROM MergeTestParm WHERE SetID IN
		(
			SELECT MAX(SetID) FROM MergeTestParm WHERE SetID IN
			(
				SELECT SetID FROM MergeTestParm WHERE ParamID = 30004 AND ParamValue = '5'
			) AND ParamID = 10006 GROUP BY ParamValue
		)
	END

	IF @ListName='Kolver'
	BEGIN
		SELECT * FROM MergeTestParm WHERE SetID IN
		(
			SELECT MAX(SetID) FROM MergeTestParm WHERE SetID IN
			(
				SELECT SetID FROM MergeTestParm WHERE ParamID = 30004 AND ParamValue = '6'
			) AND ParamID = 10006 GROUP BY ParamValue
		)
	END
	IF @ListName='Atlas'
	BEGIN
		SELECT * FROM MergeTestParm WHERE SetID IN
		(
			SELECT MAX(SetID) FROM MergeTestParm WHERE SetID IN
			(
				SELECT SetID FROM MergeTestParm WHERE ParamID = 30004 AND ParamValue = '7'
			) AND ParamID = 10006 GROUP BY ParamValue
		)
	END
	IF @ListName='Press'
	BEGIN
		SELECT * FROM MergeTestParm WHERE SetID IN
		(
			SELECT MAX(SetID) FROM MergeTestParm WHERE SetID IN
			(
				SELECT SetID FROM MergeTestParm WHERE ParamID = 30004 AND ParamValue = '8'
			) AND ParamID = 10006 GROUP BY ParamValue
		)
	END
	IF @ListName='Orientation'
	BEGIN
		SELECT * FROM MergeTestParm WHERE SetID IN
		(
			SELECT MAX(SetID) FROM MergeTestParm WHERE SetID IN
			(
				SELECT SetID FROM MergeTestParm WHERE ParamID = 30004 AND ParamValue = '9'
			) AND ParamID = 10006 GROUP BY ParamValue
		)
	END
	IF @ListName='Acknowledge'
	BEGIN
		SELECT * FROM MergeTestParm WHERE SetID IN
		(
			SELECT MAX(SetID) FROM MergeTestParm WHERE SetID IN
			(
				SELECT SetID FROM MergeTestParm WHERE ParamID = 30004 AND ParamValue = '10'
			) AND ParamID = 10006 GROUP BY ParamValue
		)
	END

END
GO


