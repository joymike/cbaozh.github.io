window.addEventListener('load', () => {

    const loginPanel = $('#loginPnl');
    const loginButton = $('#loginBtn');
    loginButton.on("click", getAuthToken);

    // If we don't have access token stored, show Login panel
    if (!sessionStorage.getItem("access_token")) {
        // Show login panel
        loginPanel.removeClass('hide');
    }

    function getAuthToken() {

        var username = $("#u1").val();
        var password = $("#p1").val();
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
                $("#error").html(JSON.stringify(JSON.parse(jqXHR.responseText), null, 4));
            }
        });
    }

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
        var url = "https://ozharvest.crittah.com/webapi/api/v1/contacts/search";
        var settings = {
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

            displayContact(response);

        }).fail(function (jqXHR, textStatus, errorThrown){

            if (jqXHR.responseText) {
                $("#error").html(JSON.stringify(JSON.parse(jqXHR.responseText), null, 4));
            }
        });
    }

    async function displayContact(contact) {

        console.log(contact);

    }
});  