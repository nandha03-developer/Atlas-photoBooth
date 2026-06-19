import AWS from 'aws-sdk';

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION || 'us-east-1'
});

const uploadFileToS3 = async (file: any, bucketName: any) => {
    const key = `${file?.name}`;
 
    const params = {
        Bucket: bucketName,
        Key: key,
        Body: file,
        ContentType: file.type,
    };
 
    try {
        const data = await s3.upload(params).promise();
        return data.Location;
    } catch (err) {
        console.error('Error uploading file:', err);
        throw err;
    }
};
export default uploadFileToS3;