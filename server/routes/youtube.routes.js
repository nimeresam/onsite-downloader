const app = require("express")();

const Youtube = require("../downloaders/youtube");

app.get("/youtube", (req, res) => {
    new Youtube().getInfo(req.query.url)
        .then(info => res.send(info))
        .catch(err => res.status(500).send(err));
});

app.post("/youtube", (req, res) => {
    new Youtube().download(req.body)
        .then(result => res.send(result))
        .catch(err => res.status(500).send(err))
});

module.exports = app;