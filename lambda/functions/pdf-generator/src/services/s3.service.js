const AWS = require('aws-sdk');

exports.savePdf = async (pdfName) => {
    const s3 = new AWS.S3();
    const params = buildParams(pdfName);

    await s3.upload(params).promise();
    console.log(`PDF saved: ${JSON.stringify(params)}`);
};

const buildParams = (pdfName) => {
    const bucketName = process.env.BUCKET_NAME;

    return {
        Body: `../../${pdfName}`,
        Bucket: bucketName,
        Key: `${pdfName}`,
        ContentType : 'application/pdf',
    };
};
