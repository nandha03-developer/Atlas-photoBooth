import {
  CognitoIdentityProviderClient,
  ForgotPasswordCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import crypto from "crypto";

export default async function POST(req :any, res:any) {
  if (req.method !== "POST") return res.status(405).send('Method Not Allowed');

  const { username } = req.body;
  // Generate SecretHash
  const generateSecretHash = (username:any, clientId:any, clientSecret:any) => {
    return crypto
      .createHmac("sha256", clientSecret)
      .update(username + clientId)
      .digest("base64");
  };

  const secretHash = generateSecretHash(
    username,
    process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID,
    process.env.NEXT_PUBLIC_COGNITO_CLIENT_SECRET
  );

  const params = {
    ClientId: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID,
    Username: username,
    SecretHash: secretHash,
  };

  const cognitoClient = new CognitoIdentityProviderClient({
    region: process.env.NEXT_PUBLIC_COGNITO_REGION,
  });
  const forgotPasswordCommand = new ForgotPasswordCommand(params);

  try {
    const response = await cognitoClient.send(forgotPasswordCommand);
    return res.status(response['$metadata'].httpStatusCode).send();
  } catch (err:any) {
    const statusCode = err['$metadata']?.httpStatusCode || 500;
    const message = err.message || 'Internal Server Error';
    return res.status(statusCode).json({ message });
  }
}
