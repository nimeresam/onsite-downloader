const fs = require("fs");

const puppeteer = require("puppeteer");
const request = require("request");

class Soundcloud extends require("./downloader") {

    constructor() {
        super(".mp3");
    }

    /**
     * download youtube video 
     * @param {string} url
     * @param {string} fileName
     * @returns {Promise} download result
     */
    downlaod({
        href,
        fileName
    }) {
        return new Promise((resolve, reject) => {
            // add file to downloads folder
            fileName = this._getPath(fileName);
            request.get(href)
                .on('complete', () => resolve({ fileName }))
                .on('error', reject)
                .pipe(fs.createWriteStream(fileName));
        });
    }

    /**
     * Get soundcloud track info
     * @param {string} url 
     * @returns {Promise<object>} track info including: fileName, thumbnail and href
     */
    async getInfo(url) {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto("https://sclouddownloader.net/");
        // check that all expected elements exists
        const [input, form] = await page.evaluate(() => {
            const input = document.getElementsByName("sound-url")[0];
            const form = document.getElementsByName("myDownloadForm")[0];
            return [input, form];
        });
        if (!input || !form) throw "Something changed at your host website";
        // fill url 
        await page.type('input[name="sound-url"]', url);
        // press submit
        await Promise.all([
            page.waitForNavigation({ waitUntil: "domcontentloaded" }),
            page.click('input[type="submit"]')
        ]);
        // get song name, thumbnail and href
        const result = await page.evaluate(() => {
            const fileName = document.getElementsByTagName("i")[1].innerText;
            const thumbnail = document.getElementById("thumbnail").getAttribute("src");
            const button = document.getElementsByClassName("expanded button")[1];
            const href = button.getAttribute("href");
            return { fileName, thumbnail, href };
        });

        await browser.close();

        return result;
    }

    /**
     * get soundcloud playlist info 
     * @param {string} url 
     * @returns {object} info like: artist, album, artwork and playlist items
     */
    async getPlaylistInfo(url) {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto(url);
        // check that all expected elements exists
        const result = await page.evaluate(() => {
            const ul = document.getElementsByClassName("trackList__item");
            if (!ul || !ul.length) return {};
            // create playlist details
            const playlist = Array(ul.length).fill({}).map((el, index) => {
                let li = ul[index];
                // get url
                let anchor = li.getElementsByClassName("trackItem__trackTitle")[0];
                let href = "https://www.soundcloud.com" + anchor.getAttribute("href");
                let title = anchor.innerText;
                // get song number
                let number = li.getElementsByClassName("trackItem__number")[0].innerText;
                // return items
                return { href, title, number };
            });
            // get album name
            const span = document.getElementsByClassName("soundTitle__title")[0];
            const album = span ? span.getElementsByTagName("span")[0].innerText : "";
            // get artist name
            const anchor = document.getElementsByClassName("soundTitle__username")[0];
            const artist = anchor ? anchor.innerText : "";
            // get artwork
            const artwork = document.getElementsByClassName("listenArtworkWrapper__artwork")[0]
                .getElementsByTagName("span")[0]
                .style.backgroundImage
                .replace("url(\"", '')
                .replace("\")", '');
            // get year
            const published = document.getElementsByClassName("relativeTime")[0].getAttribute("datetime");
            const year = new Date(published).getFullYear();

            return { artist, album, artwork, year, playlist };
        });

        await browser.close();

        return result;
    }

    /**
     * download playlist
     * @param {object[]} playlist each object has: id, url and name
     * @param {string} [folder] name to save all items in
     */
    async downloadPlaylist({
        playlist,
        folder
    }) {
        // download each track seperately
        for (let track of playlist) {
            let { url, name: fileName } = track;
            await this.download({ url, fileName, folder }).catch(err => { /* Just to catch */ });
        }
        return "Done!";
    }
}

module.exports = Soundcloud;