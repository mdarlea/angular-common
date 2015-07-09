### [AngularJS](http://angularjs.org/) common utility functions and token-based authentication service

<h2>swCommon</h2>
<div class="description">
	<p>This module contains AngularJS common components</p>

	<h4 id="description_-providers"> Providers </h4>
	<dl>
		<dt><a href="http://swaksoft.com/docs/#/api/swCommon.swAppSettingsProvider">swAppSettings</a> </dt>
		<dd>Provides application configuration for different environments</dd>
	</dl>

	<h4 id="description_-services"> Services </h4> 
	<dl>
		<dt><a href="http://swaksoft.com/docs/#/api/swCommon.PagedDataService">PagedDataService</a></dt>
		<dd>Service that queries paged data. It can be used with ngGrid, any grind that supports paging or with an infinit-scrolling list</dd>
	</dl>
</div>

<h2>swAuth</h2>
<div class="description">
	<p>This module contains token based authentication services</p>
	<dl>
		<dt><a href="http://swaksoft.com/docs/#/api/swAuth.$authenticationTokenFactory">$authenticationTokenFactory</a> </dt>
		<dd>
			Service that performs the following functions:
			- reads an authentication token from a response and stores it in the local storage
			- gets the current authentication token from the local storage
			- removes the current authetnication token from the local storage
		</dd>
	</dl>
</div>
