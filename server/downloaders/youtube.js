const fs = require("fs");

const ytdl = require("ytdl-core");
const ytpl = require("youtube-playlist");

class Youtube extends require("./downloader") {

    /**
     * get video info
     * @param {string} url 
     * @returns {Promise<object>} video info like: author, published, media, video_id, title, length_seconds, thumbnail, adaptiveFormats
     */
    async getInfo(url) {
        const { author, published, media, video_id, title, length_seconds, player_response } = await ytdl.getInfo(url).catch(err => { throw err; });
        const { adaptiveFormats } = player_response.streamingData;
        const thumbnail = player_response.microformat.playerMicroformatRenderer.thumbnail.thumbnails[0];
        return { author, published, media, video_id, title, length_seconds, thumbnail, adaptiveFormats };
    }

    /**
     * download youtube video 
     * @param {string} url
     * @param {string} fileName 
     * @param {bool} [audioOnly] 
     * @param {'lowest' | 'highest'} [quality='highest'] 
     * @returns {Promise} download result
     */
    download({
        url,
        title,
        audioOnly,
        quality = "highest"
    }) {
        // TODO: check filter and quality spilling
        return new Promise((resolve, reject) => {
            // check extension
            var extension = ".mp4";
            // handle audio filter and quality
            if (audioOnly) {
                quality += "audio";
                extension = ".mp3";
            }
            // else quality += "video";
            // used to avoid duplicates
            var currentPercent = 0;
            // add file to downloads folder
            const path = this._getPath(title, extension);
            ytdl(url, { quality })
                .on("progress", (length, current, total) => {
                    // calculate current parcent
                    let percent = Math.round(current / total * 100);
                    // ignore duplicates
                    if (percent == currentPercent) return;
                    // record new percent
                    currentPercent = percent;
                    global["io"].emit("progress", { url, innerText: percent + " %", disabled: 1 });
                })
                .on("data", () => resolve({ result: "On Progress!" }))
                .on("error", err => {
                    console.info(err)
                    global["io"].emit("progress", { url, innerText: "Download", disabled: 0 });
                    reject(err);
                })
                .on("end", () => global["io"].emit("progress", { url, innerText: "Download", disabled: 0 }))
                .pipe(fs.createWriteStream(path));
        });
    }

    /**
     * get video info
     * @param {string} url 
     * @returns {Promise<object[]>} each object has: id, url and name
     */
    async getPlaylistInfo(url) {
        const { data = {} } = await ytpl(url).catch(err => { throw err; });
        return data;
    }

    /**
     * download playlist
     * @param {object[]} playlist each object has: id, url and name
     * @param {string} [folder] name to save all items in
     * @param {'audioandvideo' | 'video' | 'videoonly' | 'audio' | 'audioonly'} [filter='audioandvideo'] 
     * @param {'lowest' | 'highest'} [quality='highest'] 
     */
    async downloadPlaylist({
        playlist,
        folder,
        quality,
        filter
    }) {
        // download each video seperately
        for (let video of playlist) {
            let { url, name: fileName } = video;
            await this.download({ url, fileName, folder, quality, filter }).catch(err => { /* Just to catch */ });
        }
        return "Done!";
    }
}

module.exports = Youtube;