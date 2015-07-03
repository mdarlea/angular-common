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
* @returns {Object} The data which can be bounded to the grid on list <table>
   <tr>
        <th>Property</th>
        <th>Type</th>
        <th>Details</th>
   </tr>
   <tr>
       <td>loading</td>
       <td><a href="" class="label type-hint type-hint-boolean">Boolean</a></td>
       <td>True if data is currently loading, False otherwise</td>
   </tr> 
   <tr>
      <td>items</td>
      <td><a href="" class="label type-hint type-hint-array">Array</a></td>
      <td>The items to be displayed</td>
   </tr>    
   <tr>
      <td>totalRecords</td>
      <td><a href="" class="label type-hint type-hint-number">Number</a></td>
      <td>Total number of loaded records</td>
   </tr>      
   <tr>
      <td>selected</td>
      <td><a href="" class="label type-hint type-hint-array">Array</a></td>
      <td>Selected records</td>
   </tr>
   <tr>
      <td>totalPages</td>
      <td><a href="" class="label type-hint type-hint-number">Number</a></td>
      <td>Total pages loaded</td>
   </tr>
   <tr>
      <td>filterOptions</td>
      <td><a href="" class="label type-hint type-hint-object">Object</a></td>
      <td>Options for filtering data <table><tr>
         <td>filterText</td><td><a href="" class="label type-hint type-hint-string">string</a></td>       
         <td>Text to filter data</td></tr></table></td>
   </tr>
    <tr>
      <td>sortOptions</td>
      <td><a href="" class="label type-hint type-hint-object">Object</a></td>
      <td>Options for sorting data <table><tr>
         <td>fields</td><td><a href="" class="label type-hint type-hint-array">Array</a></td>
         <td>Sort data by the given fields</td></tr>  
         <tr>
         <td>directions</td><td><a href="" class="label type-hint type-hint-array">Array</a></td>
         <td>'asc' for sorting arcending, 'desc' for sorting descending. Default is ['asc']</td></tr></table></td>
   </tr>
    <tr>
      <td>pagingOptions</td>
      <td><a href="" class="label type-hint type-hint-object">Object</a></td>
      <td>Options for paging <table><tr>
        <td>pageSizes</td><td><a href="" class="label type-hint type-hint-array">Array</a></td>
        <td>A list of possible page sizes. This option aplies only to paged grids. Default is [5, 10, 20, 50, 100].</td></tr>
        <tr>
        <td>pageSize</td><td><a href="" class="label type-hint type-hint-number">number</a></td> 
        <td>Specifies the number of items on a single page. Default is 10.</td></tr> 
        <tr>
        <td>currentPage</td><td><a href="" class="label type-hint type-hint-number">number</a></td> 
        <td>The current page. This option aplies only to paged grids</td></tr></table></td>
   </tr> 
  </table>               
*/

