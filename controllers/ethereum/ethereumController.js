const web3 = require('web3');
const ethereumService = require('../../services/ethereum/ethereumService');

const processEthereumAddresses = async (req, res, next) => {
    let response = {
        invalidAddresses: [],
        validAddresses: []
    };

    let addresses = req.body.addresses;
    response = await validateEthereumAddresses(response, addresses);

    if (response.validAddresses.length > 0) {
        try {
            response.validAddresses = await ethereumService.parseMultipleAccounts(response.validAddresses);
        } catch (error) {
            throw error;
        }
    }

    response.validAddresses = response.validAddresses.sort(x => x.totalBalance).reverse();
    res.send(response);
}

const validateEthereumAddresses = async (response, addresses) => {
    for (let i = 0; i < addresses.length; i++) {
        if (web3.utils.isAddress(addresses[i])) {
            response.validAddresses.push(addresses[i]);
        }
        else {
            response.invalidAddresses.push(addresses[i]);
        }
    }

    return response;
}

module.exports = {
    processEthereumAddresses,
    validateEthereumAddresses
}