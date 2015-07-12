(function () {
    'use strict';
    
    /**
    * @ngdoc service
    * @name swCommon
 
    * @description This module contains AngularJS common components
    * <h2> Providers </h2>
    * - {@link swCommon.swAppSettingsProvider swAppSettings} 
    * <h2> Services </h2> 
    * - {@link swCommon.PagedDataService PagedDataService}
    */
    var swCommon = angular.module('swCommon', []);
    
    /**
    * @ngdoc service
    * @name swCommon.PagedDataService
    * @requires $http
    * @requires $q
    * @requires swCommon.swAppSettings
    * @description Service that queries paged data.  
    * It can be used with ngGrid, any grind that supports paging or with an infinit-scrolling list
    * 
    * @constructor
    * @param {string} baseUrl base URL for calling the API
    * @param {Object} options Data paging options
    * @param {boolean} [options.fixedPage=false] True for paged grids, False for infinite scrolling lists   
    * @param {Object} options.filterOptions Options for filtering data <table><tr>
         * <td>filterText</td><td><a href="" class="label type-hint type-hint-string">string</a></td>       
         * <td>Text to filter data</td></tr></table>    
    * @param {Object} [options.sortOptions={ fields: new Array(), directions: new Array("asc") }] Options for sorting data <table>
         * <tr>
         * <td>fields</td><td><a href="" class="label type-hint type-hint-array">Array</a></td>
         * <td>Sort data by the given fields</td></tr>  
         * <tr>
         * <td>directions</td><td><a href="" class="label type-hint type-hint-array">Array</a></td>
         * <td>'asc' for sorting arcending, 'desc' for sorting descending. Default is ['asc']</td></tr></table>
    * @param {Object} [options.pagingOptions = { pageSizes: new Array(5, 10, 20, 50, 100), pageSize: 10 }] Options for paging <table>
        * <tr>
        * <td>pageSizes</td><td><a href="" class="label type-hint type-hint-array">Array</a></td>
        * <td>A list of possible page sizes. This option aplies only to paged grids. Default is [5, 10, 20, 50, 100].</td></tr>
        * <tr>
        * <td>pageSize</td><td><a href="" class="label type-hint type-hint-number">number</a></td> 
        * <td>Specifies the number of items on a single page. Default is 10.</td></tr> 
        * <tr>
        * <td>currentPage</td><td><a href="" class="label type-hint type-hint-number">number</a></td> 
        * <td>The current page. This option aplies only to paged grids</td></tr></table> 
     * @example
     * <pre>
        (function () {
            'use strict';

            //A service that inherits from the PagedDataService
            angular.module('app').factory('StreamedTweetsService', ['PagedDataService', 
                function (PagedDataService) {
                    var StreamedTweetsService = function() {
                        PagedDataService.apply(this, ['api/StreamedTweets', {                            
                                pagingOptions: {
                                    pageSize: 5
                                }
                        }]);
                    };

                    StreamedTweetsService.prototype = new PagedDataService();

                    return StreamedTweetsService;
                }]);
        })();     
    * </pre> 
    */
    angular.module('swCommon').factory('PagedDataService', ['$http', '$q', 'swAppSettings', function ($http, $q, swAppSettings) {
        var serviceBase = swAppSettings.apiServiceBaseUri;
 
        var PagedDataService = function (baseUrl, options) {
            this.baseUrl = baseUrl;
                
            this.fixedPage = (options && options.fixedPage) ? options.fixedPage : false;
                
            var data = {
                filterOptions: (options && options.filterOptions) ? options.filterOptions : {},
                sortOptions: (options && options.sortOptions) ? options.sortOptions : {},
                pagingOptions: (options && options.pagingOptions) ? options.pagingOptions : {}
            };

            this.data = $.extend(true, {},
            {
                    loading: false,
                    items: [],
                    totalRecords: 0,
                    selected: [],
                    totalPages: 0,
                    
                    filterOptions: {
                        filterText: '',
                        externalFilter: 'searchText',
                        useExternalFilter: true
                    },
                    sortOptions: {
                        fields: [],
                        directions: ["asc"]
                    },
                    
                    pagingOptions: {
                        pageSizes: [5, 10, 20, 50, 100],
                        pageSize: 10,
                        currentPage: 0
                    }
                }, data);
            };
            
        PagedDataService.prototype = (function () {
            function getOptions(queryOptions) {
                var query = (queryOptions) ? queryOptions : {};
                var page = (this.fixedPage)
                            ? this.data.pagingOptions.currentPage
                            : null;
                var minIdentity = null;
                if (!this.fixedPage) {
                    var max = this.data.items.length - 1;
                    if (max > -1) {
                        minIdentity = this.data.items[max].Id;
                    }
                }
                    
                return {
                    queryOptions: $.extend(true, {}, query,
                    {
                        sortByField: (this.data.sortOptions.fields.length > 0)
                            ? this.data.sortOptions.fields[0]
                            : null,
                        sortDescending: (this.data.sortOptions.directions.length > 0)
                            ? (this.data.sortOptions.directions[0] === "desc")
                            : false,
                        searchText: this.data.filterOptions.filterText
                    }),
                    page: page,
                    minIdentity: minIdentity,
                    pageSize: this.data.pagingOptions.pageSize
                };
            };
                
            function find(queryOptions, deferred, isSearch) {
                var options = this._(getOptions)(queryOptions);

                this.data.loading = true;
                    
                var that = this;
                $http.post(serviceBase + this.baseUrl, options)
                    .success(function (data) {
                    if (isSearch) {
                        deferred.notify(options);
                            
                        var continueSearch = (that.data.filterOptions.filterText !== options.queryOptions.searchText);
                            
                        if (continueSearch) {
                            that._(find)(queryOptions, deferred, true);
                            return;
                        }
                    }
                        
                    if (that.fixedPage) {
                        that.data.items = data.Content;
                    }
                    else {
                        if (that.data.pagingOptions.currentPage < 1) {
                            that.data.items = data.Content;
                        } else {
                            for (var i = 0; i < data.Content.length; i++) {
                                that.data.items.push(data.Content[i]);
                            }
                        }
                            
                        that.data.pagingOptions.currentPage++;
                    }
                        
                    that.data.totalRecords = data.TotalRecords;
                        
                    that.data.loading = false;
                        
                    deferred.resolve(data);

                })
                .error(function (err) {
                        
                    that.data.loading = false;
                        
                    deferred.reject(err.Message);
                });
            };
                
            return {
                constructor: PagedDataService,
                    
                /**
                * @ngdoc method
                * @name swCommon.PagedDataService#init
                * @methodOf swCommon.PagedDataService
                * @description Initializes the data in the paged list. Clears the list of items
                */
                init: function () {
                    this.data.items = [];
                    this.data.totalRecords = 0;
                    this.data.totalPages = 0;
                    this.data.pagingOptions.currentPage = 0;
                    this.data.loading = false;
                },
                    
                /**
                * @ngdoc method
                * @name swCommon.PagedDataService#find
                * @methodOf swCommon.PagedDataService
                * @description Calls API to return the data for the next page
                * @param {Object} queryOptions Options for quering data from the server
                * @returns {Object} the promise to return the data 
                */
                find: function (queryOptions) {
                    if (this.data.loading) {
                        var defer = $q.defer();
                        defer.reject();
                        return defer.promise;
                    }
                        
                    var deferred = $q.defer();
                        
                    this._(find)(queryOptions, deferred, false);
                        
                    return deferred.promise;
                },
                    
                /**
                * @ngdoc method 
                * @name swCommon.PagedDataService#search
                * @methodOf swCommon.PagedDataService
                * @description Calls API to search data based on the information provided in the filterOptions
                * @param {Object} queryOptions Options for quering data from the server
                * @returns {Object} the promise to return the filtered data 
                */                    
                search: function (queryOptions) {
                    var deferred = $q.defer();
                        
                    if (this.data.loading) {
                        deferred.reject();
                        return deferred.promise;
                    }
                        
                    this.data.pagingOptions.currentPage = 0;
                        
                    this._(find)(queryOptions, deferred, true);
                        
                    return deferred.promise;
                },
                    
                // define private methods dedicated one
                _: function (callback) {
                        
                    // instance referer
                    var self = this;
                        
                    // callback that will be used
                    return function () {
                        return callback.apply(self, arguments);
                    };
                }
            }
        })();
            
        return PagedDataService;
    }]);
})();