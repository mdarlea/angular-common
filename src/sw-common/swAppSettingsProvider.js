(function () {
    'use strict';

    /**
    * @ngdoc service
    * @name swCommon.swAppSettingsProvider  
    * @description {@link swCommon.swAppSettings swAppSettings} provider
    * @example    
    *   <pre>
        (function () {
            'use strict';

            angular.module('app').config(['swAppSettingsProvider', 
                function (swAppSettingsProvider) {
                    swAppSettingsProvider.setSettings({
                        apiServiceBaseUri: "http://www.swaksoft.com/",
                        clientId: "SocialMediaApp"
                    });
            }]);
        })();      
    *  </pre>  
    */ 

    /**
    * @ngdoc service
    * @name swCommon.swAppSettings    
    * @description {@link swCommon.swAppSettingsProvider Provider} <br/>
    *   Provides application configuration for different environments such as: Dev, QA, Production
    */
    angular.module('swCommon').provider('swAppSettings', function () {
        var settings = {};
        
       /**
       * @ngdoc method
       * @name swCommon.swAppSettings#setSettings
       * @methodOf swCommon.swAppSettings
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
                    * @name swCommon.swAppSettings#indexPage
                    * @propertyOf swCommon.swAppSettings
                    * @returns {string} Path to the application's home (index) page. <br/><i>(Default: '/home')</i>
                    */
                    indexPage: '/home',
                    
                    /**
                    * @ngdoc property
                    * @name swCommon.swAppSettings#apiServiceBaseUri
                    * @propertyOf swCommon.swAppSettings
                    * @returns {string} Application URL. Example: 'http://www.swaksoft.com/'. <br/><i>(Default: 'http://')</i>
                    */
                    apiServiceBaseUri: 'http://',
                    
                    /**
                    * @ngdoc property
                    * @name swCommon.swAppSettings#clientId
                    * @propertyOf swCommon.swAppSettings
                    * @returns {string} The application name. <br/><i>(Default: 'swCommon')</i>
                    */
                    clientId: 'swCommon'
                }, settings);
                
                return options;
            }
        ];
    });
})();

