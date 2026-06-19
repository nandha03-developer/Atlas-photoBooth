import {
  CognitoIdentityProviderClient,
  ResendConfirmationCodeCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import crypto from "crypto";

export default async function POST(req: any, res: any) {
  if (req.method !== "POST") return res.status(405).send();

  const computeSecretHash = (username: string, clientId: string, clientSecret: string) => {
    return crypto
      .createHmac("SHA256", clientSecret)
      .update(username + clientId)
      .digest("base64");
  };

  const params = {
    ClientId: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID || '', // Default to empty string if undefined
    Username: req.body.username || '', // Default to empty string if undefined
    SecretHash: computeSecretHash(
      req.body.username || '',
      process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID || '',
      process.env.NEXT_PUBLIC_COGNITO_CLIENT_SECRET || ''
    ),
};

  const cognitoClient = new CognitoIdentityProviderClient({
    region: process.env.NEXT_PUBLIC_COGNITO_REGION,
  });
  const resendConfirmationCodeCommand = new ResendConfirmationCodeCommand(params);

  try {
    const response = await cognitoClient.send(resendConfirmationCodeCommand);
    return res.status(response["$metadata"].httpStatusCode).send();
  } catch (err: any) {
    return res.status(err["$metadata"].httpStatusCode).json({ message: err.toString() });
  }
}