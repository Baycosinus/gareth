// Dummy RuleSet

const ethereumRuleSet = {
    name: 'ethereum',
    method: 'POST',
    endpoint: '/ethereum/ethereum',
    body: [
        {
            name: 'addresses',
            type: 'Array',
            required: true,
            minLength: 3,
            maxLength: 20,
            regex: /^[a-zA-Z0-9]+$/
        }
    ],
    query: null
}


module.exports = {
    ValidationRuleSet: [
        ethereumRuleSet
    ]
}


