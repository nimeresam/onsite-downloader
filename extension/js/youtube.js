/**
 * Modify youtube DOM
 * @param {Event} ev
 * @param {boolean} [recursive]
 */
function Youtube(ev, recursive) {
    
    // get primary div in the page
    const primary = document.getElementById("primary-inner");
    // check if this page is watch page
    if(document.location.pathname == '/watch') return appendButton(primary);

    // give it another try
    if (recursive) return;
    return setTimeout(() => Youtube(ev, true), 2000);

    /**
     * create download button 
     * @param {string} href
     * @param {string} title
     * @returns {HTMLButtonElement} 
     */
    function createButton(href, title) {
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
            width: "max-content"
        });
        // add icon class if requested
        button.innerText = "Download";
        // add origin to the href
        let url = document.location.origin + href;
        // listen to socket events
        socket.on("progress", socketEvent => {
            if(socketEvent.url != url) return;
            // set properties
            button.innerText = socketEvent.innerText;
            button.disabled = socketEvent.disabled? true: false;
        })
        // add listener to download on click
        button.addEventListener("click", function (event) {
            // give the user an option to download it as mp3
            let audioOnly = confirm("Download audio only?");
            // set button text
            button.innerText = "Waiting..";
            button.disabled = true;
            // download track       
            fetch(serviceUrl, {
                method: "POST", body: JSON.stringify({ title: title, url: url, audioOnly: audioOnly }), headers: { 'Content-Type': 'application/json' }
            })
                .then(res => res.json())
                .then(res => {
                    // TODO: log
                    button.innerText = "Running..";
                })
                .catch(err => {
                    button.innerText = "Download"; 
                    button.disabled = false;
                    console.warn("Downloader Extension: ", err);
                });
        });

        return button;
    }

    /**
     * append button to menu buttons div
     * @param {object} parent element
     * @param {string} [href=document.location.pathname] 
     */
    function appendButton(
        parent,
        href = document.location.pathname + document.location.search
    ) {
        // get size class
        const className = "style-scope ytd-menu-renderer";
        // get actions row
        const row = parent.getElementsByClassName(className)[0];
        // get title 
        const title = getTitle(parent);
        // delcare button
        const button = createButton(href, title);
        // add button to the bar
        if (row) row.appendChild(button);
    }

    function getTitle(parent) {
        const h1 = parent.getElementsByTagName("h1")[0];
        return h1 ? h1.children[0].innerText : "New Video";
    }
}

