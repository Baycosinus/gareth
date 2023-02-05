const { ValidationRuleSet } = require('../../models/enums/validationRuleSet');

const validateRequest = (req, res, next) => {
    let errors = applyValidation(req, getValidationRuleSet(req));

    if (errors && errors.length > 0) {
        throw new Error(errors.join('. \n'));
    }

    next();
}

const getValidationRuleSet = (req) => {
    let validation = ValidationRuleSet.find((ruleSet) => {
        return ruleSet.method === req.method && ruleSet.endpoint === req.originalUrl;
    });

    if (!validation) {
        throw new Error('Validation Rule Set not found');
    }

    return validation;
}

const applyValidation = (req, validationRuleSet) => {
    let errors = [];
    if (validationRuleSet.body) {
        errors.concat(validateBody(req, validationRuleSet.body, errors));
    }

    if (validationRuleSet.query) {
        errors.concat(validateQuery(req, validationRuleSet.query, errors));
    }

    return errors;
}

const validateBody = (req, bodyValidationRuleSet, errors) => {
    console.log(req.body);
    bodyValidationRuleSet.forEach((rule) => {
        if (rule.required && !req.body[rule.name]) {
            errors.push(`${rule.name} is required`);
            return;
        }

        if (rule.type && typeof req.body[rule.name] !== rule.type) {
            if (rule.type === 'Array') {
                if (!Array.isArray(req.body[rule.name])) {
                    errors.push(`${rule.name} must be of type ${rule.type}`);
                }
                return;
            }
            else {
                errors.push(`${rule.name} must be of type ${rule.type}`);
            }
            return;
        }

        if (rule.minLength && req.body[rule.name].length < rule.minLength) {
            errors.push(`${rule.name} must be at least ${rule.minLength} characters`);
        }

        if (rule.maxLength && req.body[rule.name].length > rule.maxLength) {
            errors.push(`${rule.name} must be at most ${rule.maxLength} characters`);
        }

        if (rule.regex && !rule.regex.test(req.body[rule.name])) {
            errors.push(`${rule.name} must match the regex ${rule.regex}`);
        }
    });

    return errors;
}

const validateQuery = (req, queryValidationRuleSet, errors) => {
    queryValidationRuleSet.forEach((rule) => {
        if (rule.required && !req.query[rule.name]) {
            errors.push(`${rule.name} is required`);
            return;
        }

        if (rule.type && typeof req.query[rule.name] !== rule.type) {
            errors.push(`${rule.name} must be of type ${rule.type}`);
            return;
        }

        if (rule.minLength && req.query[rule.name].length < rule.minLength) {
            errors.push(`${rule.name} must be at least ${rule.minLength} characters`);
        }

        if (rule.maxLength && req.query[rule.name].length > rule.maxLength) {
            errors.push(`${rule.name} must be at most ${rule.maxLength} characters`);
        }

        if (rule.regex && !rule.regex.test(req.query[rule.name])) {
            errors.push(`${rule.name} must match the regex ${rule.regex}`);
        }
    });

    return errors;
}

module.exports = {
    validateRequest
}