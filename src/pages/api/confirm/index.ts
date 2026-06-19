import {
  CognitoIdentityProviderClient,
  ConfirmSignUpCommand,
  ExpiredCodeException,
} from "@aws-sdk/client-cognito-identity-provider";

export default async function POST(req:any, res:any) {
  if (req.method !== "POST") return res.status(405).send();

  const params = {
    ClientId: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID,
    ConfirmationCode: req.body.otpValue,
    Username: req.body.username,
  };

  const cognitoClient = new CognitoIdentityProviderClient({
    region: process.env.NEXT_PUBLIC_COGNITO_REGION,
  });
  const confirmSignUpCommand = new ConfirmSignUpCommand(params);

  try {
    const response = await cognitoClient.send(confirmSignUpCommand);
    return res.status(response.$metadata.httpStatusCode).send();
  } catch (err) {
    if (err instanceof ExpiredCodeException) {
      return res.status(400).json({
        message: "Confirmation code has expired. Please request a new one.",
      });
    } else {
      return res
        .status(500)
        .json({ message: "An error occurred while confirming the sign up." });
    }
  }
}
