
var serviceUrl = "http://localhost:4895/api/soundcloud";

window.onload = function (ev) {
    // only for sound cloud
    if (document.domain.indexOf("soundcloud") == -1) return;
    var currentUrl = "";
    // modfiy DOM 
    callback(event, 0);

    // listen to events to detect navigation
    window.addEventListener("popstate", event => callback(event, 1500));
    window.addEventListener("click", callback);
    window.addEventListener("keyup", event => {
        if (event.keyCode === 13) callback(event, 1500);
    });

    /**
     * Use to check href and call modifyDOM
     * @param {Event} event 
     * @param {number} time 
     */
    function callback(event, time = 1000) {
        setTimeout(() => {
            if (currentUrl == document.location.href) return;
            // update currentUrl
            currentUrl = document.location.href;
            modifyDOM(event);
        }, time);
    }
};

/**
 * create download button 
 * @param {string} href
 * @param {'small' | 'medium'} size
 * @returns {HTMLButtonElement} 
 */
function createButton(href, size) {
    // create button element
    const button = document.createElement("button");
    // add base classes
    button.classList.add(
        "sc-button",
        "sc-button-" + size,
        "sc-button-download",
        "sc-button-responsive"
    );
    // add icon class if requested
    button.innerText = "Download";
    // add listener to download on click
    button.addEventListener("click", function (event) {
        // add origin to the href
        let url = document.location.origin + href;
        // set button text
        button.innerHTML = "Waiting..";
        // get track info        
        fetch(serviceUrl + "?url=" + url)
            .then(res => {
                // set button text
                button.innerText = "Running..";
                return res.json();
            })
            // download track
            .then(info => {
                // TODO: check info
                return fetch(serviceUrl, {
                    method: "PUT", body: JSON.stringify(info), headers: { 'Content-Type': 'application/json' }
                });
            })
            // reset
            .then(res => {
                button.innerText = "Done!";
                setTimeout(() => button.innerText = "Download", 500);
            })
            .catch(err => {
                button.innerText = "Failed!";
                setTimeout(() => button.innerText = "Download", 500);
                console.error("Downloader Extension: ", err);
            });
    });

    return button;
}

/**
 * listen to page events to detect navigations
 * @param {Event} ev
 * @param {boolean} [recursive]
 */
function modifyDOM(ev, recursive) {
    // handle tracklist
    if (document.getElementsByClassName("trackList__item sc-border-light-bottom").length)
        return extractList("trackList__item sc-border-light-bottom", 1);
    // handle search list
    if (document.getElementsByClassName("search__listWrapper").length)
        return extractList("searchList__item", 0);
    // handle listener wrapper
    if (document.getElementsByClassName("l-listen-hero").length)
        return appendButton('medium');
    // give it another try
    if(recursive) return;
    return setTimeout(() => modifyDOM(ev, true), 1500);    
}

/**
 * Use to add download buttons for the entire tracklist
 * @param {string} className 
 * @param {number} hrefIndex 
 */
function extractList(className, hrefIndex) {
    const tracklist = document.getElementsByClassName(className);
    // loop through list
    for (let index = 0; index < tracklist.length; index++) {
        // get track outer element
        const track = tracklist[index];
        // get href from title anchor
        const href = track.getElementsByTagName("a")[hrefIndex].getAttribute("href");
        // append button
        appendButton('small', href, track);
    }
}

/**
 * append button to button group
 * @param {'small' | 'medium'} size
 * @param {string} [href=document.location.pathname] 
 * @param {object} [parent=document] 
 */
function appendButton(
    size,
    href = document.location.pathname,
    parent = document
) {
    // get size class
    const className = "sc-button-group sc-button-group-" + size;
    // get actions row
    const row = parent.getElementsByClassName(className)[0];
    // delcare button
    const button = createButton(href, size);
    // add button to the bar
    if (row) row.appendChild(button);
}