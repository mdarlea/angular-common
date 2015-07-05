(function () {
    'use strict';
    
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