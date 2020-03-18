// Save Twilio keys
const accountSid = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_TOKEN;
const client = require("twilio")(accountSid, authToken);
// Save NASA API key
const nasaAPI = process.env.NASA_API;
const fetch = require("node-fetch");

module.exports = async function(context, myTimer) {
  var timeStamp = new Date().toISOString();

  if (myTimer.isPastDue) {
    context.log("JavaScript is running late!");
  }
  context.log("JavaScript timer trigger function ran!", timeStamp);

  let url = `https://api.nasa.gov/EPIC/api/natural/images?api_key=${nasaAPI}`;

  // Set up picture for text message
  const fetchNasa = await fetch(url);
  const response = await fetchNasa.json();
  const data = {
    imageID: await response[0].image,
    date: await response[0].date
  };

  // Set up date for text message
  const year = new Date(data.date).getFullYear();
  let month = new Date(data.date).getMonth() + 1;
  // Format single digit dates to become double digits for compatibility with NASA's image URL
  if (month < 10) {
    month = `0${month}`;
  }
  let day = new Date(data.date).getDate();
  if (day < 10) {
    day = `0${day}`;
  }
  const currentImageDate = `${year}-${month}-${day}`;

  // Set up image URL for text message
  const imgURL = `https://epic.gsfc.nasa.gov/archive/natural/${year}/${month}/${day}/png/${data.imageID}.png`;

  // Text message set up
  client.messages
    .create({
      from: process.env.SENDER_NUMBER,
      body: `How do I look? Here's a photo of me from ${currentImageDate}`,
      // 'mediaURL' opens and formats the URL so the image on the receipient's device
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
