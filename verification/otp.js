const sid = process.env.TWILIO_ACCOUNT_SID;
const token = process.env.TWILIO_AUTH_TOKEN;
const ssid = process.env.SSID;

const client = require("twilio")(sid, token);

const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });

function sendsms(phone) {
  client.verify.v2
    .services(ssid)
    .verifications.create({ to: `+91${phone}`, channel: "sms" })
    .then((verification) => console.log(verification.status));
}

function verifysms(phone, otp) {

  return new Promise((resolve, reject) => {
    client.verify.v2
      .services(ssid)
      .verificationChecks.create({ to: `+91${phone}`, code: otp })
      .then((verification_check) => {
        console.log(verification_check.status);
        resolve(verification_check);
      });
  });
}

module.exports = { sendsms, verifysms };
