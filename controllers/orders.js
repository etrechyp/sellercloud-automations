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
                response: response.data,
                index: response.data.TotalResults,
                Items: response.data.Items.map((order) => {
                        return {
                            'CustomerID': order.CustomerID,
                            'OrderID': order.ID,
                            'FirstName': order.FirstName,
                            'LastName': order.LastName,
                            'TimeOfOrder': order.TimeOfOrder,
                            'ShippingAddress': order.ShippingAddress,
                            'Items': order.Items.map((item) => {
                                return {
                                    'ItemID': item.ProductID,
                                    'Qty': item.Qty
                                }
                            }),
                            'Status': order.StatusCode,
                            'Channel': channelId
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
            return  o.ShippingAddress.StreetLine1 === order.ShippingAddress.StreetLine1 &&
                    o.ShippingAddress.StreetLine2 === order.ShippingAddress.StreetLine2 &&
                    o.ShippingAddress.City === order.ShippingAddress.City &&
                    o.ShippingAddress.StateName === order.ShippingAddress.StateName &&
                    o.ShippingAddress.PostalCode === order.ShippingAddress.PostalCode &&
                    i !== index &&
                    o.Status !== 200;
        });
        if (found) {
            let items = {};
            for(let i = 0; i < order.Items.length; i++) {
                if(items[order.Items[i].ItemID]) {
                    items[order.Items[i].ItemID] += order.Items[i].Qty;
                } else {
                    items[order.Items[i].ItemID] = order.Items[i].Qty;
                }
            }
            toHold.push({
                CustomerId: order.CustomerID,
                firstName: order.FirstName,
                lastName: order.LastName,
                OrderId: order.OrderID,
                ShippingAddress: order.ShippingAddress,
                Items: items,
                Status: order.Status,
                Channel: order.Channel
            });
        }
    });

    if (toHold.length > 0) {
        return JSON.stringify(toHold);
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
