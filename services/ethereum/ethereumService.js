require('dotenv').config();
const axios = require('axios');
const Web3 = require('web3');
const ABI = [
    {
        constant: true,
        inputs: [{ name: "_owner", type: "address" }],
        name: "balanceOf",
        outputs: [{ name: "balance", type: "uint256" }],
        type: "function",
    },
 ];

const tetherToken = "0xdAC17F958D2ee523a2206206994597C13D831ec7";
let web3 = new Web3(new Web3.providers.HttpProvider(`https://eth-mainnet.g.alchemy.com/v2/RJTVywuIH0ne43zofIlDyu9oMHWlqYjD`));

const apiKey = process.env.ALCHEMY_API_KEY;
const coingeckoApi = process.env.COINGECKO_EXCHANGE_URL;

const parseMultipleAccounts = async (accounts) => {
    let res = [];
    let exchangeRate = 0;
   
    
    for(let i = 0; i < accounts.length; i++){
        const account = accounts[i];
        const balance = await web3.eth.getBalance(account);
        const tetherBalance = await parseTetherBalance(account);

        res.push({
            account,
            balance,
            tetherBalance
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
        account.totalBalance = account.balance + account.tetherBalance;
    });

    return res;
}

const parseTetherBalance = async (account) => {
    const contract = new web3.eth.Contract(ABI, tetherToken);
    let balance = 0;

    const res = await contract.methods.balanceOf(account).call();
    balance = web3.utils.fromWei(res);

    return balance;
}
module.exports = {
    parseMultipleAccounts
}