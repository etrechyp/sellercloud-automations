const axios = require('axios');
const path = require('path');

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
                            'ShippingAddress': order.ShippingAddress,
                            'Status': order.StatusCode,
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
    let toHold = [];
    orders.forEach((order, index) => {
        let found = orders.find((o, i) => {
            return o.ShippingAddress.StreetLine1 === order.ShippingAddress.StreetLine1 && o.ShippingAddress.StreetLine2 === order.ShippingAddress.StreetLine2 && o.ShippingAddress.City === order.ShippingAddress.City && o.ShippingAddress.StateName === order.ShippingAddress.StateName && o.ShippingAddress.PostalCode === order.ShippingAddress.PostalCode && i !== index && o.Status !== 200;
        });
        if (found) {
            if (found.TimeOfOrder > order.TimeOfOrder) {
                toHold.unshift(found.orderID);
            } else {
            }
        }
    });
    if (toHold.length > 0) {
        return toHold;
    }
    return false;
}

onPutOrdersOnHold = async (access_token, ordersToHold) => {
    console.log('Putting orders on hold...')
    console.log(ordersToHold);
    let body = {
        'Orders': ordersToHold,
        'Status': 200
    }

    axios.put('https://cf.api.sellercloud.com/rest/api/Orders/StatusCode', body, {
        headers: {
            'Authorization': 'Bearer ' + access_token
        }
    })
    .then((response) => {
        console.log(`Orders put on hold: ${response.data}`);
    })
    .catch((error) => {
        console.error(error.message);
    });

}

module.exports = {
    onGetlastOrders,
    onCompareOrdersToHold,
    onPutOrdersOnHold
}