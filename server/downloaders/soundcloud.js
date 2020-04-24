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
}



module.exports = Soundcloud;