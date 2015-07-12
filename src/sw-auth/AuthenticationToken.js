(function () {
    'use strict';
    
    /**
    * @ngdoc service
    * @name swAuth
 
    * @description This module contains token based authentication services
    * - {@link swAuth.$authenticationTokenFactory $authenticationTokenFactory} 
    * - {@link swAuth.$authService $authService} 
    */
    var swAuth = angular.module('swAuth', ['swCommon']);

    /**
    * @ngdoc service
    * @name swAuth.AuthenticationToken
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
    angular.module('swAuth').factory('AuthenticationToken', [function () {
            
            var AuthenticationToken = function (token) {
                /**
                * @ngdoc property
                * @name swAuth.AuthenticationToken#token 
                * @propertyOf swAuth.AuthenticationToken
                * @returns {Object} The authentication token object
                 */
                this.token = token;
            };
            
            AuthenticationToken.prototype = {
                /**
                * @ngdoc method
                * @name swAuth.AuthenticationToken#isExpired
                * @methodOf swAuth.AuthenticationToken
                * @description Check if the authentication token is expired   
                * @returns {boolean} True if the authetnication token i expired, False otherwise
                */
                isExpired: function () {
                    //ToDo: to be implemented
                    return false;
                }
            };
            
            return AuthenticationToken;
        }]);
})();