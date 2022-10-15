require('dotenv').config();

const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("node:https");

const app = express();

app.use(express.static("public"));

app.use(bodyParser.urlencoded({extended: true}));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/signup.html");
})

// Post request for the home route
app.post("/", (req, res) => {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.emailAddress;

  // Create data object (Javascript)
  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName
        }
      }
    ]
  };

  // Turn the data object into a flatpack JSON (JSON-formatted string)
  const jsonData = JSON.stringify(data);

  const url = "https://us11.api.mailchimp.com/3.0/lists/" + process.env.LIST_ID;

  const options = {
    method: "POST",
    auth: "ryan:" + process.env.API_KEY
  }

  const request = https.request(url, options, (response) => {
    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }

    response.on("data", (data) => {
      // console.log(JSON.parse(data));
    })
  })

  request.write(jsonData);
  request.end();

})

// Post request for the 'failure' route
app.post("/failure", (req, res) => {
  res.redirect("/");
})


app.listen(process.env.PORT || 3000, () => {
  console.log("Newsletter App Server is running on port 3000");
})
