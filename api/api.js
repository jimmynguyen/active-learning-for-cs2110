var express = require("express"),
	app = express(),
	cors = require("cors"),
	body_parser = require("body-parser"),
	config = require("./util/config");

app.use(cors());
// parse application/x-www-form-urlencoded
app.use(body_parser.urlencoded({
	extended: true
}));
// parse application/json
app.use(body_parser.json());

// Routes
app.use("/api", require("./routes/token"));
app.use("/api/user", require("./routes/user"));
app.use("/api/question", require("./routes/question"));
app.use("/api/module", require("./routes/module"));
app.use("/api/answer", require("./routes/answer"));
app.use("/api/response", require("./routes/response"));
app.use("/api/review", require("./routes/review"));
app.use("/api/session", require("./routes/session"));
app.use("/api/stats", require("./routes/stats"));
app.use("/account", require("./routes/account"));

// Port
app.listen(config.PORT, function() {
	console.log("Listening on port " + config.PORT);
});