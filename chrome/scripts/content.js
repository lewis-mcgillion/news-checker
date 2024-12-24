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