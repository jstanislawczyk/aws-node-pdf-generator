const AWS = require('aws-sdk');

exports.publishNotification = async function(order) {
    const sns = new AWS.SNS();
    const params = buildParams(order);
    const publishResult = await sns.publish(params).promise();

    console.log(`Notification published: ${JSON.stringify(publishResult)}`);

    return publishResult;
}


const buildParams = (order) => {
    const topicArn = process.env.SNS_TOPIC;

    return {
        Message: JSON.stringify(order),
        TopicArn: topicArn,
    };
};
