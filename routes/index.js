const router = require("express").Router({ mergeParams: true });
const passport = require("passport");
const Student = require("../models/student");
const Course = require("../models/course");
const Announcement = require("../models/announcement");
const isLoggedIn = require("../middleware/auth-middleware").isLoggedIn;

router.get("/", (req, res) => {
    res.render("home");
});

router.get("/home", (req, res) => {
    res.redirect("/");
});

// Auth Routes
router.get("/login", (req, res) => {
    res.render("login");
});

router.get("/register", (req, res) => {
    res.render("register");
});

router.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/home");
});

router.get("/dashboard", isLoggedIn, (req, res) => {
    Announcement.find({}, (err, announcements) => {
        if (err) {
            console.log(err);
        } else {
            res.render("dashboard", { announcements: announcements });
        }
    });
});

router.post("/login", 
    passport.authenticate("local", { successRedirect: "/dashboard", failureRedirect: "/login" }), 
    (req, res) => {}
);

router.post("/register", (req, res) => {
    let newStudent = new Student({ 
        first: req.body.first,
        last: req.body.last,
        email: req.body.email,
        username: req.body.username,
        studentId: req.body.studentId,
    });

    switch (req.body.major.toLowerCase()) {
        case "cs":
            newStudent.major = "Computer Science";
        break;
        case "cse":
            newStudent.major = "Computer Science & Engineer";
        break;
        case "ce":
            newStudent.major = "Computer Engineering";
        break;
        case "ele":
            newStudent.major = "Electrical Engineering";
        break;
        case "se":
            newStudent.major = "Software Engineering";
        break;
        case "cgs":
            newStudent.major = "Computer Game Science";
        case "inf":
            newStudent.major = "Informatics";
        break;
        case "oth":
            newStudent.major = "Other";
        break;
        default:
            newStudent.major = undefined; // Set to undefined for db default.
        break;
    }

    Student.register(newStudent, req.body.password, (err, user) => {
        if (err) {
            console.log(err);
            return res.render("register");
        }

        passport.authenticate("local")(req, res, () => {
            res.redirect("/dashboard");
        });
    });
});

module.exports = router;