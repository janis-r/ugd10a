// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
    automock: false,
    roots: ['./src'],
    preset: 'ts-jest',
    testMatch: ['**/?(*.)spec.ts']
};
