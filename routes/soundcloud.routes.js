const app = require("express")();

const Soundcloud = require("../downloaders/soundcloud");

app.get("/soundcloud", (req, res) => {
    new Soundcloud().getInfo(req.query.url)
        .then(info => res.send(info))
        .catch(err => res.status(500).send(err));
});

app.put("/soundcloud", (req, res) => {
    new Soundcloud().downlaod(req.body)
        .then(info => res.send(info))
        .catch(err => res.status(500).send(err));
});

app.get("/soundcloud/playlist", (req, res) => {
    new Soundcloud().getPlaylistInfo(req.query.url)
        .then(info => res.send(info))
        .catch(err => res.status(500).send(err));
});

app.put("/soundcloud/playlist", (req, res) => {
    new Soundcloud().downlaodPlaylist(req.body)
        .then(info => res.send(info))
        .catch(err => res.status(500).send(err));
});

module.exports = app;