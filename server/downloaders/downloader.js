const fs = require("fs");

class Downloader {

    constructor(extension) {
        this.extension = extension;
    }

    /**
     * @private
     * Get full path for the file
     * @param {string} fileName 
     * @param {string} [extension]
     * @returns {string} path from downloads folder 
     */
    _getPath(fileName, extension) {
        // remove special character
        fileName = fileName.replace(/[\/\|\?\!\*\'\:\<\>\'\"\\]/g, "").trim();
        // check folder is exist
        let path = process.env.DOWNLOADS;
        // add custom folder name for the application
        if (process.env.folder) {
            path += "\\" + process.env.folder;
            let exist = fs.existsSync(path);
            if (!exist) fs.mkdirSync(path);
        }
        // add fileName to the path
        return path + "\\" + fileName + ( extension || this.extension );
    }

    /**
     * @abstract
     * @async
     */
    getInfo() { }

    /**
     * @abstract
     * @async
     */
    download() { }

    /**
     * @abstract
     * @async
     */
    getPlaylistInfo() { }

    /**
     * @abstract
     * @async
     */
    downlaodPlaylist() { }
}

module.exports = Downloader;