require("dotenv").config();

const express = require("express");
const app = express();

// adding middle wares
app.use(require("cors")());
app.use(require("body-parser").urlencoded({ extended: true }))
app.use(require("body-parser").json());

app.use("/api", require("./routes/youtube.routes"));
app.use("/api", require("./routes/soundcloud.routes"));

const server = require("http").createServer(app);
server.listen(4895);