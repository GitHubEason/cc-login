const express = require("express");
const passport = require("passport");
const router = express.Router();

//@desc Auth with google
//@route GET /auth/google
router.get(
	"/google",
	passport.authenticate("google", { scope: ["profile", "email"], accessType: "offline", prompt: "consent" })
);
//@desc Google auth callback
//@route GET /auth/google/callback
router.get("/google/callback", passport.authenticate("google", { failureRedirect: "" }), function (req, res) {
	// Successful authentication, redirect home.
	res.redirect("/cc");
});

//@desc logout user
//@route /auth/logout
router.get("/logout", (req, res) => {
	req.logout(() => {
		res.redirect("/");
	});
});

module.exports = router;
