(function () {
    'use strict';
    
    /**
    * @ngdoc service
    * @name swCommon.ngAuthSettingsProvider  
    * @description ngAuthSettings provider
    */ 

    /**
    * @ngdoc service
    * @name swCommon.ngAuthSettings    
    * @description Provider that 
    *
    */
    angular.module('swCommon').provider('ngAuthSettings', function () {
        var settings = {};
        
        this.setSettings = function (value) {
            settings = value;
        };
        
        this.$get = [
            function () {
                var options = $.extend(true, {
                    indexPage: '/home',
                    apiServiceBaseUri: 'http://',
                    clientId: 'swCommon'
                }, settings);
                
                return options;
            }
        ];
    });
})();

