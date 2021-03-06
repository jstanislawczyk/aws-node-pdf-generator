const fs = require('fs');
const uuid = require('uuid');
const PDFDocument = require('pdfkit');
const qrImage = require('qr-image');

exports.generatePdf = (orderData) => {
    const pdfDocument = new PDFDocument({ size: 'A4' });
    const pdfName = buildPDFName(orderData);
    const writeStream = fs.createWriteStream(pdfName);

    console.log(`Generating PDF with name=${pdfName}`);

    pdfDocument.pipe(writeStream);
    buildTitle(pdfDocument);
    buildQrCode(pdfDocument, orderData);
    buildCustomerInfo(pdfDocument, orderData);
    buildOrderItemsTable(pdfDocument, orderData.items);
    pdfDocument.end();

    console.log(`Generated ${pdfName} PDF`);

    return {
        name: pdfName,
        documentStream: pdfDocument,
    }
};

const buildPDFName = (orderData) => {
    const currentDate = new Date().toISOString().split('T')[0];

    return `${orderData.firstName}-${orderData.lastName}-${currentDate}-${uuid.v4()}.pdf`;
};

const buildQrCode = (pdfDocument, orderData) => {
    const dataString = JSON.stringify({
        name: orderData.firstName,
        lastName: orderData.lastName,
    });
    const qrCode = qrImage.imageSync(dataString);

    pdfDocument
        .image(qrCode, 420, 110, {
            width: 100,
        });
};

const buildTitle = (pdfDocument) => {
    pdfDocument
        .font('Helvetica-Bold')
        .fontSize(25)
        .text('Order', {
            align: 'center',
        });
    pdfDocument.moveDown();
};

const buildCustomerInfo = (pdfDocument, orderData) => {
    pdfDocument
        .fontSize(13)
        .text('Customer', {
            align: 'left',
        });
    pdfDocument
        .fontSize(12)
        .font('Helvetica')
        .text(`First name: ${orderData.firstName}`);
    pdfDocument
        .text(`Last name: ${orderData.firstName}`);
    pdfDocument.moveDown();

    pdfDocument
        .text(`Order date: ${new Date(orderData.date).toLocaleString()}`);
    pdfDocument.moveDown(2);
};

const buildOrderItemsTable = (pdfDocument, orderItems) => {
    let x = 72;
    let y = 255;
    let width = 453;
    let height = 17;

    pdfDocument
        .font('Helvetica-Bold')
        .fontSize(13)
        .text('Items', {
            align: 'center',
        });

    buildRow(
        pdfDocument,
        ['Name', 'Price', 'Quantity', 'Total'],
        { x, y, width, height },
        'Helvetica-Bold',
    );

    for (const item of orderItems) {
        const pageMaxHeight = 780;
        y += height;

        if (y > pageMaxHeight) {
            y = 40;
            pdfDocument.addPage();
        }

        buildRow(
            pdfDocument,
            Object.values(item),
            { x, y, width, height },
        );
    }
};

const buildRow = (pdfDocument, rowData, rowPosition, font = 'Helvetica') => {
    const columnWidth = rowPosition.width / rowData.length;

    pdfDocument
        .rect(rowPosition.x, rowPosition.y, rowPosition.width, rowPosition.height)
        .stroke();

    for (const [iteration, columnText] of rowData.entries()) {
        const columnStartX = columnWidth * iteration;
        const textMargin = 5;

        pdfDocument
            .font(font)
            .fontSize(12)
            .text(columnText, rowPosition.x + textMargin + columnStartX, rowPosition.y + textMargin, { lineBreak: false });

        pdfDocument
            .moveTo(rowPosition.x + columnStartX, rowPosition.y)
            .lineTo(rowPosition.x + columnStartX, rowPosition.y + rowPosition.height)
            .stroke();
    }
};
