const web3 = require('web3');
const ethereumService = require('../../services/ethereum/ethereumService');

const processEthereumAddresses = async (req, res, next) => {
    let response = {
        invalidAddresses: [],
        validAddresses: []
    };

    let addresses = req.body.addresses;

    try {
        response = await ethereumService.parseMultipleAccounts(addresses);
    } catch (error) {
        throw error;
    }

    res.send(response);
}


module.exports = {
    processEthereumAddresses
}