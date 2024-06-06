import { CognitoUserPool } from 'amazon-cognito-identity-js';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

// Configuration for User Pool
const poolData = {
  UserPoolId: 'us-east-1_G9O03ZBlQ', // User Pool Id
  ClientId: '6i1n043vk22dgqphagp7u1mabo' // App Client Id
};

const userPool = new CognitoUserPool(poolData);
const bucketName = "fit5225bucket";
const bucketName2 = "fit5225thumbnail";
const bucketRegion = "us-east-1";
const accessKey = "AKIASFDKVUQBWLM7VDDZ";
const secretAccessKey = "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";

const s3 = new S3Client({
    credentials: {
    accessKeyId: accessKey,
    secretAccessKey: secretAccessKey,
},
region: bucketRegion
});


// Function to extract token from URL fragment
function extractTokenFromURL() {
  // Get url
  const fragment = window.location.hash.substring(1); // Remove the '#' character
  // Extract query parameters
  const params = new URLSearchParams(fragment);
  // Get IDtoken from URL for identification
  
  const idToken = params.get('id_token');
  const accessToken = params.get('access_token');
  if (idToken && accessToken) {
      // Store tokens in localStorage for authentication later
      localStorage.setItem('id_token', idToken);
      localStorage.setItem('access_token', accessToken);
      // Remove tokens from URL to clean up (security feature)
      window.history.replaceState({}, document.title, window.location.pathname);
  }
  return idToken;
}


// Function to decode ID token
function decodeIdToken(idToken) {
  const decodedToken = JSON.parse(atob(idToken.split('.')[1]));
  return decodedToken;
}

// Function to display the logged-in user
function displayLoggedInUser() {
  const idToken = extractTokenFromURL();
  
  if (idToken) {
      const decodedToken = decodeIdToken(idToken);
      const userEmail = decodedToken['email'];
      document.getElementById('usernameDisplay').innerText = 'Logged-in User: ' + userEmail;
  } else {
      document.getElementById('usernameDisplay').innerText = 'No user logged in.';
  }
}

// Function to check login status
function checkLogin() {
  const accessToken = localStorage.getItem('access_token');
  const idToken = localStorage.getItem('id_token');

  if (!accessToken || !idToken) {
    return false;
  }
  return true;
}

// Function to protect routes
function protectRoute() {
  if (!checkLogin()) {
    window.location.href = 'https://fit5225cs1.auth.us-east-1.amazoncognito.com/oauth2/authorize?client_id=6i1n043vk22dgqphagp7u1mabo&response_type=token&scope=email+openid+phone&redirect_uri=http%3A%2F%2Flocalhost%2Flogin.html';
  }
}


// Checking login status and displaying user information
document.addEventListener('DOMContentLoaded', function () {
  if (checkLogin()) {
    const idToken = localStorage.getItem('id_token');
    const decodedToken = decodeIdToken(idToken);
    const username = decodedToken['email']; // Adjust the key to match your ID token claims
    document.getElementById('usernameDisplay').innerText = 'Logged in as: ' + username;
  } else {
    document.getElementById('usernameDisplay').innerText = 'Not logged in';
  }
});


function logout() {
    localStorage.clear();
    window.location.href = 'https://fit5225cs1.auth.us-east-1.amazoncognito.com/logout?client_id=6i1n043vk22dgqphagp7u1mabo&logout_uri=http://localhost/logout.html';
  }

async function getS3Url(bucketName, key) {
    const getObjectParams = {
        Bucket: bucketName,
        Key: key
    };
    const command = new GetObjectCommand(getObjectParams);
    const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
    return url;
}

async function displayS3Url() {
    const bucketName = 'fit5225bucket'; // Replace with your bucket name
    const key = '1638984032087.png'; // Replace with your object key

    try {
        const url = await getS3Url(bucketName, key);
        console.log('Signed URL:', url);
        document.getElementById('s3-url-display').innerText = url;
    } catch (error) {
        console.error('Error getting signed URL:', error);
    }
}

// Global public functions for other HTML
window.checkLogin = checkLogin;
window.protectRoute = protectRoute;
window.displayLoggedInUser = displayLoggedInUser;
window.extractTokenFromURL = extractTokenFromURL;
window.decodeIdToken = decodeIdToken;
window.logout = logout;
window.getS3Url = getS3Url;