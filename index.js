require('dotenv').config();
const cron = require('node-cron');
const onGetAuthToken = require('./controllers/login');
const { 
    onCompareOrdersToHold,
    onGetlastOrders,
    onPutOrdersOnHold
} = require('./controllers/orders');


start = async () => {
    console.clear();
    console.log('Starting bot...')
    try {
        const token = await onGetAuthToken();

        const channelId = [1, 4, 50];
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

            await onCompareOrdersToHold(orders.Items).then((toHold) => {
                if (toHold) {
                    console.log(`Found ${toHold.length} orders to hold.`);
                    console.log(toHold);
                    onPutOrdersOnHold(token, toHold);
                } else {
                    console.log('No orders to hold.');
                }
            });
        }        
        console.log('Bot finished, awaiting next scheduled run...');
    } catch (error) {
        console.error(error.message);
        process.exit(1);
    }
}

start();

cron.schedule('0 9 * * *', () => {
    console.log('Running scheduled cron job...')
    start();
});
