document.getElementById('query-form').addEventListener('submit', async function(event) {
    event.preventDefault();
    const tags = document.getElementById('query-tags').value;
    const url = `https://swxm6oo54b.execute-api.us-east-1.amazonaws.com/prod/query?tags=${tags}`;
    
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        const data = await response.json();
        const urls = data.urls;

        const resultsDiv = document.getElementById('results');
        resultsDiv.innerHTML = '';

        urls.forEach(url => {
            const img = document.createElement('img');
            img.src = url;
            img.alt = 'Queried Image';
            img.style.width = '100px';
            img.style.height = '100px';
            resultsDiv.appendChild(img);
        });
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
});
