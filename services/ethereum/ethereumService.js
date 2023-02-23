require('dotenv').config();
const axios = require('axios');
const Web3 = require('web3');
const ABI = require('../../models/dto/ABI');

const tetherToken = "0xdAC17F958D2ee523a2206206994597C13D831ec7";
const web3 = new Web3(new Web3.providers.HttpProvider(`${process.env.ALCHEMY_HTTP_PROVIDER}${process.env.ALCHEMY_API_KEY}`));
const coingeckoApi = process.env.COINGECKO_EXCHANGE_URL;


const parseMultipleAccounts = async (accounts) => {
    let response = {
        invalidAddresses: [],
        validAddresses: []
    };

    let res = [];
    let exchangeRate = 0;

    await axios.get(coingeckoApi)
        .then((response) => {
            if (response.status == 200 && response.data.ethereum.usd) {
                exchangeRate = response.data.ethereum.usd;
            }
        })
        .catch((error) => {
            throw error;
        });

    for (let i = 0; i < accounts.length; i++) {
        const account = accounts[i];

        if (!web3.utils.isAddress(account)) {
            response.invalidAddresses.push(account);
            continue;
        }

        const balance = web3.utils.fromWei(await web3.eth.getBalance(account), 'ether');
        const balanceInUSD = balance * exchangeRate;
        const tetherBalance = await parseTetherBalance(account);

        res.push({
            account: account,
            balance: balance,
            balanceInUSD: balanceInUSD,
            tetherBalance: tetherBalance,
            totalBalance: balanceInUSD + tetherBalance
        });
    }

    response.validAddresses = res.sort(x => x.totalBalance).reverse();
    return response;
}

const parseTetherBalance = async (account) => {
    const contract = new web3.eth.Contract(ABI, tetherToken);
    let balance = 0;

    // I needed to get the decimals of the token to get the correct balance
    // Decimals is a function in the contract that keeps track of the decimals of the token
    const res = await contract.methods.balanceOf(account).call();
    const decimals = await contract.methods.decimals().call();
    balance = res / (10**decimals);
    

    return balance;
}

module.exports = {
    parseMultipleAccounts
}