const axios = require('axios');

onGetAuthToken = () => {
    return new Promise((resolve, reject) => {
        axios.post('https://cf.api.sellercloud.com/rest/api/token', {
            'Username': process.env.SC_USERNAME,
            'Password': process.env.SC_PASSWORD, 
        })
        .then((response) => {
            resolve(response.data.access_token);
        })
        .catch((error) => {
            reject(error.message);
        });
    });
}

module.exports = onGetAuthToken;