const ffmpeg = require("fluent-ffmpeg");
const express = require('express');
const router = express.Router();
const app = express();

app.set('view engine', 'ejs');

router.get("/", (req,res)=>{
    let urls = {}
});

router.get("/v/", (req,res)=>{
    res.render("assets/view.html", {videoSrc: "test.mp4"});
});

app.use(router);
app.listen(process.env.PORT || 3030, ()=> {
    console.log("Listening on http://localhost:" + process.env.PORT || 3030);
});