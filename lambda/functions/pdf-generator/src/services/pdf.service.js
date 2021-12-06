const fs = require('fs');
const uuid = require('uuid');
const PDFDocument = require('pdfkit');

exports.generatePdf = async (orderData) => {
    return new Promise((resolve, reject) => {
        const pdfDocument = new PDFDocument({ size: 'A4' });
        const pdfName = buildPDFName(orderData);
        const pdfPath = process.env.IS_LAMBDA === 'true'
            ? `/tmp/${pdfName}`
            : pdfName;
        const writeStream = fs.createWriteStream(pdfPath);

        console.log(`Generating PDF with name=${pdfName}`);

        writeStream.on('finish', () => {
            console.log(`PDF ${pdfName} generated`);
            resolve(pdfName);
        });

        writeStream.on('error', (error) => {
            console.log(`PDF generating error: ${error.message}`)
            reject(error);
        });

        pdfDocument.pipe(writeStream);
        buildTitle(pdfDocument);
        buildCustomerInfo(pdfDocument, orderData);
        buildOrderItemsTable(pdfDocument, orderData.items);
        pdfDocument.end();
    });
};

const buildPDFName = (orderData) => {
    const currentDate = new Date().toISOString().split('T')[0];

    return `${orderData.firstName}-${orderData.lastName}-${currentDate}-${uuid.v4()}.pdf`;
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
        .text(`Firstname: ${orderData.firstName}`);
    pdfDocument
        .text(`Lastname: ${orderData.firstName}`);
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
