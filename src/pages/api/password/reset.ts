import {
    CognitoIdentityProviderClient,
    ConfirmForgotPasswordCommand
} from "@aws-sdk/client-cognito-identity-provider";
import crypto from 'crypto';

const generateSecretHash = (username:any, clientId:any, clientSecret:any) => {
    return crypto.createHmac('SHA256', clientSecret)
        .update(username + clientId)
        .digest('base64');
};

export default async function POST(req:any, res:any) {
    if (req.method !== 'POST') return res.status(405).send();
    

    const clientId = process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID;
    const clientSecret = process.env.NEXT_PUBLIC_COGNITO_CLIENT_SECRET;

    const secretHash = generateSecretHash(req.body.email, clientId, clientSecret);

    const params = {
        ClientId: clientId,
        ConfirmationCode: req.body.otpValue,
        Password: req.body.cPassword,       
        Username: req.body.email,
        SecretHash: secretHash
    };
    

    const cognitoClient = new CognitoIdentityProviderClient({
        region: process.env.NEXT_PUBLIC_COGNITO_REGION,
    });
    
    const confirmForgotPasswordCommand = new ConfirmForgotPasswordCommand(params);

    try {
        const response = await cognitoClient.send(confirmForgotPasswordCommand);
        return res.status(response['$metadata'].httpStatusCode).send();
    } catch (err :any) {
        return res.status(err['$metadata'].httpStatusCode || 500).json({ message: err.toString() });
    }
}
