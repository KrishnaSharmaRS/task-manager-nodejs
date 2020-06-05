const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = async (name, email) => {
    const msg = {
        to: email,
        from: "KrishnaSharmaRS@hotmail.com",
        subject: `Welcome to the App, ${name}`,
        html: `<h2>Hi ${name}, We hope you Enjoy our App!</h2>`
    }

    sgMail.send(msg)
}

const sendDeleteEmail = async (name, email) => {
    const msg = {
        to: email,
        from: "KrishnaSharmaRS@hotmail.com",
        subject: `We are sorry to see you Go...`,
        html: `<h2>GoodBye, ${name}, We hope to see you soon!</h2>`
    }

    sgMail.send(msg)
}

module.exports = {
    sendWelcomeEmail,
    sendDeleteEmail
};