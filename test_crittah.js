window.addEventListener('load', () => {

    const loginPanel = $('#loginPnl');
    const loginButton = $('#loginBtn');
    loginButton.on("click", getAuthToken);

    // See if we have an token value
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
            console.log(response);
            if (response.access_token) {
                sessionStorage.setItem("access_token", response.access_token);
                loginPanel.addClass("hide");
            }
        });
    }

});  