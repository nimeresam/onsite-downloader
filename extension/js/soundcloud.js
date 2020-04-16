var currentUrl = "";

window.onload = function (ev) {
    // only for sound cloud
    if (document.domain.indexOf("soundcloud") == -1) return;
    // modfiy DOM 
    modifyDOM(ev);
    // listen to events to detect navigation
    window.addEventListener("popstate", modifyDOM);
    window.addEventListener("click", modifyDOM);
};

/**
 * create download button 
 * @param {string} [url] 
 * @returns {HTMLButtonElement} 
 */
function getButton({
    href = document.location.pathname,
    size = "medium",
    iconOnly = false
} = {}) {
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
    if (iconOnly) button.classList.add("sc-button-icon");
    // 
    button.innerText = "Download";
    // add listener to download on click
    button.addEventListener("click", function (event) {
        // add origin to the href
        href = document.location.origin + href;
        fetch("http://localhost:4895/api/soundcloud?url=" + href)
            .then(res => res.json())
            .then(res => {
                if (!res.href) return alert("Failed to download song");
                // get downloadable href
                console.log(res);
            })
            .catch(err => console.error("Downloader Extension: ", err));
    });

    return button;
}

/**
 * listen to page events to detect navigations
 * @param {Event} ev
 */
function modifyDOM(ev) {
    if (currentUrl == document.location.href) return;
    // update currentUrl
    currentUrl = document.location.href;

    // handle tracklist
    if (document.getElementsByClassName("trackList__item sc-border-light-bottom").length) {
        const tracklist = document.getElementsByClassName("trackList__item sc-border-light-bottom");
        // loop through list
        for (let index = 0; index < tracklist.length; index++) {
            // get track outer element
            const track = tracklist[index];
            // get href from title anchor
            const href = track.getElementsByTagName("a")[1].getAttribute("href");
            // declare button
            const button = getButton({ href, iconOnly: true, size: "small" });
            // add button to actions list
            const row = track.getElementsByClassName("sc-button-group sc-button-group-small")[0];
            if (row) row.appendChild(button);
        }
        return;
    }
    // handle search list
    if (document.getElementsByClassName("search__listWrapper").length) {
        const searchList = document.getElementsByClassName("searchList__item");
        // loop through list
        for (let index = 0; index < searchList.length; index++) {
            // get track outer element
            const track = searchList[index];
            // get href from title anchor
            const href = track.getElementsByTagName("a")[0].getAttribute("href");
            // declare button
            const button = getButton({ href, size: "small" });
            // add button to actions list
            const row = track.getElementsByClassName("sc-button-group sc-button-group-small")[0];
            if (row) row.appendChild(button);
        }
        return;
    }
    // handle listener wrapper
    if (document.getElementsByClassName("l-listen-hero").length) {
        // get actions row
        const row = document.getElementsByClassName("sc-button-group sc-button-group-medium")[0];
        // delcare button
        const button = getButton();
        // add button to the bar
        if (row) row.appendChild(button);
    }
}