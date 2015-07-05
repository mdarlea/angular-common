(function () {
    'use strict';

    /**
    * @ngdoc service
    * @name swCommon.ngAuthSettingsProvider  
    * @description {@link swCommon.ngAuthSettings ngAuthSettings} provider
    * @example    
    *   <pre>
        (function () {
            'use strict';

            angular.module('app').config(['ngAuthSettingsProvider', 
                function (ngAuthSettingsProvider) {
                    ngAuthSettingsProvider.setSettings({
                        apiServiceBaseUri: "http://www.swaksoft.com/",
                        clientId: "SocialMediaApp"
                    });
            }]);
        })();      
    *  </pre>  
    */ 

    /**
    * @ngdoc service
    * @name swCommon.ngAuthSettings    
    * @description <p><b>AngularJS Provider</b></p>
    *   Provides application configuration for different environments such as: Dev, QA, Production
    */
    angular.module('swCommon').provider('ngAuthSettings', function () {
        var settings = {};
        
       /**
       * @ngdoc method
       * @name swCommon.ngAuthSettings#setSettings
       * @methodOf swCommon.ngAuthSettings
       * @description Sets the configuration properties
       * @param {Object} value Configuration property values
       */
        this.setSettings = function (value) {
            settings = value;
        };
        
        this.$get = [
            function () {
                var options = $.extend(true, {
                    /**
                    * @ngdoc property
                    * @name swCommon.ngAuthSettings#indexPage
                    * @propertyOf swCommon.ngAuthSettings
                    * @returns {string} Path to the application's home (index) page. <br/><i>(Default: '/home')</i>
                    */
                    indexPage: '/home',
                    
                    /**
                    * @ngdoc property
                    * @name swCommon.ngAuthSettings#apiServiceBaseUri
                    * @propertyOf swCommon.ngAuthSettings
                    * @returns {string} Application URL. Example: 'http://www.swaksoft.com/'. <br/><i>(Default: 'http://')</i>
                    */
                    apiServiceBaseUri: 'http://',
                    
                    /**
                    * @ngdoc property
                    * @name swCommon.ngAuthSettings#clientId
                    * @propertyOf swCommon.ngAuthSettings
                    * @returns {string} The application name. <br/><i>(Default: 'swCommon')</i>
                    */
                    clientId: 'swCommon'
                }, settings);
                
                return options;
            }
        ];
    });
})();

