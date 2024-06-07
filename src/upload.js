import { S3Client, PutObjectTaggingCommand } from "@aws-sdk/client-s3";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-provider-cognito-identity";
import { CognitoIdentityClient } from "@aws-sdk/client-cognito-identity";

// Configuration for s3client using Cognito and S3
const REGION = "us-east-1";
const USER_POOL_ID = "us-east-1_G9O03ZBlQ";
const IDENTITY_POOL_ID = "us-east-1:133a293d-f7f8-4715-8434-37e0bd4beca7";
const S3_BUCKET_NAME = "fit5225bucket";

async function getS3Client(idToken) {
    return new S3Client({
        region: REGION,
        credentials: fromCognitoIdentityPool({
            client: new CognitoIdentityClient({ region: REGION }),
            identityPoolId: IDENTITY_POOL_ID,
            logins: {
                [`cognito-idp.${REGION}.amazonaws.com/${USER_POOL_ID}`]: idToken,
            },
        }),
    });
}

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('upload-form');

    form.addEventListener('submit', async function(event) {
        event.preventDefault();
        
        const fileInput = document.getElementById('image-file');
        const file = fileInput.files[0];

        if (!file) {
            alert('Please select a file to upload.');
            return;
        }
        
        try {
            const url = 'https://03h49voydg.execute-api.us-east-1.amazonaws.com/Testing/fit5225bucket/' + encodeURIComponent(file.name);
            
            const response = await fetch(url, {
                method: 'PUT',
                body: file
            });

            if (response.ok) {
                alert('Image uploaded successfully.');

                const idToken = localStorage.getItem('id_token');
                if (!idToken) {
                    alert('User is not authenticated.');
                    return;
                }

                const s3Client = await getS3Client(idToken);

                const cognitoUser = parseJwt(idToken);
                const identityId = cognitoUser['cognito:username'];

                // Initialize tag with username
                const tagParams = {
                    Bucket: S3_BUCKET_NAME,
                    Key: file.name,
                    Tagging: {
                        TagSet: [
                            {
                                Key: 'username',
                                Value: identityId // Changed to use identityId
                            }
                        ]
                    }
                };

                // Add debug log before tagging
                console.log('Adding tags with parameters:', tagParams);

                const taggingResponse = await s3Client.send(new PutObjectTaggingCommand(tagParams));
                
                // Add debug log for tagging response
                console.log('Tagging response:', taggingResponse);

                alert('Image tagged successfully.');
            } else {
                alert('Failed to upload image. Status: ' + response.status);
            }
        } catch (error) {
            console.error('Error uploading image:', error); 
            alert('Error uploading image. Please try again later.');
        }
    });
});

function redirectToMainPage() {
    window.location.href = 'main.html';
}

function parseJwt(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
}
