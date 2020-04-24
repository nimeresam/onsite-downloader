const fs = require("fs");

const ytdl = require("ytdl-core");

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
     * @param {'audioandvideo' | 'video' | 'videoonly' | 'audio' | 'audioonly'} [filter] 
     * @param {'lowest' | 'highest'} [quality='highest'] 
     * @returns {Promise} download result
     */
    download({
        url,
        title,
        filter = "",
        quality = "highest"
    }) {
        // TODO: check filter and quality spilling
        return new Promise((resolve, reject) => {
            // check extension
            var extension = ".mp4";
            // handle audio filter and quality
            if (filter.indexOf("video") == -1) {
                quality += "audio";
                extension = ".mp3";
            }
            else quality += "video";
            // used to avoid duplicates
            var currentPercent = 0, resolved = false;
            // add file to downloads folder
            const path = this._getPath(title, extension);
            ytdl(url, { filter, quality })
                .on("progress", (length, current, total) => {
                    // calculate current parcent
                    let percent = Math.round(current / total * 100);
                    // ignore duplicates
                    if (percent == currentPercent) return;
                    // record new percent
                    currentPercent = percent;
                    global["io"].emit(url, { percent });
                    console.log(percent)
                })
                .on("data", () => {
                    // skip if already resolved before
                    if(resolved) return;
                    resolved = true;
                    resolve({ result: "On Progress!" });
                })
                .on("error", reject)
                .on("end", () => global["io"].emit(url, { status: "finish" }))
                .pipe(fs.createWriteStream(path));
        });
    }
}

module.exports = Youtube;