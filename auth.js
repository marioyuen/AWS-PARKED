function checkAuthentication() {
    const accessToken = localStorage.getItem('access_token');
    const idToken = localStorage.getItem('id_token');
    if (!accessToken || ! idToken) {
        console.log('No access token found, redirecting to index.html');
        window.location.href = 'index.html';
    } else {
        const userInfo = parseJwt(idToken);        
        document.getElementById('usernameDisplay').innerText = 'Logged in as: ' + userInfo.email;
    }
}
// const userInfo = parseJwt(idToken);
function parseJwt(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
}

function logout() {
    console.log('Initiating Cognito logout and clearing tokens');
    localStorage.removeItem('access_token');
    localStorage.removeItem('id_token');
    localStorage.removeItem('refresh_token');
    const cognitoDomain = 'https://fit5225cs1.auth.us-east-1.amazoncognito.com/logout';
    const clientId = '6i1n043vk22dgqphagp7u1mabo';
    const logoutUri = encodeURIComponent('http://localhost/logout.html');
    const url = `${cognitoDomain}?client_id=${clientId}&logout_uri=${logoutUri}`;
    window.location.href = url;
}

window.onload = checkAuthentication;
