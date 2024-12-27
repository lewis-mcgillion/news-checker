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

fetch('https://news-checker.azurewebsites.net/api/newsCheckerTrigger', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({ "text" : articleContent }),
})
    .then(response => response.json())
    .then(data => {
        console.log(data);
    })
    .catch((error) => {
        console.error('Error:', error);
    });