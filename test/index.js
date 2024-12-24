const OpenAI = require("openai");

const openai = new OpenAI();

async function analyzeArticle() {
    console.log("calling");
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
                    "text": "Jorge Ortega, 61, was taken to hospital with serious head injuries after the British Transport Police (BTP) was called to Ilford station at about 20:50 GMT on 4 December. He died in hospital two days later. Ayodele Jambgadi, of Kingston Road in Ilford, has also been charged with affray. The 28-year-old had previously been accused of grievous bodily harm but his charges have now been amended, according to the BTP. The defendant is due to appear at Inner London Crown Court on 7 January."
                  }
                ]
            }
        ],
    });

    console.log(response.choices[0].message.content);
}

analyzeArticle();