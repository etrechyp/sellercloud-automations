const nodemailer = require('nodemailer');

async function sendMail(OrderIds) {

    const transporter = nodemailer.createTransport({
        host: process.env.MAILER_HOST,  
        secure: true,
        secureConnection: false,
        tls: {
            ciphers:'SSLv3'
        },
        requireTLS:true,
        port: 465,
        debug: true,
        auth: {
            user: process.env.MAILER_USERNAME,
            pass: process.env.MAILER_PASSWORD
        }
    });

    if(OrderIds.length === 0) {
        let info = await transporter.sendMail({
        from: `"SD-BOT 🤖"<${process.env.MAILER_USERNAME}>`,
        to: process.env.MAIL_TO,
        subject: "OrderIds repetidas en SC",
        html: `
            <p>No se han encontrado OrderIds con direcciones de envío similares.</p>
            <p>Saludos</p>
        `
        });
        console.log("Message sent: %s", info.messageId);
    } else {
        let info = await transporter.sendMail({
            from: `"SD-BOT 🤖"<${process.env.MAILER_USERNAME}>`,
            to: process.env.MAIL_TO,
        subject: "OrderIds repetidas en SC",
        html: `
        <p>Se han encontrado ${OrderIds.length} OrderIds con direcciones de envío similares, favor revisar:</p>
        <table style="border-collapse: collapse;">
            <thead>
            <tr>
                <th style="border: 1px solid black; padding: 7px;">Order#</th>
                <th style="border: 1px solid black; padding: 7px;">First Name</th>
                <th style="border: 1px solid black; padding: 7px;">Last Name</th>
                <th style="border: 1px solid black; padding: 7px;">Shipping FullName</th>
                <th style="border: 1px solid black; padding: 7px;">City</th>
                <th style="border: 1px solid black; padding: 7px;">State</th>
                <th style="border: 1px solid black; padding: 7px;">Zip Code</th>
                <th style="border: 1px solid black; padding: 7px;">Items</th>
            </tr>
            </thead>
            <tbody>
            ${OrderIds.map(order => `
                <tr>
                <td style="border: 1px solid black; padding: 7px;"><a href="https://cf.cwa.sellercloud.com/Orders/Orders_details.aspx?id=${order.OrderId}">${order.OrderId}</a></td>
                <td style="border: 1px solid black; padding: 7px;">${order.firstName}</td>
                <td style="border: 1px solid black; padding: 7px;">${order.lastName}</td>
                <td style="border: 1px solid black; padding: 7px;">${order.ShippingAddress.FirstName} ${order.ShippingAddress.LastName}</td>
                <td style="border: 1px solid black; padding: 7px;">${order.ShippingAddress.City}</td>
                <td style="border: 1px solid black; padding: 7px;">${order.ShippingAddress.StateName}</td>
                <td style="border: 1px solid black; padding: 7px;">${order.ShippingAddress.PostalCode}</td>
                <td style="border: 1px solid black; padding: 7px;">${Object.keys(order.Items).map(item => `<a href="https://cf.cwa.sellercloud.com/Inventory/Product_Dashboard.aspx?Id=${item}">${item}</a>(${order.Items[item]})`).join(', ')}</td>
                </tr>
            `).join('')}
            </tbody>
        </table>
        <p>En caso de encontrar algún error, favor de contactar a developers@sotodeals.com</p>
        <p>Saludos</p>
        
        `
        });
        console.log("Message sent: %s", info.messageId);
    }
}

module.exports = sendMail;
