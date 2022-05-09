const sgMail = require('@sendgrid/mail');
const nodemailer = require('nodemailer');
const config = require('../config/config');
const logger = require('../config/logger');
sgMail.setApiKey(config.email.sendGridApiKeyByTechify);

/**
 * Send an email
 * @param {string} to
 * @param {string} subject
 * @param {string} text
 * @returns {Promise}
 */
const sendEmail = async (msg) => {
  try{
    await sgMail.send(msg);
  }catch(error){
    console.error('Error sending test email');
    console.error(error);
    if (error.response) {
      console.error(error.response.body)
    }
  }
};

/**
 * Send reset password email
 * @param {string} to
 * @param {string} token
 * @returns {Promise}
 */
 const sendResetPasswordEmail = async (to, code) => {
  const msg = {
    to,
    from: 'ahmadiqbalpu@gmail.com',
    subject: 'Password reset email',
    text: `Your Password reset code is ${code} `
  };
  await sendEmail(msg);
};

/**
 * Send reset password email
 * @param {string} to
 * @param {string} token
 * @returns {Promise}
 */
 const sendActiveOrganizationEmail = async (to, email) => {
  const msg = {
    to,
    from: 'usablackhole@gmail.com',
    subject: 'ACCOUNT ACTIVATION',
    text: 'Create Your Password',
    html: `<h2>Congratulations! </h2> <br> <p>We are very happy to see your company on board! As your status is Active now <br> 
            please click following link to update or change your password for future use,please copy following Email:<br> ${email} </p>`,
  }; 
  console.log('---------its me-email');
  await sendEmail(msg);
};

/**
 * Send verification email
 * @param {string} to
 * @param {string} token
 * @returns {Promise}
 */
const sendVerificationEmail = async (to, token) => {
  const code = Math.floor(1000+Math.random()*90000);
  const verificationEmailUrl = `http://link-to-app/verify-email?token=${token}`;
  const msg = {
    to,
    from:config.email.from,
    subject : 'Email Verification',
    text: `Dear user,
    To verify your email, click on this link: ${token}
    Or You can manually pass code for Email Verification: "${code}"
    If you did not create an account, then ignore this email.`

  }
  await sendEmail(msg);
};
// ---------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------
// send mail with nodemailer-sendgrid-transport


// const sendgridTransport = require('nodemailer-sendgrid-transport');

// const transport = nodemailer.createTransport(sendgridTransport({
//     auth: {
//         api_key: config.email.sendGridApiKey
//     }
// }))
// const sendEmailNodemailer = async function(to,code){
//  const msg ={ 
//    to,
//   from:'usablackhole@gmail.com',
//   subject: 'ACCOUNT ACTIVATION',
//   html: `Your Password reset code is ${code} `,
//  }
//  await transport.sendMail(msg);
// }

// function sendmailwithsendgridandnodemailer(){transport.sendMail({
//     to: 'theimmigrantprogrammers@gmail.com',
//     from: 'yourverifiedsendgridemail@gmail.com',
//     subject: 'ACCOUNT ACTIVATION',
//     html: '<h2>Please Like Share Comment And Subscribe</h2>'
// })
// .then(console.log('Success!'))
// .catch(err => console.log(err))}

//-----------------------------------------------------------------------------
//  SEND EMAIL WITH NODEMAILER
// const nodemailer = require('nodemailer');  
  
const mailsendwithnodemailer =async function(){let mailTransporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'ahmadiqbalpu@gmail.com',
        pass: 'vknarhdlppytaeiu'
    }
});
  
let mailDetails = {
    from: 'ahmadiqbalpu@gmail.com',
    to: 'saadmb1995@gmail.com',
    subject: 'Test mail',
    text: 'Node.js testing mail for alchoooooz'
};
  
 mailTransporter.sendMail(mailDetails, function(err, data) {
    if(err) {
        console.log('Error Occurs',err);
    } else {
        console.log('Email sent successfully');
    }
});
}

module.exports = {
  sendEmail,
  sendResetPasswordEmail,
  sendVerificationEmail,
  sendActiveOrganizationEmail,
  // sendEmailNodemailer
  mailsendwithnodemailer
};
