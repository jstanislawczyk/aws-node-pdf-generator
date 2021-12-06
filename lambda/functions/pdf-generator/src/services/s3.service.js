const AWS = require('aws-sdk');

exports.savePdf = async (pdf) => {
    const s3 = new AWS.S3();
    const params = buildParams(pdf);

    await s3.upload(params).promise();
    console.log(`PDF saved: ${pdf.name}`);
};

const buildParams = (pdf) => {
    const bucketName = process.env.BUCKET_NAME;

    return {
        Body: pdf.documentStream,
        Bucket: bucketName,
        Key: pdf.name,
        ContentType : 'application/pdf',
    };
};
