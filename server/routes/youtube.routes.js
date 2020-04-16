const app = require("express")();

const Youtube = require("../downloaders/youtube");

app.get("/youtube", (req, res) => {
    new Youtube().getInfo(req.query.url)
        .then(info => res.send(info))
        .catch(err => res.status(500).send(err));
});

app.put("/youtube", (req, res) => {
    new Youtube().download(req.body)
        .then(result => res.send(result))
        .catch(err => res.status(500).send(err))
});

app.get("/youtube/playlist", (req, res) => {
    new Youtube().getPlaylistInfo(req.query.url)
        .then(result => res.send(result))
        .catch(err => res.status(500).send(err))
});

app.put("/youtube/playlist", (req, res) => {
    new Youtube().downloadPlaylist(req.body)
        .then(result => res.send(result))
        .catch(err => res.status(500).send(err));
});

module.exports = app;