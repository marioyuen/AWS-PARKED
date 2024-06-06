function redirectToMainPage() {
    window.location.href = 'main.html';
}

// Function to extract bucket name and key from URL
function extractBucketAndKey(s3Url) {
    const url = new URL(s3Url);
    const bucketName = url.hostname.split('.')[0];
    const objectKey = url.pathname.substring(1);            
    return { bucketName, objectKey };
}

// Handle form submission
document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('thumbnail-form');
    form.addEventListener('submit', async function (event) {
        event.preventDefault(); // Prevent the default form submission

        const thumbnailUrl = document.getElementById('thumbnail-url').value;
        const { objectKey } = extractBucketAndKey(thumbnailUrl);
        const fullSizeBucket = 'fit5225bucket'; 
        const url = await getS3Url(fullSizeBucket, objectKey);
        window.open(url, '_blank');
    });
});