/**
* @ngdoc property
* @name swCommon.PagedDataService#baseUrl
* @propertyOf swCommon.PagedDataService
* @returns {string} base URL for calling the API
*/

/**
* @ngdoc property
* @name swCommon.PagedDataService#fixedPage 
* @propertyOf swCommon.PagedDataService
* @returns {boolean} True for paged grids, False for infinite scrolling lists                
*/

/**
* @ngdoc property
* @name swCommon.PagedDataService#data 
* @propertyOf swCommon.PagedDataService
* @returns {Object} The data which can be bounded to the grid or list 
 * | Property           | Type                                                              | Details                                               |
 * |--------------------|---------------------------------------------------------------------------------------------------------------------------|
 * | loading            | <a href="" class="label type-hint type-hint-boolean">Boolean</a>  | True if data is currently loading, False otherwise    |
 * | items              | <a href="" class="label type-hint type-hint-array">Array</a>      | The items to be displayed                             |
 * | totalRecords       | <a href="" class="label type-hint type-hint-number">Number</a>    | Total number of loaded records                        |
 * | selected           | <a href="" class="label type-hint type-hint-array">Array</a>      | Selected records                                      |
 * | totalPages         | <a href="" class="label type-hint type-hint-number">Number</a>    | Total pages loaded                                    |
 * | filterOptions      | <a href="" class="label type-hint type-hint-object">Object</a>    | Options for filtering data <table><tr><td>filterText</td><td><a href="" class="label type-hint type-hint-string">string</a></td><td>Text to filter data</td></tr></table> |
 * | sortOptions        | <a href="" class="label type-hint type-hint-object">Object</a>    | Options for sorting data <table><tr><td>fields</td><td><a href="" class="label type-hint type-hint-array">Array</a></td><td>Sort data by the given fields</td></tr><tr><td>directions</td><td><a href="" class="label type-hint type-hint-array">Array</a></td><td>'asc' for sorting arcending, 'desc' for sorting descending. <i>(Default: ['asc'])</i></td></tr></table> |
 * | pagingOptions      | <a href="" class="label type-hint type-hint-object">Object</a>    | Options for paging <table><tr><td>pageSizes</td><td><a href="" class="label type-hint type-hint-array">Array</a></td><td>A list of possible page sizes. This option aplies only to paged grids. <i>(Default: [5, 10, 20, 50, 100])</i></td></tr><tr><td>pageSize</td><td><a href="" class="label type-hint type-hint-number">number</a></td><td>Specifies the number of items on a single page. <i>(Default: 10)</i></td></tr><tr><td>currentPage</td><td><a href="" class="label type-hint type-hint-number">number</a></td><td>The current page. This option aplies only to paged grids</td></tr></table>      |
*/

