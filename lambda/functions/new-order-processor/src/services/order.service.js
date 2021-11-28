const uuid = require('uuid');

exports.enrichOrder = function(order) {
    order.id = uuid.v4();
    order.date = Date.now();
    order.items = order.items.map((item) => ({
        ...item,
        total: item.quantity * item.price,
    }));

    console.log(`Order enriched: ${JSON.stringify(order)}`);

    return order;
}
