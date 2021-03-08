window.addEventListener('load', () => {

    var utils = {

    };

    // See https://semantic-ui.com/modules/search.html#/examples

    $('.ui.search').search({
      apiSettings: {
        url: 'https://ozharvest.crittah.com/webapi/api/v1/customers/lookup',
        method: "POST",
        data: //JSON.stringify({'searchString':'RPM'}),
        {
            'searchString':'RPM'
        },
        onSelect(result, response) {
            var test1 = "";
        },
        onResults(response) {
            var test2 = "";
        },
        beforeSend: function(settings) {
            console.log(settings);
            var test3 = "";
        },
        beforeXHR: function(xhr) {
            console.log(xhr);
            // adjust XHR with additional headers   
            const token = sessionStorage.getItem("access_token");        
            xhr.setRequestHeader ('Authorization', "Bearer " + token);
            xhr.setRequestHeader ('Content-Type', 'application/json');
            return xhr;
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