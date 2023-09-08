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


alter procedure [dbo].[sp_createaccount]
	@username nvarchar(200),
	@password nvarchar(200),
	@accesslevel nvarchar(10),
	@overrideusernamecheck bit = 0
		as
			begin
				-- search for existing usernames in the database
				if(exists(select * from [go_pvg32block].[dbo].[user_string] where paramid = 39901 and paramvalue = @username) and @overrideusernamecheck = 0)
					begin
						select '0' as 'created user'
					end
				else
					begin
						select '1' as 'created user'
						declare @dynamicstring nvarchar(100);
						set @dynamicstring = concat('39901;', @username, ';15002;', @accesslevel, ';string39902;', @password);
						execute sp_saveparams 1, 'user', @dynamicstring;
					end

			end
go


