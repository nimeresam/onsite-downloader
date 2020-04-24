require("dotenv").config();

const express = require("express");
const app = express();

// adding middle wares
app.use(require("cors")());
app.use(require("body-parser").urlencoded({ extended: true }))
app.use(require("body-parser").json());

app.use("/api", require("./server/routes/youtube.routes"));
app.use("/api", require("./server/routes/soundcloud.routes"));

const server = require("http").createServer(app);
// run socket.io
const io = require("socket.io")(server);
global["io"] = io;

server.listen(4895);