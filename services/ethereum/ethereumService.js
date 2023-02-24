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

    let promises = [];
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

    // First loop
    for (let i = 0; i < accounts.length; i++) {
        const account = accounts[i];
        if (!web3.utils.isAddress(account)) {
            response.invalidAddresses.push(account);
            continue;
        }

        // Pushing promises to an array to be resolved later, this is to avoid the loop being blocked.
        promises.push(parseBalance(account, exchangeRate));
    }

    res = await Promise.all(promises);

    // Second loop, custom function invalidates reverse by implementing descending order
    response.validAddresses = res.sort((a,b) => { return b.totalBalance - a.totalBalance; });
    return response;
}

const parseBalance = async (account, exchangeRate) => {
    const ethBalance = await parseEtherBalance(account);
    const ethBalanceinUSD = ethBalance * exchangeRate;
    const tetherBalance = await parseTetherBalance(account);

    return {
        ethBalance: ethBalance,
        ethBalanceInUSD: ethBalanceinUSD,
        tetherBalance: tetherBalance,
        totalBalance: ethBalanceinUSD + tetherBalance
    }
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

const parseEtherBalance = async (account) => {
    return web3.utils.fromWei(await web3.eth.getBalance(account), 'ether');
}

module.exports = {
    parseMultipleAccounts
}