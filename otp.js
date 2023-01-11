// const client = require('twilio')(process.env.SID, process.env.TOKEN);
// let sid;

// function sendotp(mobile) {

//   client.verify.v2
//       .services(process.env.SSID)
//       .verifications.create({ to: `+91${mobile}`, channel: "sms" })
//       .then((verification) => console.log(verification.status));
//       console.log(verification.status);
// }

// function verifyotp(mobile, otp) {
//   return new Promise((resolve, reject) => {
//       client.verify.v2
//           .services(process.env.SSID)
//           .verificationChecks.create({ to: `+91 ${mobile}`, code: otp })
//           .then((verification_check) => {
//               console.log(verification_check.status);-
//               resolve(verification_check);
//           });
//   });
// }

// module.exports = {
//   sendotp,
//   verifyotp,
// };


// 930 Bytes
const twilio_sid = process.env.SID;
const twilio_token = process.env.TOKEN
const client = require("twilio")(
  twilio_sid,
  twilio_token
);

let sid;

module.exports = {

  // sending OTP to user
sendOtp : (mobile) => {
  // next();
  // req.session.userMobile = req.body.mob;
  // let mobile = req.session.userMobile;
  client.verify.v2
    .services(twilio_sid)
    .verifications.create({ to: `+91${mobile}`, channel: 'sms' })
    .then((verification) => {
      console.log(verification.status);
      next();
    });
},

// verifiying users OTP
verifyOtp : async (mobile,otp) => {
  // req.flash('success', 'successfully signed in');
  // next();
  try {
    // const verificationCode = req.body.otp;
    // let mobile = req.session.userMobile;
    client.verify.v2
      .services(twilio_sid)
      .verificationChecks.create({ to: `+91${mobile}`, code: otp })
      .then(async (verification_check) => {
        console.log(verification_check.status);
        if (verification_check.status === 'approved') {
          req.flash('success', 'successfully signed in');
          await User.findOne({ mob: mobile }, function (err, user) {
            if (err) throw err;
            // req.session.user = user;
          });
          // req.session.userLogin = true;
          next();
        } else {
          // req.flash('error', 'wrong otp given try again!!');
          // res.redirect('/signup');
        }
      });
  } catch (err) {
    console.log(err);
    res.render('user/error-page', { error: err, errorMsg: 'error while verifying otp!!', navCat });
  }
}
};