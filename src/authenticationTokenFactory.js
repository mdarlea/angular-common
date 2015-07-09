(function () {
    'use strict';
    
    /**
    * @ngdoc service
    * @name swCommon.AuthenticationToken
    * @description Class responsible for the state and behavior of an authentication token
    * @constructor
    * @param {Object} token The authentication token object
    * @param {datetime} token..expires Token expiration date time
    * @param {datetime} token..issued Date time when the token was issued by the server
    * @param {string} token.access_token The authentication token encrypted string
    * @param {string} token.expires_in Token expiration time span
    * @param {string} token.externalUserName The external user name, the same as user name
    * @param {boolean} token.hasRegistered True if the user was registered, False otherwise              
    * @param {string} token.token_type The value is always "bearer" for token based security                
    * @param {string} token.userName The user name         
    * @param {string} token.refreshToken The refresh token when refresh tokens should be used
    * @param {boolean} token.useRefreshTokens True if refresh tokens should be used, False otherwise
     * @example
     * <pre>
     *  var value = localStorageService.get(key);
     *  var token = new AuthenticationToken(value);
     * </pre>     
    */    
    angular.module('swCommon').factory('AuthenticationToken', [function () {
            
            var AuthenticationToken = function (token) {
                /**
                * @ngdoc property
                * @name swCommon.AuthenticationToken#token 
                * @propertyOf swCommon.AuthenticationToken
                * @returns {Object} The authentication token object
                 */
                this.token = token;
            };
            
            AuthenticationToken.prototype = {
                /**
                * @ngdoc method
                * @name swCommon.AuthenticationToken#isExpired
                * @methodOf swCommon.AuthenticationToken
                * @description Check if the authentication token is expired   
                * @returns {boolean} True if teh authetnication token i expired, False otherwise
                */
                isExpired: function () {
                    //ToDo: to be implemented
                    return false;
                }
            };
            
            return AuthenticationToken;
        }]);
    
    /**
    * @ngdoc service
    * @name swCommon.$authenticationTokenFactory
    * @requires localStorageService
    * @requires swCommon.AuthenticationToken     
    * @description Service that performs the following functions:
    *   - reads an authentication token from a response and stores it in the local storage
    *   - gets the current authentication token from the local storage
    *   - removes the current authetnication token from the local storage   
    */              
    angular.module('swCommon').factory('$authenticationTokenFactory',
        ['localStorageService', 'AuthenticationToken', function (localStorageService, AuthenticationToken) {
            
            var key = "authorizationData";
            
            var factory = {
                /**
                * @ngdoc method
                * @name swCommon.$authenticationTokenFactory#createFrom
                * @methodOf swCommon.$authenticationTokenFactory
                * @description Creates the authentication token object from the HTTP response and stores it in the local storage
                * @param {Object} response The authentication token JObject issued by the server
                * @param {datetime} response..expires Token expiration date time
                * @param {datetime} response..issued Date time when the token was issued by the server
                * @param {string} response.access_token The authentication token encrypted string
                * @param {string} response.expires_in Token expiration time span
                * @param {string} response.externalUserName The external user name, the same as user name
                * @param {boolean} response.hasRegistered True if the user was registered, False otherwise              
                * @param {string} response.token_type The value is always "bearer" for token based security                
                * @param {string} response.userName The user name
                * @param {boolean} useRefreshTokens True if refresh tokens should be used, False otherwise
                * @returns {Object} the authentication token. The returned objected is an extension of the <b>response</b> parameter with the following additional properties: <table>
                   <tr>
                        <th>Property</th>
                        <th>Type</th>
                        <th>Details</th>
                   </tr>                 
                 * <tr>
                 *  <td>refreshToken</td>
                 *  <td><a href="" class="label type-hint type-hint-string">String</a></td>
                 *  <td>The refresh token when refresh tokens should be used</td>
                 * </tr>
                 * <tr>
                 *  <td>useRefreshTokens</td>
                 *  <td><a href="" class="label type-hint type-hint-boolean">Boolean</a></td>
                 *  <td>True if refresh tokens should be used, False otherwise</td>
                 * </tr>                 
                 * </table>
                */
                createFrom: function (response, useRefreshTokens) {
                    var token = $.extend(true, {}, response, {
                        refreshToken: (useRefreshTokens) ? response.refresh_token : "",
                        useRefreshTokens: (useRefreshTokens) ? useRefreshTokens : false
                    });
                    localStorageService.set(key, token);
                    return token;
                },
                
                /**
                * @ngdoc method
                * @name swCommon.$authenticationTokenFactory#removeToken
                * @methodOf swCommon.$authenticationTokenFactory
                * @description Removes the authentication token from the local storage                
                */
                removeToken: function () {
                    localStorageService.remove(key);
                },
                
                /**
                * @ngdoc method
                * @name swCommon.$authenticationTokenFactory#getToken
                * @methodOf swCommon.$authenticationTokenFactory
                * @description Gets the authentication token from the local storage
                * @returns {AuthenticationToken} {@link swCommon.AuthenticationToken AuthenticationToken} the authentication token object stored in the local storage
                */
                getToken: function () {
                    var token = localStorageService.get(key);
                    return (token) ? new AuthenticationToken(token) : null;
                }
            };
            
            return factory;
        }]);
})();