const axios = require('axios');

onGetlastOrders = async (access_token, channelId, pageNumber) => {
    return new Promise((resolve, reject) => {
        axios.get(`https://cf.api.sellercloud.com/rest/api/Orders?model.companyID=164&model.shippingStatus=1&model.dateRange=10&model.channel=${channelId}&model.pageSize=50&model.pageNumber=${pageNumber}`, {
            headers: {
                'Authorization': 'Bearer ' + access_token
            }
        })
        .then((response) => {
            resolve({
                index: response.data.TotalResults,
                Items: response.data.Items.map((order) => {
                        return {
                            'orderID': order.ID,
                            'FirstName': order.FirstName,
                            'LastName': order.LastName,
                            'Email': order.Email,
                            'TimeOfOrder': order.TimeOfOrder,
                            'ShippingAddress': order.ShippingAddress
                        }
                    })
                }
            );
        })
        .catch((error) => {
            reject(error.message);
        });
    });
}

onCompareOrdersToHold = async (orders) => {
    console.log('Comparing orders to hold...')
    const toHold = [];
    orders.forEach((order, index) => {
        const found = orders.find((o, i) => {
            return o.ShippingAddress === order.ShippingAddress && i !== index;
        });
        if (found) {
            toHold.push(order.orderID);
        }
    });
    if (toHold.length > 0) {
        return toHold;
    }
    return false;
}

onPutOrdersOnHold = async (access_token, orders) => {
    console.log('Putting orders on hold...')
    console.log(orders.map((order) => {
        return order.orderID;
    }));

    let body = {
        'model': {
            'Orders': orders.map((order) => {
                return order.orderID;
            })
        },
        'Status': 200
    }

    console.log(body);


    // axios.put('https://cf.api.sellercloud.com/rest/api/Orders/hold', body, {
    //     headers: {
    //         'Authorization': 'Bearer ' + access_token
    //     }
    // })
    // .then((response) => {
    //     console.log(response.data);
    // })
    // .catch((error) => {
    //     console.error(error.message);
    // });


}

module.exports = {
    onGetlastOrders,
    onCompareOrdersToHold,
    onPutOrdersOnHold
}