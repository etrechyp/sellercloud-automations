const nodemailer = require('nodemailer');

async function sendMail(OrderIds) {
    let transporter = nodemailer.createTransport({
        host: 'smtp.office365.com',
        port: 587,
        secure: false,
        auth: {
            user: 'sotodeals-automations@outlook.com',
            pass: '!Bp^sfN7g$dCV7kU'
        },
    });

    let info = await transporter.sendMail({
        from: '"Report-BOT 🤖"<sotodeals-automations@outlook.com>',
        to: "warehouse@sodeals.com; marcos@sotodeals.com; developers@sotodeals.com",
        subject: "List on repeated orders",
        html: `<h3>List on repeated orders</h3>
        <ul>${OrderIds.map((order) => `<li style="margin:5px;">${order}</li>`).join('')}</ul>`
    });


    //TODO: debug template
    // let transporter = nodemailer.createTransport({
    //     host: 'smtp.ethereal.email',
    //     port: 587,
    //     secure: false,
    //     auth: {
    //         user: 'kaitlin.ward@ethereal.email',
    //         pass: 'KZceFhA6QXBRdKdB4k'
    //     },
    // });

    // let info = await transporter.sendMail({
    //     from: '"Report-BOT 🤖"<kaitlin.ward@ethereal.email>"',
    //     to: "e.trechy.p@gmail.com   ",
    //     subject: "Orders on hold SC",
    //     html: `<h3>list of OrderID on hold</h3>
    //     <ul>${OrderIds.map((order) => `<li style="margin:5px;">${order}</li>`).join('')}</ul>`
    // });

    console.log("Message sent: %s", info.messageId);
}

module.exports = sendMail;



