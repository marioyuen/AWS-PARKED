let urlsToDelete = [];

function addImageUrl() {
    const imageUrlInput = document.getElementById('image-url');
    const imageUrl = imageUrlInput.value.trim();

    if (!imageUrl) {
        alert('Please enter a valid image URL.');
        return;
    }

    urlsToDelete.push(imageUrl);
    displayUrls();
    imageUrlInput.value = ''; // Clear the input field
}

function displayUrls() {
    const urlList = document.getElementById('url-list');
    urlList.innerHTML = '';

    urlsToDelete.forEach((url, index) => {
        const listItem = document.createElement('li');
        listItem.textContent = url;

        const removeButton = document.createElement('button');
        removeButton.textContent = 'Remove';
        removeButton.onclick = () => {
            removeUrl(index);
        };

        listItem.appendChild(removeButton);
        urlList.appendChild(listItem);
    });
}

function removeUrl(index) {
    urlsToDelete.splice(index, 1);
    displayUrls();
}

async function confirmDelete() {
    if (urlsToDelete.length === 0) {
        alert('No URLs to delete.');
        return;
    }

    const payload = {
        urls: urlsToDelete
    };

    try {
        const response = await fetch('https://03h49voydg.execute-api.us-east-1.amazonaws.com/Testing/delete-images', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            alert("Images deleted successfully.");
            urlsToDelete = []; // Clear the list after successful deletion
            displayUrls(); // Refresh the displayed list
        } else {
            alert("Failed to delete images. Status: " + response.status);
        }
    } catch (error) {
        console.error('Error deleting images:', error);
        alert('Error deleting images. Please try again later.');
    }
}


function redirectToMainPage() {
    window.location.href = 'main.html';
}