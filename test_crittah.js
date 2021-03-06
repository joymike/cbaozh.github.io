window.addEventListener('load', () => {

    var utils = {

        _loginPanel: null,
        _loginButton: null,
        _errorMsgPanel: null,
        _contactsPanel: null,
        _contactsTemplateScript: null,

        init: function() {

            utils._loginPanel = $('#idLoginPnl');
            utils._loginButton = $('#idLoginBtn');
            utils._loginButton.on("click", utils.login);
            utils._errorMsgPanel = $("#idErrorMsg");

            // If we don't have access token stored, show Login panel
            if (!sessionStorage.getItem("access_token")) {
                // Show login panel
                utils._loginPanel.removeClass('hide');
            }

            utils._contactsPanel = $("#idContactPnl");

            // Get Contacts template from html
            var contactsTemplate = $('#idContactsTemplate').html();

            // Compile the template data into a function
            utils._contactsTemplateScript = Handlebars.compile(contactsTemplate);

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
            });

            // Receive context updates, eg. when user selects email in the list
            Front.contextUpdates.subscribe(context => {

                switch(context.type) {
                    case 'noConversation':
                        console.log('No conversation selected');
                        break;
                    case 'singleConversation':
                        console.log('Selected conversation:', context.conversation);
                        utils.getContact(context.conversation.recipient);
                        break;
                    case 'multiConversations':
                        console.log('Multiple conversations selected', context.conversations);
                        break;
                    default:
                        console.error(`Unsupported context type: ${context.type}`);
                        break;
                }
            });

        },

        login: function() {
            // Authenticate user and receive access token
            utils.getAuthToken();
        },

        getAuthToken: function() {

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
    
                if (response["access_token"]) {
                    sessionStorage.setItem("access_token", response["access_token"]);
                    utils._loginPanel.addClass("hide");
                }
            }).fail(function (jqXHR, textStatus, errorThrown){
    
                if (jqXHR.responseText) {
                    utils._errorMsgPanel.html(JSON.stringify(JSON.parse(jqXHR.responseText), null, 4));
                }
            });
        },

        getContact: function(recipient) {

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
    
                utils.displayContacts(response);
    
            }).fail(function (jqXHR, textStatus, errorThrown){
    
                if (jqXHR.responseText) {
                    utils._errorMsgPanel.html(JSON.stringify(JSON.parse(jqXHR.responseText), null, 4));
                } else {
                    // Probably access token has expired
                    sessionStorage.removeItem("access_token");
                    // Remove contacts
                    utils._contactsPanel.html(); 
                    // Display Login form
                    utils._loginPanel.removeClass("hide");
                }
            });
        },

        displayContacts: function(contacts) {

            // Combine template with data
            var html = utils._contactsTemplateScript({"contacts": contacts});
            
            // Insert Contacs html into the page
            utils._contactsPanel.html(html);        
    
        }
        
    }

    utils.init();


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

    //const button = document.querySelector('button');

});  