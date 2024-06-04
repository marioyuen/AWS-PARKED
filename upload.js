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
            } else {
                alert('Failed to upload image. Status: ' + response.status);
            }
        } catch (error) {
            console.error('Error uploading image:', error); 
            alert('Error uploading image. Please try again later.');
        }
    });
}); 