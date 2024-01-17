import express from "express";
import { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));
import bodyParser from "body-parser";
import qr from "qr-image";
import fs from "fs";


const app = express();
const port = 3000;
var bandName="";

app.set("view engine", "ejs"); 
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

function bandNameGenerator(req,res,next){
  bandName = req.body["URL"];
  next();
}

app.use(bandNameGenerator);

app.get("/", (req, res) => {
  res.render("index", { bandName: bandName });
});


app.post("/submit",(req,res)=>{
  const url = bandName;
  const imageName = 'qr_img.png';
  const imagePath = `/images/${imageName}`;
  var qr_svg = qr.image(url);
  qr_svg.pipe(fs.createWriteStream(`public${imagePath}`));
  res.redirect(`/success?image=${imageName}`);
});
app.get("/success", (req, res) => {
  const imageUrl = `/images/${req.query.image || 'qr_img.png'}`;
  res.render("success", { imageUrl });
});
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
