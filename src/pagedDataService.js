(function () {
    'use strict';
    
    /**
    * @ngdoc service
    * @name swCommon
 
    * @description This module contains AngularJS common components
    */
    var swCommon = angular.module('swCommon', []);
    
    /**
    * @ngdoc service
    * @name swCommon.PagedDataService
    * @requires $http
    * @requires $q
    * @requires ngAuthSettings
    * @description Service that queries paged data . It can be used with ngGrid, any grind that supports paging or with an infinit-scrolling list
    * 
    * @constructor
    * @param {string} baseUrl - base URL for calling the API
    * @param {Object} data Data paging settings
    * @param {boolean} data.fixedPage True for paged grids, False for infinite scrolling lists
    * @param {boolean} data.loading True is data is currently loading, False otherwise 
    * @param {Array} data.items The items to be displayed
    * @param {number} data.totalRecords Total number of loaded records     
    * @param {Array} data.selected Selected records
    * @param {number} data.totalPages Total pages loaded
    * @param {Object} data.filterOptions Options for filtering data <table><tr>
         * <td>filterText</td><td><a href="" class="label type-hint type-hint-string">string</a></td>       
         * <td>Text to filter data</td></tr></table>    
    * @param {Object} data.sortOptions Options for sorting data <table><tr>
         * <td>fields</td><td><a href="" class="label type-hint type-hint-array">Array</a></td>
         * <td>Sort data by the given fields</td></tr>  
         * <tr>
         * <td>directions</td><td><a href="" class="label type-hint type-hint-array">Array</a></td>
         * <td>'asc' for sorting arcending, 'desc' for sorting descending</td></tr></table>
    * @param {Object} data.pagingOptions Options for paging
    * @param {Array} data.pagingOptions.pageSizes A list of possible page sizes. This option aplies only to paged grids
    * @param {number} data.pagingOptions.pageSize Specifies the number of items on a single page
    * @param {number} data.pagingOptions.currentPage The current page. This option aplies only to paged grids
    */
    angular.module('swCommon').factory('PagedDataService', ['$http', '$q', 'ngAuthSettings', function ($http, $q, ngAuthSettings) {
            var serviceBase = ngAuthSettings.apiServiceBaseUri;
           
            var PagedDataService = function (baseUrl, data) {
                this.baseUrl = baseUrl;
                
                this.data = $.extend(true, {},
                {
                        fixedPage: false,
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
                    var page = (this.data.fixedPage)
                                ? this.data.pagingOptions.currentPage
                                : null;
                    var minIdentity = null;
                    if (!this.data.fixedPage) {
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
                }                ;
                
                function find(queryOptions, deferred, isSearch) {
                    var options = getOptions.apply(this, queryOptions);
                    
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
                        
                        if (that.data.fixedPage) {
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
                }                ;
                
                return {
                    constructor: PagedDataService,
                    
                    /**
                    * @ngdoc function 
                    * @name swCommon.PagedDataService.init
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
                    * @ngdoc function 
                    * @name swCommon.PagedDataService.find
                    * @methodOf swCommon.PagedDataService
                    * @description Calls API to return the data for the next page
                    * @param {Object} queryOptions Options for quering data from the server
                    * @return {Object} the promise to return the data 
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
                    * @ngdoc function 
                    * @name swCommon.PagedDataService.search
                    * @methodOf swCommon.PagedDataService
                    * @description Calls API to search data based on the information provided in the filterOptions
                    * @param {Object} queryOptions Options for quering data from the server
                    * @return {Object} the promise to return the filtered data 
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