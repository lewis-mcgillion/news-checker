import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import OpenAI from "openai";

export async function newsCheckerTrigger(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    const body = request.body;
    if (!body) {
        return {
            status: 400,
            body: "Request body is empty"
        };
    }

    const openai = new OpenAI({apiKey: ""});

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
                    "text": body.toString()
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
