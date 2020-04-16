
var serviceUrl = "http://localhost:4895/api/soundcloud";

window.onload = function (ev) { 
    // only for youtube
    if (document.domain.indexOf("youtube") == -1) return;

    setTimeout(() => {
        const line = document.getElementById("top-level-buttons");
        line.append(createButton());
    }, 1000)
};

/**
 * create download button 
 * @returns {HTMLButtonElement} 
 */
function createButton() {
    // create button element
    const button = document.createElement("button");
    // add base classes
    Object.assign(button.style, {
        backgroundColor: "transparent",
        color: "var(--yt-spec-text-secondary)",
        fontSize: "var(--ytd-caption_-_font-size)",
        fontWeight: "var(--ytd-caption_-_font-weight)",
        letterSpacing: "var(--ytd-caption_-_letter-spacing)",
        textTransform: "var(--ytd-caption_-_text-transform)",
        cursor: "pointer",
        border: "none",
        fontFamily: "Roboto, Arial, sans-serif",
        lineHeight: "1",
        padding: "var(--yt-button-icon-padding, 8px)",
        height: "var(--yt-button-icon-size, var(--yt-icon-height, 40px))",
    });
    // add icon class if requested
    button.innerText = "Download";
    // add listener to download on click
    // button.addEventListener("click", function (event) {
    //     // add origin to the href
    //     let url = document.location.origin + href;
    //     // set button text
    //     button.innerHTML = "Waiting..";
    //     // get track info        
    //     fetch(serviceUrl + "?url=" + url)
    //         .then(res => {
    //             // set button text
    //             button.innerText = "Running..";
    //             return res.json();
    //         })
    //         // download track
    //         .then(info => {
    //             // TODO: check info
    //             return fetch(serviceUrl, {
    //                 method: "PUT", body: JSON.stringify(info), headers: { 'Content-Type': 'application/json' }
    //             });
    //         })
    //         // reset
    //         .then(res => {
    //             button.innerText = "Done!";
    //             setTimeout(() => button.innerText = "Download", 500);
    //         })
    //         .catch(err => {
    //             button.innerText = "Failed!";
    //             setTimeout(() => button.innerText = "Download", 500);
    //             console.error("Downloader Extension: ", err);
    //         });
    // });

    return button;
}