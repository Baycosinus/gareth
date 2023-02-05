const etherScanService = require('../../services/etherScan/etherScanService');

describe('EtherScanService should have a function called parseMultipleAccounts', () => {
    it('should have a function called parseMultipleAccounts', () => {
        expect(etherScanService.parseMultipleAccounts).toBeDefined();
        expect(typeof etherScanService.parseMultipleAccounts).toBe('function');
    });
});

describe('EtherScanService.parseMultipleAccounts should throw an error if any env variables are undefined', () => {
    it('should throw an error if any env variables are undefined', () => {
        expect(etherScanService.parseMultipleAccounts()).rejects.toThrow();
    });
});

describe('EtherScanService.parseMultipleAccounts should return an array of objects', () => {
    it('should return an array of objects', async () => {
        const addresses = ["0xd8f83e2051934951e9aEB016EB3bE8c84bD4f22A",
        "0xeBec795c9c8bBD61FFc14A6662944748F299cAcf"];
        const response = await etherScanService.parseMultipleAccounts(addresses);
        expect(response).toBeDefined();
        expect(Array.isArray(response)).toBe(true);
    });
});

describe('EtherScanService.parseMultipleAccounts should return an array of objects with the correct properties', () => {
    it('should return an array of objects with the correct properties', async () => {
        const addresses = ["0xd8f83e2051934951e9aEB016EB3bE8c84bD4f22A",
        "0xeBec795c9c8bBD61FFc14A6662944748F299cAcf"];
        const response = await etherScanService.parseMultipleAccounts(addresses);
        
        expect(response[0].account).toBeDefined();
        expect(response[0].balance).toBeDefined();
        expect(response[0].balanceInUSD).toBeDefined();
    });
});
