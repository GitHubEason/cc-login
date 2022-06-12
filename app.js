const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const { engine } = require("express-handlebars");
const passport = require("passport");
const session = require("express-session");
const MongoDbStore = require("connect-mongo");
const connectDB = require("./config/db");
const { mongoose } = require("mongoose");

//Load dotenv
dotenv.config({ path: "./config/config.env" });
//Passport config
require("./config/passport")(passport);
connectDB();
const app = express();
if (process.env.NODE_ENV === "development") {
	app.use(morgan("dev"));
}

//Handlebars
app.engine(".hbs", engine({ extname: ".hbs", defaultLayout: "main" }));
app.set("view engine", ".hbs");
app.set("views", "./views");

//Sessions
app.use(
	session({
		secret: "keyboard cat",
		// cookie: { maxAge: 20000 },
		resave: false,
		saveUninitialized: false,
		store: MongoDbStore.create({
			mongoUrl: process.env.MONGO_URI,
		}),
	})
);

//Passport middleware
app.use(passport.initialize());
app.use(passport.session());

//Static folder
app.use(express.static(path.join(__dirname, "public")));

//Routes
app.use("/", require("./routes/index"));
app.use("/auth", require("./routes/auth"));
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
