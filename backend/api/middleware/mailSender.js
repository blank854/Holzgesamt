'use strict';
const nodemailer = require('nodemailer');
require('dotenv').config();

// sender smtp settings
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    tls: { rejectUnauthorized: false }
});

// create mail config for different purposes
function createMailConfig(mailData, configType) {
    let _sender = `"HolzApp-Team" <${process.env.EMAIL_USER}>`;
    let _receiver = mailData.email;
    let _subject, _html;
    switch (configType) {
        case 'verification':
            let confirmationUrl = `http://${process.env.REST_API_HOST}:${process.env.REST_API_PORT}/user/verify?id=${mailData.uId}`;
            _subject = 'Deine Registrierung bei der HolzApp';
            _html = `<h3>Hallo ${mailData.forename},</h3><p>schön, dass du dich bei der HolzApp registriert hast.<br/>
                    Um deinen Account zu aktivieren, klicke bitte <a href=${confirmationUrl}>hier</a>.</p>
                    <p>Viele Grüße,<br>dein HolzApp-Team</p>`;
            break;
        case 'offerRequest':
            let offerUrl = `http://${process.env.WEBSERVER_HOST}:${process.env.WEBSERVER_PORT}/${mailData.offerId}?requester=${mailData.requesterId}`;
            _subject = 'Neue Anfrage für dein Inserat';
            _html = `<h3>Hallo ${mailData.forename},</h3>
                     <p>du hast eine neue Anfrage für dein Inserat <b>"${mailData.offerName}"</b> erhalten.<br/><br/>
                     <table><tr><td style="background-color: #c9cdf2; border: solid 10px #c9cdf2; width: 450px;">
                     <b>${mailData.requesterUsername} schrieb:</b><p>${mailData.firstMessage}</p></td></tr></table>
                     <p>Klicke <a href=${offerUrl}>hier</a>, um zum Inserat zu gelangen.</p>
                     <p>Viele Grüße,<br>dein HolzApp-Team</p>`;
            break;
        default:
            throw new Error('Invalid mail configuration');
    }

    return {
        from: _sender,
        to: _receiver,
        subject: _subject,
        html: _html
    };
}

// send mail with required config
exports.sendMail = async function sendMail(mailData, configType) {
    let mailConfig = createMailConfig(mailData, configType);

    transporter.sendMail(mailConfig, (err, info) => {
        if (err) {
            console.log(err.message);
        } else {
            console.log(`E-Mail versendet an: ${mailData.email}`);
            transporter.close();
        }
    });
}