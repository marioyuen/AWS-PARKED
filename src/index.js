import { CognitoUserPool, CognitoUser } from 'amazon-cognito-identity-js';

// Configuration for User Pool
const poolData = {
  UserPoolId: 'us-east-1_G9O03ZBlQ', // User Pool Id
  ClientId: '6i1n043vk22dgqphagp7u1mabo' // App Client Id
};

const userPool = new CognitoUserPool(poolData);

function getCurrentUser() {
  return userPool.getCurrentUser();
}

function getUserAttributes() {
  const cognitoUser = getCurrentUser();
  
  if (cognitoUser) {
    cognitoUser.getSession((err, session) => {
      if (err) {
        console.log(err.message || JSON.stringify(err));
        return;
      }

      cognitoUser.getUserAttributes((err, result) => {
        if (err) {
          alert(err.message || JSON.stringify(err));
          return;
        }
        for (let i = 0; i < result.length; i++) {
          console.log('attribute ' + result[i].getName() + ' has value ' + result[i].getValue());
        }
      });
    });
  }
}

function verifyUserAttribute(attributeName) {
  const cognitoUser = getCurrentUser();

  if (cognitoUser) {
    cognitoUser.getSession((err, session) => {
      if (err) {
        console.log(err.message || JSON.stringify(err));
        return;
      }

      cognitoUser.getAttributeVerificationCode(attributeName, {
        onSuccess: function(result) {
          console.log('call result: ' + result);
        },
        onFailure: function(err) {
          alert(err.message || JSON.stringify(err));
        },
        inputVerificationCode: function() {
          var verificationCode = prompt('Please input verification code: ', '');
          cognitoUser.verifyAttribute(attributeName, verificationCode, {
            onSuccess: function(result) {
              console.log('call result: ' + result);
            },
            onFailure: function(err) {
              alert(err.message || JSON.stringify(err));
            }
          });
        }
      });
    });
  }
}

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

// Protect a specific page
document.addEventListener('DOMContentLoaded', function () {
  protectRoute();
});

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

// Call this function when you want to retrieve user attributes
document.addEventListener('DOMContentLoaded', function() {
  if (checkLogin()) {
    getUserAttributes();
  }
});


function logout() {
    localStorage.clear();
    window.location.href = 'https://fit5225cs1.auth.us-east-1.amazoncognito.com/logout?client_id=6i1n043vk22dgqphagp7u1mabo&logout_uri=http://localhost/logout.html';
  }
    

// Global public functions for other HTML
window.checkLogin = checkLogin;
window.protectRoute = protectRoute;
window.getUserAttributes = getUserAttributes;
window.verifyUserAttribute = verifyUserAttribute;
window.displayLoggedInUser = displayLoggedInUser;
window.extractTokenFromURL = extractTokenFromURL;
window.decodeIdToken = decodeIdToken;
window.logout = logout;