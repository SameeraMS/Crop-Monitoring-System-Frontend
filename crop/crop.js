document.getElementById('crop-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const cropId = document.getElementById('cropId').value;
    const commonName = document.getElementById('commonName').value;
    const scientificName = document.getElementById('scientificName').value;
    const cropImg = document.getElementById('cropImg').value;
    const category = document.getElementById('category').value;
    const cropSeason = document.getElementById('cropSeason').value;
    const fieldId = document.getElementById('fieldId').value;
    const logId = document.getElementById('logId').value;

    const crop = {
        cropId,
        commonName,
        scientificName,
        cropImg,
        category,
        cropSeason,
        fieldId,
        logId
    };

    // Add crop to the table
    addCropToTable(crop);

    // Clear the form
    document.getElementById('crop-form').reset();
});

function addCropToTable(crop) {
    const tableBody = document.querySelector('#crop-list tbody');
    const row = document.createElement('tr');

    row.innerHTML = `
        <td>${crop.commonName}</td>
        <td>${crop.scientificName}</td>
        <td>${crop.category}</td>
        <td>${crop.cropSeason}</td>
        <td>${crop.fieldId}</td>
        <td><button value="${crop.cropId}" class="edit-btn" onclick="editCrop(this)">Edit</button></td>
        <td><button value="${crop.cropId}" class="delete-btn" onclick="deleteCrop(this)">Delete</button></td>
    `;

    tableBody.appendChild(row);
}

function deleteCrop(button) {
    const row = button.parentElement.parentElement;
    row.remove();
}

function editCrop(button) {
    const row = button.parentElement.parentElement;
    // Implement editing functionality here
    // Populate form fields with existing data
}
