const pdfGenerator = require('./services/pdf.service');
const s3Service = require('./services/s3.service');

exports.handler = async function(event) {
    const eventRecordBody = JSON.parse(event.Records[0].body);
    const orderData = JSON.parse(eventRecordBody.Message);

    console.log(`Order data received: ${JSON.stringify(orderData)}`)

    const pdf = pdfGenerator.generatePdf(orderData);

    await s3Service.savePdf(pdf);
};
