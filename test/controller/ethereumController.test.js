const request = require("supertest")
const baseURL = "http://localhost:3000"

const ethereumController = require('../../controllers/ethereum/ethereumController');

describe("POST /ethereum/ethereum", () => {
    const addresses = ["0x123", "0x456", "0xd8f83e2051934951e9aEB016EB3bE8c84bD4f22A",
        "0xeBec795c9c8bBD61FFc14A6662944748F299cAcf"];

    beforeAll(async () => {
        await request(baseURL).post("/ethereum/ethereum").send({ addresses });
    })

    it("should return 200", async () => {
        const response = await request(baseURL).post("/ethereum/ethereum").send({ addresses });
        expect(response.statusCode).toBe(200);
        expect(response.body.error).toBe(undefined);
    });

    it("should return ethereum addresses", async () => {
        const response = await request(baseURL).post("/ethereum/ethereum").send({ addresses });
        expect(response.body.invalidAddresses).toBeDefined();
        expect(response.body.validAddresses).toBeDefined();
    });
});

describe('Ethereum Controller should have a function called processEthereumAddresses', () => {
    it('should have a function called processEthereumAddresses', () => {
        expect(ethereumController.processEthereumAddresses).toBeDefined();
        expect(typeof ethereumController.processEthereumAddresses).toBe('function');
    });

    it('should have a function called validateEthereumAddresses', () => {
        expect(ethereumController.validateEthereumAddresses).toBeDefined();
        expect(typeof ethereumController.validateEthereumAddresses).toBe('function');
    });
});

describe('Ethereum Controller.validateEthereumAddresses should return an object with invalid and valid addresses', () => {
    it('should return an object with invalid and valid addresses', async () => {
        const addresses = ["0x123", "0x456", "0xd8f83e2051934951e9aEB016EB3bE8c84bD4f22A",
            "0xeBec795c9c8bBD61FFc14A6662944748F299cAcf"];
        const response = await ethereumController.validateEthereumAddresses({ invalidAddresses: [], validAddresses: [] }, addresses);
        expect(response.invalidAddresses).toBeDefined();
        expect(response.validAddresses).toBeDefined();
    });
});

describe('EthereumController.processEthereumAddresses should return an object with invalid and valid addresses', () => {
    it('should return an object with invalid and valid addresses', async () => {
        const addresses = ["0x123", "0x456", "0xd8f83e2051934951e9aEB016EB3bE8c84bD4f22A",
            "0xeBec795c9c8bBD61FFc14A6662944748F299cAcf"];
        const response = await request(baseURL).post("/ethereum/ethereum").send({ addresses });
        expect(response.body.invalidAddresses).toBeDefined();
        expect(response.body.validAddresses).toBeDefined();
    });
});

describe('EthereumController.validateEthereumAddresses should return an object with invalid and valid addresses', () => {
    it('should return an object with invalid and valid addresses', async () => {
        const addresses = ["0x123", "0x456", "0xd8f83e2051934951e9aEB016EB3bE8c84bD4f22A",
            "0xeBec795c9c8bBD61FFc14A6662944748F299cAcf"];
        const response = await ethereumController.validateEthereumAddresses({ invalidAddresses: [], validAddresses: [] }, addresses);
        expect(response.invalidAddresses).toBeDefined();
        expect(response.validAddresses).toBeDefined();
    });
});

describe('EthereumController.validateEthereumAddress should return an object with empty invalid and valid addresses', () => {
    it('should return an object with empty invalid and valid addresses', async () => {
        const addresses = ["0x123", "0x456"];
        const response = await ethereumController.validateEthereumAddresses({ invalidAddresses: [], validAddresses: [] }, addresses);
        expect(response.invalidAddresses).toBeDefined();
        expect(response.validAddresses).toBeDefined();
        expect(response.invalidAddresses.length).toBe(2);
        expect(response.validAddresses.length).toBe(0);
    });
});

describe('EthereumController.processEthereumAddresses should return an object with empty invalid and valid addresses', () => {
    it('should return an object with empty invalid and valid addresses', async () => {
        const addresses = ["0x123", "0x456"];
        const response = await request(baseURL).post("/ethereum/ethereum").send({ addresses });
        expect(response.body.invalidAddresses).toBeDefined();
        expect(response.body.validAddresses).toBeDefined();
        expect(response.body.invalidAddresses.length).toBe(2);
        expect(response.body.validAddresses.length).toBe(0);
    });
});

describe('EthereumController.validateEthereumAddress should return an object with empty invalid and valid addresses when addresses is defined', () => {
    it('should return an object with empty invalid and valid addresses', async () => {
        const addresses = ["0xd8f83e2051934951e9aEB016EB3bE8c84bD4f22A",
        "0xeBec795c9c8bBD61FFc14A6662944748F299cAcf"];
        const response = await ethereumController.validateEthereumAddresses({ invalidAddresses: [], validAddresses: [] }, addresses);
        expect(response.invalidAddresses).toBeDefined();
        expect(response.validAddresses).toBeDefined();
        expect(response.invalidAddresses.length).toBe(0);
        expect(response.validAddresses.length).toBe(2);
    });
});

describe('EthereumController.processEthereumAddresses should throw an error when addresses is not defined', () => {
    it('should throw an error when addresses is not defined', async () => {
        const addresses = undefined;
        const response = await request(baseURL).post("/ethereum/ethereum").send({ addresses });
        console.log(response.text);
        expect(response.text).toMatch(/addresses is required/);
    });
});