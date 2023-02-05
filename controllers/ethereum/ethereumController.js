const web3 = require('web3');
const etherScanService = require('../../services/etherScan/etherScanService');

const processEthereumAddresses = async (req, res, next) => {
    let response = {
        invalidAddresses: [],
        validAddresses: []
    };

    let addresses = req.body.addresses;
    response = await validateEthereumAddresses(response, addresses);

    if (response.validAddresses.length > 0) {
        try {
            response.validAddresses = await etherScanService.parseMultipleAccounts(response.validAddresses);
        } catch (error) {
            throw error;
        }
    }

    response.validAddresses = response.validAddresses.sort(x => x.balanceInUSD).reverse();
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