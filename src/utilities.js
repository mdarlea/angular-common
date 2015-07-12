(function () {
    'use strict';
    
    /**
    * @ngdoc object
    * @name swCommon.$utilities    
    * @description Utility functions (helpers)
    */
    angular.module('swCommon').value("$utilities", {
        /**
        * @ngdoc method
        * @name swCommon.$utilities#parseQueryString
        * @methodOf swCommon.$utilities 
        * @param {string} queryString The query string
        * @description Parses the key/value pairs from a query string into an object
        * @returns {Object} the parsed query string
        */  
        parseQueryString: function (queryString) {
            var data = {}, pair, separatorIndex, escapedKey, escapedValue, key, value;
            if (!queryString) {
                return data;
            }
            
            var pairs = queryString.split("&");
            
            for (var i = 0; i < pairs.length; i++) {
                pair = pairs[i];
                separatorIndex = pair.indexOf("=");
                
                if (separatorIndex === -1) {
                    escapedKey = pair;
                    escapedValue = null;
                } else {
                    escapedKey = pair.substr(0, separatorIndex);
                    escapedValue = pair.substr(separatorIndex + 1);
                }
                
                key = decodeURIComponent(escapedKey);
                value = decodeURIComponent(escapedValue);
                
                data[key] = value;
            }
            
            return data;
        },
        
        /**
        * @ngdoc method
        * @name swCommon.$utilities#getFragment
        * @methodOf swCommon.$utilities
        * @param {string} url The URL
        * @description Parses the query string from an URL into an object. 
        *  Calls the {@link swCommon.$utilities#parseQueryString parseQueryString} method to perform the parsing
        * @returns {Object} the parsed query string
        */  
        getFragment: function (url) {
            var pos = url.indexOf("?");
            if (pos > 0) {
                return this.parseQueryString(url.substr(pos + 1));
            } else {
                return {};
            }
        }
    });
})();