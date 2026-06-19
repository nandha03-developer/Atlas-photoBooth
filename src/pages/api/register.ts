import { CognitoIdentityProviderClient, SignUpCommand } from '@aws-sdk/client-cognito-identity-provider'

export default async function POST(req:any, res:any) {
    if (req.method !== 'POST') return res.status(405).send()

    const params = {
        ClientId: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID,
        Password: req.body.password,
        Username: req.body.email,
        UserAttributes: [
            {
                Name: 'email',
                Value: req.body.email,
            },
            {
                Name: 'custom:user_type',
                Value: "User",
            },
        ],
   
    }
    const cognitoClient = new CognitoIdentityProviderClient({
        region: process.env.NEXT_PUBLIC_COGNITO_REGION,
    })
    const signUpCommand = new SignUpCommand(params)

    try {
        const response = await cognitoClient.send(signUpCommand)
        return res.status(response['$metadata'].httpStatusCode).send()
    } catch (err:any) {
        
        return res.status(err['$metadata'].httpStatusCode).json({ message: err.toString() })
    }
}