// const accountSid = process.env.TWILIO_SID;
// const authToken = process.env.TWILIO_TOKEN;
// const client = require("twilio")(accountSid, authToken);
// const nasaAPI = process.env.NASA_API;
// const fetch = require("node-fetch");

// module.exports = async function(context, myTimer) {
//   var timeStamp = new Date().toISOString();

//   if (myTimer.isPastDue) {
//     context.log("JavaScript is running late!");
//   }
//   context.log("JavaScript timer trigger function ran!", timeStamp);

//   //   NASA Request
//   let url = "https://api.nasa.gov/planetary/apod?api_key=" + nasaAPI;

//   // Set up title and picture for text message
//   const fetchNasa = await fetch(url);
//   const response = await fetchNasa.json();
//   const data = {
//     picture: await response.url,
//     title: await response.title
//   };

//   // Text message set up
//   client.messages
//     .create({
//       from: process.env.SENDER_NUMBER,
//       body: `Daily earth update: ${data.title}`,
//       mediaUrl: [`${data.picture}`],
//       to: process.env.RECIPIENT_NUMBER
//     })
//     .then(message => {
//       context.log("Message sent");
//       context.res = {
//         // status: 200, /* Defaults to 200 */
//         body: "Text successfully sent"
//       };
//       context.log("JavaScript timer trigger function ran!", timeStamp);
//       context.done();
//     })
//     .catch(err => {
//       context.log.error("Twilio Error: " + err.message + " -- " + err.code);
//       context.res = {
//         status: 500,
//         body: `Twilio Error Message: ${err.message}\nTwilio Error code: ${err.code}`
//       };
//       context.done();
//     });
// };

const accountSid = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_TOKEN;
const client = require("twilio")(accountSid, authToken);
const nasaAPI = process.env.NASA_API;
const fetch = require("node-fetch");

module.exports = async function(context, myTimer) {
  var timeStamp = new Date().toISOString();

  if (myTimer.isPastDue) {
    context.log("JavaScript is running late!");
  }
  context.log("JavaScript timer trigger function ran!", timeStamp);

  //   NASA Request
  let url = "https://api.nasa.gov/EPIC/api/natural/images?api_key=" + nasaAPI;

  // Set up title and picture for text message
  const fetchNasa = await fetch(url);
  const response = await fetchNasa.json();
  const data = {
    imageID: await response[0].image,
    caption: await response[0].caption,
    date: await response[0].date
  };

  const year = new Date(data.date).getFullYear();
  let month = new Date(data.date).getMonth() + 1;
  if (month < 10) {
    month = "0" + month;
  }
  const day = new Date(data.date).getDate();
  const imgURL = `https://epic.gsfc.nasa.gov/archive/natural/${year}/${month}/${day}/png/${data.imageID}.png`;

  // Text message set up
  client.messages
    .create({
      from: process.env.SENDER_NUMBER,
      body: `Daily earth update: ${data.caption}`,
      mediaUrl: [`${imgURL}`],
      to: process.env.RECIPIENT_NUMBER
    })
    .then(message => {
      context.log("Message sent");
      context.res = {
        // status: 200, /* Defaults to 200 */
        body: "Text successfully sent"
      };
      context.log("JavaScript timer trigger function ran!", timeStamp);
      context.done();
    })
    .catch(err => {
      context.log.error("Twilio Error: " + err.message + " -- " + err.code);
      context.res = {
        status: 500,
        body: `Twilio Error Message: ${err.message}\nTwilio Error code: ${err.code}`
      };
      context.done();
    });
};
