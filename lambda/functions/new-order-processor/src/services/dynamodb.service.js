const AWS = require('aws-sdk');

exports.saveOrder = async function(order) {
    const dynamodb = new AWS.DynamoDB();
    const params = buildParams(order);
    const putResult = await dynamodb.putItem(params).promise();

    console.log(`New order saved: ${JSON.stringify(putResult)}`);

    return putResult;
}

const buildParams = (order) => {
    const tableName = process.env.DYNAMODB_TABLE_NAME;

    return {
        Item: {
            'Id': {
                S: `${order.id}`,
            },
            'FirstName': {
                S: `${order.firstName}`,
            },
            'LastName': {
                S: `${order.lastName}`,
            },
            'Date': {
                S: `${order.date}`,
            },
        },
        TableName: tableName,
    };
};
