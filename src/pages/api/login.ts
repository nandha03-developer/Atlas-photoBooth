import { CognitoIdentityProviderClient, AdminInitiateAuthCommand } from "@aws-sdk/client-cognito-identity-provider"

export default async function POST(req:any, res:any) {
    if (req.method !== 'POST') return res.status(405).send()

    const params:any = {
        AnalyticsMetadata: {
            AnalyticsEndpointId: "d70b2ba36a8c4dc5a04a0451a31a1e12"
          },
        AuthFlow: 'USER_PASSWORD_AUTH',
        ClientId: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID,
        AuthParameters: {
            USERNAME: "mytestuser",
            PASSWORD: "This-is-my-test-99!",                                                        
            SECRET_HASH: "oT5ZkS8ctnrhYeeGsGTvOzPhoc/Jd1cO5fueBWFVmp8=",
        },
        ClientMetadata: {
            MyTestKey: "MyTestValue"
          },
          UserContextData: {
            EncodedData: "AmazonCognitoAdvancedSecurityData_object",
            IpAddress: "192.0.2.1"
          }         
    }
    const cognitoClient = new CognitoIdentityProviderClient({
        region: process.env.NEXT_PUBLIC_COGNITO_REGION,
    });
    
    const adminInitiateAuthCommand = new AdminInitiateAuthCommand(params)
    try {
        const response = await cognitoClient.send(adminInitiateAuthCommand)
        return res.status(response['$metadata'].httpStatusCode).send()
    } catch(err:any) {
        const statusCode = err['$metadata'] ? err['$metadata'].httpStatusCode : 500;
        return res.status(statusCode).json({ message: err.toString() });
    }
}                               