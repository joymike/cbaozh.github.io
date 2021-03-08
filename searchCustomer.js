window.addEventListener('load', () => {

    var utils = {

    };

    // See https://semantic-ui.com/modules/search.html#/examples

    $('.ui.search').search({
        debug: true,
        verbose: true,
        apiSettings: {
            url: 'https://ozharvest.crittah.com/webapi/api/v1/customers/lookup',
            method: "POST",
            data: JSON.stringify({'searchString':'RPM'}),
        // {
        //     'searchString':'RPM'
        // },
            onSelect(result, response) {
                var test1 = "";
            },
            beforeSend: function(settings) {
                //console.log(settings);
                return settings;
            },
            beforeXHR: function(xhr) {
                // adjust XHR with additional headers   
                const token = sessionStorage.getItem("access_token"); 
                // cancel request
                if(!token) {
                    $(this).state('flash text', 'Requires Login!');
                    return false;
                }       
                xhr.setRequestHeader ('Authorization', "Bearer " + token);
                xhr.setRequestHeader ('Content-Type', 'application/json');
                return xhr;
            }, 
            onResponse: function(crittahResponse) {
                // make some adjustments to response
                if(!crittahResponse || !Object.keys(crittahResponse).length === 0) {
                return;
                }
                var response = {
                    results : []
                };            
                // translate Crittah API response to work with search
                $.each(Object.values(crittahResponse), function(index, item) {
                response.results.push({
                    title       : item.companyName,
                    description : item.description
                    //id          : item.idCustomer
                });
                });
                return response;
            },       
            onSuccess: function(response) {
                // valid response and response.success = true
                console.log(response);
            }      
      },
    //   fields: {
    //        id: 'idCustomer',
    //     title: 'companyName'
    //   },
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