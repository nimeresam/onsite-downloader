// backend APIs
var serviceUrl = "http://localhost:4895/api";
// used to track href changes
var currentUrl = "";
// create socket io client
const socket = io.connect("http://localhost:4895/");

window.addEventListener("load", function (ev) {
    var fn;
    // declare object based on domain
    switch (document.domain) {
        case "soundcloud.com":
            fn = Soundcloud;
            serviceUrl += "/soundcloud";
            break;
        case "www.youtube.com":
            fn = Youtube;
            serviceUrl += "/youtube";
            break;
    }

    // modfiy DOM 
    callback(event, 0);

    // listen to events to detect navigation
    window.addEventListener("popstate", event => callback(event, 1500));
    window.addEventListener("click", callback);
    window.addEventListener("keyup", event => {
        if (event.keyCode === 13) callback(event, 1500);
    });

    /**
     * listen to page events to detect navigations
     * @param {Event} event 
     * @param {number} [time=1000] 
     */
    function callback(event, time = 1000) {
        setTimeout(() => {
            if (currentUrl == document.location.href) return;
            // update currentUrl
            currentUrl = document.location.href;
            fn(event);
        }, time);
    }
});


