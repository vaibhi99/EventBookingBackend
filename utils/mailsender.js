const { Resend } = require("resend");

require("dotenv").config();

const resend = new Resend(process.env.RESEND_API_KEY);

exports.sendmail = async (email, title, body) => {
    try {
        const result = await resend.emails.send({
            from: "Event Booking <onboarding@resend.dev>",
            to: email,
            subject: title,
            text: body
        });

        console.log("Mail sent successfully !", result);

    } catch (err) {
        console.log("Some error occured while sending mail " + err);
        throw err;
    }
}
