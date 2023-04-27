require('dotenv').config();
const cron = require('node-cron');
const sendMail = require('./utils/mailer');
const onGetAuthToken = require('./controllers/login');
const { 
    onCompareOrdersToHold,
    onGetlastOrders,
    onPutOrdersOnHold
} = require('./controllers/orders');


start = async () => {
    console.clear();
    console.log('Starting bot...')
    console.log(`init: ${new Date()}`)        
    try {
        const token = await onGetAuthToken();
        const channelId = [1, 4, 50];
        let OrderToEmail = [];

        for(let i = 0; i < channelId.length; i++) {
            const orders = await onGetlastOrders(token, channelId[i], 1);

            if(orders.index > 50) {
                const pages = Math.ceil(orders.index / 50);
                for(let j = 2; j <= pages; j++) {
                    const newOrders = await onGetlastOrders(token, channelId[i], j);
                    orders.Items.push(...newOrders.Items);
                }
            }

            console.log(`${orders.index} orders found. in channel ${channelId[i]}`);
            console.log(orders.Items.map((order) => order.OrderID));
            await onCompareOrdersToHold(orders.Items).then((toHold) => {
                if (toHold) {
                    toHold = JSON.parse(toHold);
                    console.log(`Found ${toHold.length} orders to hold.`);
                    OrderToEmail.push(toHold);
                    // onPutOrdersOnHold(token, toHold);
                } else {
                    console.log('No orders to hold.');
                }
            });
        }
        let flattened = OrderToEmail.flat();
        await sendMail(flattened);
        console.log(`last run: ${new Date()}`)        
        console.log('Bot finished, awaiting next scheduled run...');
    } catch (error) {
        console.error(error.message);
        process.exit(1);
    }
}

start();
console.log('Scheduled cron job to 07:30am...')
cron.schedule('30 7 * * *', () => {
    console.log('Running scheduled cron job...')
    start();
});
