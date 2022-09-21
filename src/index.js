const { run } = require('./app.js');
const serverless = require('serverless-http')

module.exports.handler = async (event, context) => {
    const app = await run()
    const handler = serverless(app);
    const result = await handler(event, context);
    return result;
};