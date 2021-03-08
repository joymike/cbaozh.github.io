window.addEventListener('load', () => {

    var utils = {

    };

    // See https://semantic-ui.com/modules/search.html#/examples

    $('.ui.search').search({
      apiSettings: {
        url: 'https://ozharvest.crittah.com/webapi/api/v1/customers/lookup',
        method: "post",
        data: {
            "searchString": "RPM"
        },
        onSelect(result, response) {
            var test1 = "";
        },
        onResults(response) {
            var test2 = "";
        }
      },
      fields: {
           id: 'idCustomer',
        title: 'companyName'
      },
      minCharacters : 3
    });

//   var content = [
//     {
//       title: 'Horse',
//       description: 'An Animal',
//     },
//     {
//       title: 'Cow',
//       description: 'Another Animal',
//     }
//   ]
// ;
// $('.ui.search')
//   .search({
//     source : content,
//     searchFields   : [
//       'title'
//     ],
//     fullTextSearch: false
//   });



});