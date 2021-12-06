const AWS = require('aws-sdk');

exports.savePdf = async (pdfName) => {
    const s3 = new AWS.S3();
    const params = buildParams(pdfName);

    await s3.upload(params).promise();
    console.log(`PDF saved: ${JSON.stringify(params)}`);
};

const buildParams = (pdfName) => {
    const bucketName = process.env.BUCKET_NAME;
    const pdfPath = process.env.IS_LAMBDA === 'true'
        ? `/tmp/${pdfName}`
        : `../../${pdfName}`;

    return {
        Body: pdfPath,
        Bucket: bucketName,
        Key: `${pdfName}`,
        ContentType : 'application/pdf',
    };
};
