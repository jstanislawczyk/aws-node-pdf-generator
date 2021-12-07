const orderService = require('./services/order.service');
const dynamodbService = require('./services/dynamodb.service');
const snsService = require('./services/sns.service');

exports.handler = async function(event) {
    const orderData = JSON.parse(event.body);
    const enrichedOrderData = orderService.enrichOrder(orderData);

    await dynamodbService.saveOrder(enrichedOrderData);
    await snsService.publishNotification(enrichedOrderData);

    return {
        statusCode: 200,
        body: JSON.stringify(enrichedOrderData),
    };
};
