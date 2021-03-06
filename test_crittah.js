window.addEventListener('load', () => {

    const loginPanel = $('#idLoginPnl');
    const loginButton = $('#idLoginBtn');
    loginButton.on("click", getAuthToken);

    // If we don't have access token stored, show Login panel
    if (!sessionStorage.getItem("access_token")) {
        // Show login panel
        loginPanel.removeClass('hide');
    }

    function getAuthToken() {

        var username = $("#idUserName").val();
        var password = $("#idPassword").val();
        var url = "https://ozharvest.crittah.com/webapi/oauth/token";
        var settings = {
            "url": url,
            "type": "POST",
            "timeout": 0,
            "data": "grant_type=password&password=" + encodeURIComponent(password) + "&username=" + encodeURIComponent(username),
            "headers": {
                "Content-Type": "text/plain"
            }
        };

        $.ajax(settings).done(function (response) {

            if (response.access_token) {
                sessionStorage.setItem("access_token", response.access_token);
                loginPanel.addClass("hide");
            }
        }).fail(function (jqXHR, textStatus, errorThrown){

            if (jqXHR.responseText) {
                $("#idErrorMsg").html(JSON.stringify(JSON.parse(jqXHR.responseText), null, 4));
            }
        });
    }

    
    // Get Contacts template from html
    var contactsTemplate = $('#idContactsTemplate').html();

    // Compile the template data into a function
    var contactsTemplateScript = Handlebars.compile(contactsTemplate);

    // Condition to display status icon
    Handlebars.registerHelper('ifStatus', function(status, options) {
        if(status === "Active") {
          return options.fn(this);
        }
        return options.inverse(this);
    });

    Handlebars.registerHelper('formatPhone', function (mobile, phone) {
        if (mobile && phone) {
            return `${mobile}, ${phone}`;
        } else if (!mobile && phone) {
            return phone;
        } else if (mobile && !phone) {
            return mobile;
        }
        return "";
    })

    let hasConversation;

    // Receive context updates
    Front.contextUpdates.subscribe(context => {

        switch(context.type) {
            case 'noConversation':
                console.log('No conversation selected');
                break;
            case 'singleConversation':
                console.log('Selected conversation:', context.conversation);
                hasConversation = true;
                getContact(context.conversation.recipient);
                break;
            case 'multiConversations':
                console.log('Multiple conversations selected', context.conversations);
                break;
            default:
                console.error(`Unsupported context type: ${context.type}`);
                break;
        }
    });

    async function getContact(recipient) {

        const token = sessionStorage.getItem("access_token");
        if (!token || !recipient || !recipient.handle) {
            return;
        }
        const url = "https://ozharvest.crittah.com/webapi/api/v1/contacts/search";
        
        // For test only
        // recipient.handle = "james.skurray@crittah.com";
        
        const settings = {
            "url": url,
            "type": "POST",
            "timeout": 0,
            "data": JSON.stringify({"email":recipient.handle}),
            "headers": {
                "Authorization": "Bearer " + token,
                "Content-Type": "application/json"
            }
        };

        $.ajax(settings).done(function (response) {

            displayContacts(response);

        }).fail(function (jqXHR, textStatus, errorThrown){

            if (jqXHR.responseText) {
                $("#idErrorMsg").html(JSON.stringify(JSON.parse(jqXHR.responseText), null, 4));
            }
        });
    }

    // Display Contacts
    // contactRef: "1470742"
    // edit: "/Contact/edit/66472d58-8ef9-4687-9455-a54dca123dd1"
    // email: "james.skurray@crittah.com"
    // fax: ""
    // firstName: "James"
    // idContact: "66472d58-8ef9-4687-9455-a54dca123dd1"
    // idContactSelector: "66472d58-8ef9-4687-9455-a54dca123dd1"
    // lastName: "Skurray"
    // mobile: "0416 234 970"
    // phone: ""
    // salutation: "Mr"
    // status: "Active"
    // view: "/Contact/view/66472d58-8ef9-4687-9455-a54dca123dd1"
    function displayContacts(contacts) {

        // Combine template with data
        var html = contactsTemplateScript({"contacts": contacts});
        
        // Insert Contacs html into the page
        $("#idContactPnl").html(html);        

    }

    //const button = document.querySelector('button');

});  