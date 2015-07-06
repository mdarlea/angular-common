(function () {
    'use strict';
    
    /**
    * @ngdoc service
    * @name swCommon.AuthenticationToken
    * @description Class responsible for the state and behavior of an authentication token
    */    
    angular.module('swCommon').factory('AuthenticationToken', [function () {
            
            var AuthenticationToken = function (token) {
                this.token = token;
            };
            
            AuthenticationToken.prototype = {
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
    * @description Service that performs teh following functions:
    *   - reads an authentication token from a response and stores it in the local storage
    *   - gets the current authentication token from the local storage
    *   - removes the current authetnication token from the local storage   
    */              
    angular.module('swCommon').factory('$authenticationTokenFactory',
        ['localStorageService', 'AuthenticationToken', function (localStorageService, AuthenticationToken) {
            
            var key = "authorizationData";
            
            var factory = {
                
                createFrom: function (response, useRefreshTokens) {
                    var token = $.extend(true, {}, response, {
                        refreshToken: (useRefreshTokens) ? response.refresh_token : "",
                        useRefreshTokens: (useRefreshTokens) ? useRefreshTokens : false
                    });
                    localStorageService.set(key, token);
                    return token;
                },
                
                removeToken: function () {
                    localStorageService.remove(key);
                },
                
                getToken: function () {
                    var token = localStorageService.get(key);
                    return (token) ? new AuthenticationToken(token) : null;
                }
            };
            
            return factory;
        }]);
})();