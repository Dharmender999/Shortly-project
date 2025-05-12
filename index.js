const express = require("express");
require('dotenv').config();
const session = require('express-session');
const path = require("path");
const bcrypt = require("bcrypt");


const connectDB = require("./connection");
const shortid = require("shortid");
const { usermodel } = require("./modals/usermodal");
const { urlmodel } = require("./modals/urlmodel");
connectDB(process.env.MONGO_URI);
const app = express();
app.use(session({
    secret: process.env.SESSION_SECRET, 
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 15 * 60000 } 
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.set('view engine', 'ejs');
app.use(express.static('public'));


function isAuthenticated(req, res, next) {
    if (req.session.userId) {
        return next();
    }
    res.redirect('/');
}


app.get('/home', isAuthenticated, async (req, res) => {
    const allUrls = await urlmodel.find({ userId: req.session.userId });
    res.render("home", { shortUrl: null, allUrls });
});

app.get('/', (req, res) => {
    res.render('login');
});

app.get('/signup', (req, res) => {
    res.render("signup", { send: null });
})


app.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;
  if (!password) {
    return res.send("Password is required");
  }

  try {
    const existingUser = await usermodel.findOne({
      $or: [{ name: username }, { email: email }]
    });

    if (existingUser) {
      return res.send("Username or email already exists.");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    
    await usermodel.create({
      name: username,
      email: email,
      password: hashedPassword
    });
    res.redirect("/");

  } catch (err) {
    res.render("signup", { send: "Signup failed: " + err.message });
  }
});



app.post('/login', async (req, res) => {
    try {
        const user = await usermodel.findOne({ name: req.body.username });
        if (!user) {
            return res.send("User name not found");
        }
        const isPasswordMatch = await bcrypt.compare(req.body.password, user.password);
        if (isPasswordMatch) {
            req.session.userId = user._id; 
            const allUrls = await urlmodel.find({ userId: user._id });
            res.render("home", { shortUrl: null, allUrls });
        } else {
            res.send('Wrong password');
        }
    } catch (error) {
        res.send("Wrong Details");
    }
});


app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.send("Error logging out");
        }
        res.redirect('/');
    });
});

app.post("/shorten", isAuthenticated, async (req, res) => {
  try {
    const originalUrl = req.body.originalUrl;

    if (!/^https?:\/\//.test(originalUrl)) {
      return res.status(400).send("Invalid URL format. Please include http:// or https://.");
    }

    const uniqueId = shortid.generate();
    const shortUrl = `http://localhost:3000/${uniqueId}`;

    await urlmodel.create({
      shortid: uniqueId,
      originalUrl,
      userId: req.session.userId
    });
    const allUrls = await urlmodel.find({ userId: req.session.userId });
    res.render("home", { shortUrl, allUrls });

  } catch (err) {
    
    console.error("Error shortening URL:", err.message);
    res.status(500).send("Something went wrong while shortening the URL.");
  }
});

app.get("/:shortCode", async (req, res) => {
    const uniqueId = req.params.shortCode

    const urlRecord = await urlmodel.findOne({ shortid: uniqueId });

    if (urlRecord) {
        res.redirect(urlRecord.originalUrl)
    } else {
        res.status(404).send("URL not found")
    }
});

app.listen(3000, () => {
    console.log('server is running');
})