const pdfGenerator = require('./services/pdf.service');
const s3Service = require('./services/s3.service');

exports.handler = async function(event) {
    const orderData = {
        id: 1,
        firstName: 'TestName',
        lastName: 'TestLastName',
        date: Date.now(),
        items: [
            {
                name: 'Test1',
                quantity: 11,
                price: 10.0,
                total: 110.0,
            },
            {
                name: 'Test2',
                quantity: 3,
                price: 5.0,
                total: 15.0,
            },
        ],
    };

    const pdfName = pdfGenerator.generatePdf(orderData);
    await s3Service.savePdf(pdfName);
};
