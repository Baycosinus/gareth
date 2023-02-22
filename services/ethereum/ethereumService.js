require('dotenv').config();
const axios = require('axios');
const Web3 = require('web3');

const apiKey = process.env.ALCHEMY_API_KEY;
const coingeckoApi = process.env.COINGECKO_EXCHANGE_URL;

const parseMultipleAccounts = async (accounts) => {
    let res = [];
    let exchangeRate = 0;
    let web3 = new Web3(new Web3.providers.HttpProvider(`https://eth-goerli.g.alchemy.com/v2/${apiKey}`));
    
    for(let i = 0; i < accounts.length; i++){
        const account = accounts[i];
        const balance = await web3.eth.getBalance(account);
        res.push({
            account,
            balance
        });
    }

    // get balance from ethereum node


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