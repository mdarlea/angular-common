(function () {
    'use strict';
    
    /**
    * @ngdoc service
    * @name swAuth.$authenticationTokenFactory
    * @requires localStorageService
    * @requires swAuth.AuthenticationToken     
    * @description Service that performs the following functions:
    *   - reads an authentication token from a response and stores it in the local storage
    *   - gets the current authentication token from the local storage
    *   - removes the current authetnication token from the local storage   
    */              
    angular.module('swAuth').factory('$authenticationTokenFactory',
        ['localStorageService', 'AuthenticationToken', function (localStorageService, AuthenticationToken) {
            
            var key = "authorizationData";
            
            var factory = {
                /**
                * @ngdoc method
                * @name swAuth.$authenticationTokenFactory#createFrom
                * @methodOf swAuth.$authenticationTokenFactory
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
                * @name swAuth.$authenticationTokenFactory#removeToken
                * @methodOf swAuth.$authenticationTokenFactory
                * @description Removes the authentication token from the local storage                
                */
                removeToken: function () {
                    localStorageService.remove(key);
                },
                
                /**
                * @ngdoc method
                * @name swAuth.$authenticationTokenFactory#getToken
                * @methodOf swAuth.$authenticationTokenFactory
                * @description Gets the authentication token from the local storage
                * @returns {AuthenticationToken} {@link swAuth.AuthenticationToken AuthenticationToken} the authentication token object stored in the local storage
                */
                getToken: function () {
                    var token = localStorageService.get(key);
                    return (token) ? new AuthenticationToken(token) : null;
                }
            };
            
            return factory;
        }]);
})();