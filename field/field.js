document.getElementById('field-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const fieldId = document.getElementById('fieldId').value;
    const fieldName = document.getElementById('fieldName').value;
    const fieldLocation = document.getElementById('fieldLocation').value;
    const fieldSize = document.getElementById('fieldSize').value;
    const image1 = document.getElementById('image1').value;
    const image2 = document.getElementById('image2').value;
    const logId = document.getElementById('logId').value;

    const field = {
        fieldId,
        fieldName,
        fieldLocation,
        fieldSize,
        image1,
        image2,
        logId
    };

    // Add field to the table
    addFieldToTable(field);

    // Clear the form
    document.getElementById('field-form').reset();
});

function addFieldToTable(field) {
    const tableBody = document.querySelector('#field-list tbody');
    const row = document.createElement('tr');

    row.innerHTML = `
        <td>${field.fieldName}</td>
        <td>${field.fieldLocation}</td>
        <td>${field.fieldSize}</td>
        <td><img src="${field.image1}" alt="Field Image 1" style="width: 100px;" /></td>
        <td><img src="${field.image2}" alt="Field Image 2" style="width: 100px;" /></td>
        <td><button value="${field.fieldId}" class="edit-btn" onclick="editField(this)">Edit</button></td>
        <td><button value="${field.fieldId}" class="delete-btn" onclick="deleteField(this)">Delete</button></td>
    `;

    tableBody.appendChild(row);
}

function deleteField(button) {
    const row = button.parentElement.parentElement;
    row.remove();
}

function editField(button) {
    const row = button.parentElement.parentElement;
    // Implement editing functionality here
    // Populate form fields with existing data
}
