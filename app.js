require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require('https');



const {
    options
} = require("request");

const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({
    extended: true
}));



app.get("/", function (req, res) {
    res.sendFile('signup.html', {
        root: __dirname
    });
});

app.post("/", function (req, res) {
    let name = req.body.nameF;
    let email = req.body.email;

    let data = {
        members: [{
            email_address: email,
            status: "subscribed",
            merge_fields: {
                FNAME: name
            }
        }]
    };

    let jsonData = JSON.stringify(data);

    const url = "https://us14.api.mailchimp.com/3.0/lists/4ec1cb940a";

    const options = {
        method: "POST",
        auth: "jasmin:" + process.env.API_KEY
    }



    const request = https.request(url, options, function (response) {

        if(response.statusCode === 200){
            res.sendFile("success.html", {
                root: __dirname
            });
        } else {
            res.sendFile("failure.html", {
                root: __dirname
            });
        }

        response.on("data", function (data) {
            console.log(JSON.parse(data));
        })
    });

    request.write(jsonData);
    request.end();

});

app.post("/failure", function(req, res){
    res.redirect("/");
});

app.listen(process.env.PORT || 3000, function () {
    console.log("Server runs on port 3000")
});

