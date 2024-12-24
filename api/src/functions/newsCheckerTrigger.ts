import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import OpenAI from "openai";
import { DefaultAzureCredential } from '@azure/identity';
import { SecretClient } from '@azure/keyvault-secrets';

export async function newsCheckerTrigger(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    const body: string = await request.text();

    let parsedBody;
    try {
        parsedBody = JSON.parse(body);
    } catch (error) {
        return {
            status: 400,
            body: 'Invalid JSON in request body'
        };
    }

    if (!parsedBody) {
        return {
            status: 400,
            body: "Request body is empty."
        };
    }

    context.log(body)

    const keyVaultName = "news-checker";
    const secretName = "OpenAI-API-Key";
    const keyVaultUri = `https://${keyVaultName}.vault.azure.net`;

    let openApiKey: string;
    try{
        const credential = new DefaultAzureCredential();
        const client = new SecretClient(keyVaultUri, credential);

        const secret = await client.getSecret(secretName);

        openApiKey = secret.value;
    } catch (error) {
        context.log('Error retrieving OpenAI API key from Key Vault:', error);

        return {
            status: 500,
            body: 'Failed to retrieve OpenAI API key.'
        };
    }

    const openai = new OpenAI({apiKey: openApiKey});

    const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
            { 
                role: "developer",
                content: [
                    {
                    "type": "text",
                    "text": `
                    You are a helpful assistant that analyses news articles for any evidence of bias, 
                    misinformation, or factual inaccuracies. If any issues are found, you should provide 
                    a brief explanation of the problem and provide references of the correct information. 
                    Here is a news article for you to analyze:
                    `
                    }
                ] 
            },
            {
                "role": "user",
                "content": [
                  {
                    "type": "text",
                    "text": parsedBody
                  }
                ]
            }
        ],
    });

    return {
        body: JSON.stringify(response.choices[0].message.content)
    };
};

app.http('newsCheckerTrigger', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    handler: newsCheckerTrigger
});
