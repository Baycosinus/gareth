require('dotenv').config();
const axios = require('axios');
const web3 = require('web3');

const apiKey = process.env.ETHERSCAN_API_KEY;
const etherScanApi = process.env.ETHERSCAN_API_URL;
const coingeckoApi = process.env.COINGECKO_EXCHANGE_URL;

const parseMultipleAccounts = async (accounts) => {
    const url = `${etherScanApi}?module=account&action=balancemulti&address=${accounts.join(',')}&tag=latest&apikey=${apiKey}`;
    let res = [];
    let exchangeRate = 0;

    await axios.get(url)
        .then((response) => {
            if(response.status == 200 && response.data.status === '1'){
                res = response.data.result;
            }
        })
        .catch((error) => {
            throw error;
        });

    await axios.get(coingeckoApi)
        .then((response) => {
            if(response.status == 200 && response.data.ethereum.usd){
                exchangeRate = response.data.ethereum.usd;
            }
        })
        .catch((error) => {
            throw error;
        });

    res.forEach((account) => {
        account.balance = web3.utils.fromWei(account.balance, 'ether');
        account.balanceInUSD = account.balance * exchangeRate;
    });

    return res;
}

module.exports = {
    parseMultipleAccounts
}