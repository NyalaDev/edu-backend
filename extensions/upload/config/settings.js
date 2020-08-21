module.exports = {
  provider: 'aws-s3',
  providerOptions: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_ACCESS_KEY_SECRET,
    region: process.env.AWS_REGION || 'eu-central-1',
    params: {
      Bucket: `${process.env.S3_BUCKET}/coderhub`,
    },
  },
};
