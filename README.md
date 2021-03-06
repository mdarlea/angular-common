﻿### [AngularJS](http://angularjs.org/) common utility functions and token-based authentication service [![Build Status: Windows](https://ci.appveyor.com/api/projects/status/tubdbt4557syv5vt/branch/master?svg=true)](https://ci.appveyor.com/project/gruntjs/angular-common/branch/master)

### [AngularJS Common](https://www.nuget.org/packages/sw-common/) ![NuGet version](https://badge.fury.io/nu/sw-common.png)
```
PM> Install-Package sw-common
```

<h2>swCommon</h2>
<div class="description">
	<p>This module contains AngularJS common components</p>

	<h4 id="description_-providers"> Providers </h4>
	<dl>
		<dt><a href="http://swaksoft.com/docs/common/docs/#/api/swCommon.swAppSettingsProvider">swAppSettings</a> </dt>
		<dd>Provides application configuration for different environments</dd>
	</dl>

	<h4 id="description_-services"> Objects </h4> 
	<dl>
		<dt><a href="http://swaksoft.com/docs/common/docs/#/api/swCommon.$utilities">$utilities</a></dt>
		<dd>Utility functions (helpers)</dd>
	</dl>

	<h4 id="description_-services"> Services </h4> 
	<dl>
		<dt><a href="http://swaksoft.com/docs/common/docs/#/api/swCommon.PagedDataService">PagedDataService</a></dt>
		<dd>Service that queries paged data. It can be used with ngGrid, any grind that supports paging or with an infinit-scrolling list</dd>
	</dl>
</div>

<h2>swAuth</h2>
<div class="description">
	<p>This module contains token based authentication services</p>
	<dl>
		<dt><a href="http://swaksoft.com/docs/common/docs/#/api/swAuth.$authenticationTokenFactory">$authenticationTokenFactory</a> </dt>
		<dd>
			Service that performs the following functions:
			<ul>
				<li>reads an authentication token from a response and stores it in the local storage</li>
				<li>gets the current authentication token from the local storage</li>
				<li>removes the current authetnication token from the local storage</li>
			</ul>
		</dd>
		<dt><a href="http://swaksoft.com/docs/common/docs/#/api/swAuth.$authService">$authService</a> </dt>
		<dd>
			Authentication service
		</dd>
	</dl>
</div>
