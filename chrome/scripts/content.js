let articleContent = "";
const mainElements = document.querySelectorAll('main');

if (mainElements.length > 0) {
    mainElements.forEach(main => {
        articleContent = articleContent.concat(main.innerText);
    });
}
else {
    const bodyElements = document.querySelectorAll('body');
    bodyElements.forEach(body => {
        articleContent = articleContent.concat(body.innerText);
    });
}

const AZ_FUNCTION_URL = '';

fetch(AZ_FUNCTION_URL, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({ "text" : articleContent }),
})
    .then(response => response.json())
    .then(data => {
        console.log(data);

        const newDiv = document.createElement('div');
        Object.assign(newDiv.style, {
            width: '400px',
            height: 'auto',
            position: 'fixed',
            top: '25px',
            right: '25px',
            backgroundColor: '#e8e8e8',
            zIndex: '1000',
            border: '1px solid #333',
            borderRadius: '10px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            padding: '10px',
            boxSizing: 'border-box',
            fontFamily: 'Helvetica, Arial, sans-serif',
        });

        //chatgpt likes to respond with markdown
        const cleanData = data.replace(/```html|```/g, '');
        newDiv.innerHTML = "<h2>Analysis of this article by NewsCheckerAI</h2><br>" + cleanData;

        const closeButton = document.createElement('button');
        closeButton.innerText = 'x';
        Object.assign(closeButton.style, {
            position: 'absolute',
            top: '-17.5px',
            left: '-17.5px',
            width: '30px',
            height: '30px',
            background: 'white',
            border: '1px solid black',
            borderRadius: '50%',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
        });

        closeButton.addEventListener('click', () => {
            newDiv.remove();
        });

        newDiv.appendChild(closeButton);

        document.body.appendChild(newDiv);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
