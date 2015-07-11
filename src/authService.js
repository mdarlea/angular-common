(function () {
    'use strict';
    
    /**
    * @ngdoc service
    * @name swAuth.$authService
    * @requires $http
    * @requires $q
    * @requires swAuth.$authenticationTokenFactory
    * @requires swCommon.swAppSettings
    * @description Authentication service    
    */
    angular.module('swAuth').factory('$authService', ['$http', '$q', '$authenticationTokenFactory', 'swAppSettings',
    function ($http, $q, $authenticationTokenFactory, swAppSettings) {
            
            var serviceBase = swAppSettings.apiServiceBaseUri;
            
            var service = {
                /**
                * @ngdoc property
                * @name swAuth.$authService#authentication
                * @propertyOf swAuth.$authService
                * @returns {object} Current user login information <table>
                   <tr>
                        <th>Property</th>
                        <th>Type</th>
                        <th>Details</th>
                   </tr>
                   <tr>
                       <td>isAuth</td>
                       <td><a href="" class="label type-hint type-hint-boolean">Boolean</a></td>
                       <td>True if current user is authenticated, False otherwise</td>
                   </tr> 
                   <tr>
                       <td>isAuthorizing</td>
                       <td><a href="" class="label type-hint type-hint-boolean">Boolean</a></td>
                       <td>True if the authorization process is currently taking place, False otherwise</td>
                   </tr> 
                   <tr>
                       <td>userName</td>
                       <td><a href="" class="label type-hint type-hint-string">String</a></td>
                       <td>The authenticated user name</td>
                   </tr> 
                   <tr>
                       <td>useRefreshTokens</td>
                       <td><a href="" class="label type-hint type-hint-boolean">Boolean</a></td>
                       <td>True is refresh authorization tokens should be used. False otherwise</td>
                   </tr>                                                                
                */
                authentication: {
                    isAuth: false,
                    isAuthorizing: false,
                    userName: "",
                    useRefreshTokens: false
                },
                
                externalAuthData: {
                    provider: "",
                    userName: "",
                    externalAccessToken: "",
                    externalAccessVerifier: null
                },
                
                saveRegistration: function (registration) {
                    
                    service.logOut();
                    
                    return $http.post(serviceBase + 'api/account/register', registration).then(function (response) {
                        return response;
                    });
                },
                
                /**
                * @ngdoc method
                * @name swAuth.$authService#obtainAccessToken
                * @methodOf swAuth.$authService
                * @description Calls the authorization service to authenticate the current user and issue the authentication token
                * @param {string} [provider='undefined'] External provider name. Example: Twitter, Facebook etc.
                * @param {Object} [externalData='undefined'] Oauth information, applicable only if provider is not null or undefined
                * @param {string} [externalData.externalAccessToken='undefined'] OAuth token
                * @param {string} [externalData.oauthVerifier='undefined'] OAuth verifier
                * @returns {Object} the promise to return the authorization token from the server. 
                 * See the {@link swAuth.$authService#authorize authorize} method for a description of the JSON object returned by the service response
                */
                obtainAccessToken: function (provider, externalData) {
                    
                    var deferred = $q.defer();
                    
                    var actionName = "ObtainLocalAccessToken";
                    var url = serviceBase + "api/" + (provider || "Account") + "/" + actionName;
                    
                    service.authentication.isAuthorizing = true;
                    
                    var data = $.extend(true, {}, externalData, { clientId: swAppSettings.clientId });
                    
                    $http.get(url, {
                        params: data
                    }).success(function (response) {
                        var hasRegistered = response.hasRegistered;
                        
                        service.externalAuthData.provider = data.provider;
                        
                        if (hasRegistered) {
                            service._authorize(response);
                        }
                        else {
                            service.authentication.isAuth = false;
                            service.authentication.userName = "";
                            service.authentication.useRefreshTokens = false;
                            
                            service.externalAuthData.userName = response.externalUserName;
                            service.externalAuthData.externalAccessToken = response.externalAccessToken;
                            service.externalAuthData.externalAccessVerifier = response.externalAccessVerifier;
                        }
                        
                        service.authentication.isAuthorizing = false;
                        
                        deferred.resolve(response);

                    }).error(function (err, status) {
                        service.logOut();
                        
                        service.authentication.isAuthorizing = false;
                        deferred.reject(err.Message);
                    });
                    
                    return deferred.promise;
                },
                
                /**
                * @ngdoc method
                * @name swAuth.$authService#login
                * @methodOf swAuth.$authService
                * @param {Object} loginData Login information
                * @description Logs in the current user
                * @returns {Object} the promise to return the authorization token for the logged in user from the server. 
                 * See the {@link swAuth.$authService#authorize authorize} method for a description of the JSON object returned by the service response                 
                */   
                login: function (loginData) {
                    
                    var data = "grant_type=password&username=" + loginData.userName + "&password=" + loginData.password;
                    
                    if (loginData.useRefreshTokens) {
                        data = data + "&client_id=" + swAppSettings.clientId;
                    }
                    
                    var deferred = $q.defer();
                    
                    $http.post(serviceBase + 'token', data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).success(function (response) {
                        
                        if (loginData.useRefreshTokens) {
                            $authenticationTokenFactory.createFrom(response, true);
                        }
                        else {
                            $authenticationTokenFactory.createFrom(response, false);
                        }
                        
                        service.authentication.isAuth = true;
                        service.authentication.userName = loginData.userName;
                        service.authentication.useRefreshTokens = loginData.useRefreshTokens;
                        
                        deferred.resolve(response);

                    }).error(function (err, status) {
                        service.logOut();
                        deferred.reject(err);
                    });
                    
                    return deferred.promise;
                },
                
                /**
                * @ngdoc method
                * @name swAuth.$authService#logOut
                * @methodOf swAuth.$authService
                * @description Logs the current user out and removes the authentication token from the local storage
                */                
                logOut: function () {
                    
                    $authenticationTokenFactory.removeToken();
                    
                    service.authentication.isAuth = false;
                    service.authentication.userName = "";
                    service.authentication.useRefreshTokens = false;
                },
                
                /**
                * @ngdoc method
                * @name swAuth.$authService#fillAuthData
                * @methodOf swAuth.$authService
                * @description Reads the authentication token from the local storage and updates the state of the {@link swAuth.$authService#authentication authentication} property with this information
                * @example
                * <pre>
                    app.run(['$authService', function ($authService) {
                        $authService.fillAuthData();
                    }]);                 
                * </pre>
                */    
                fillAuthData: function () {
                    
                    var authData = $authenticationTokenFactory.getToken();
                    if (authData) {
                        var token = authData.token;
                        service.authentication.isAuth = true;
                        service.authentication.userName = token.userName;
                        service.authentication.useRefreshTokens = token.useRefreshTokens;
                    }
                },
                
                refreshToken: function () {
                    var deferred = $q.defer();
                    
                    var authData = $authenticationTokenFactory.getToken();
                    
                    if (authData) {
                        
                        if (authData.useRefreshTokens) {
                            var token = authData.token;
                            var data = "grant_type=refresh_token&refresh_token=" + token.refreshToken + "&client_id=" + swAppSettings.clientId;
                            
                            $authenticationTokenFactory.removeToken();
                            
                            $http.post(serviceBase + 'token', data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).success(function (response) {
                                
                                $authenticationTokenFactory.createFrom(response, true);
                                
                                deferred.resolve(response);

                            }).error(function (err, status) {
                                service.logOut();
                                deferred.reject(err);
                            });
                        }
                    }
                    
                    return deferred.promise;
                },
                
                /**
                * @ngdoc method
                * @name swAuth.$authService#registerExternal
                * @methodOf swAuth.$authService
                * @description Registers the user with a third party provider such as Twitter or Facebook and authenticates this user
                * @param {object} registerExternalData The infomration about the user that is registered. It should contain properties with information about the external provider, the user name and any additional information that should be saved in the registered user profile
                * @param {object} registerExternalData.provider The external provider name
                * @param {object} registerExternalData.userName The user name                
                * @returns {Object} the promise to return the authorization token from the server for the registered user. 
                 * See the {@link swAuth.$authService#authorize authorize} method for a description of the JSON object returned by the service response
                */                
                registerExternal: function (registerExternalData) {
                    
                    var deferred = $q.defer();
                    
                    var data = $.extend(true, {}, registerExternalData, { clientId: swAppSettings.clientId });
                    
                    $http.post(serviceBase + 'api/account/registerexternal', data)
                .success(function (response) {
                        
                        service._authorize(response);
                        
                        deferred.resolve(response);

                    }).error(function (err, status) {
                        service.logOut();
                        deferred.reject(err);
                    });
                    
                    return deferred.promise;
                },
                
                /**
                * @ngdoc method
                * @name swAuth.$authService#authorize
                * @methodOf swAuth.$authService
                * @description Authenticates the current user and stores the authentication token in the local storage                
                * @param {Object} response The authentication token JObject issued by the server
                * @param {datetime} response..expires Token expiration date time
                * @param {datetime} response..issued Date time when the token was issued by the server
                * @param {string} response.access_token The authentication token encrypted string
                * @param {string} response.expires_in Token expiration time span
                * @param {string} response.externalUserName The external user name, the same as user name
                * @param {boolean} response.hasRegistered True if the user was registered, False otherwise              
                * @param {string} response.token_type The value is always "bearer" for token based security                
                * @param {string} response.userName The user name
                */
                authorize: function (response) {
                    service.externalAuthData.provider = response.provider;
                    this._authorize(response);
                },
                
                _authorize: function (response) {
                    service.externalAuthData.userName = response.externalUserName;
                    service.externalAuthData.externalAccessToken = null;
                    service.externalAuthData.externalAccessVerifier = null;
                    
                    $authenticationTokenFactory.createFrom(response);
                    
                    service.authentication.isAuth = true;
                    service.authentication.userName = response.userName;
                    service.authentication.useRefreshTokens = false;
                }
            };
            
            return service;

        }]);
})();