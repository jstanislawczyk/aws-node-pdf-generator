const orderService = require('./services/order.service');
const snsService = require('./services/sns.service');

exports.handler = async function(event) {
    const orderData = {
        firstName: 'TestName',
        lastName: 'TestLastName',
        items: [
            {
                name: 'Test1',
                quantity: 11,
                price: 10.0,
            },
            {
                name: 'Test2',
                quantity: 3,
                price: 5.0,
            },
        ],
    };

    const enrichedOrderData = orderService.enrichOrder(orderData);
    await snsService.publishNotification(enrichedOrderData);
};
