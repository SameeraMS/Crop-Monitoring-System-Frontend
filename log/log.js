document.getElementById('log-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const logId = document.getElementById('logId').value;
    const logDate = document.getElementById('logDate').value;
    const logDetails = document.getElementById('logDetails').value;
    const logImage = document.getElementById('logImage').files[0];
    const fields = Array.from(document.getElementById('fields').selectedOptions).map(option => option.value);
    const crops = Array.from(document.getElementById('crops').selectedOptions).map(option => option.value);
    const staffs = Array.from(document.getElementById('staffs').selectedOptions).map(option => option.value);

    const log = {
        logId,
        logDate,
        logDetails,
        logImage,
        fields,
        crops,
        staffs
    };

    // Add log to the table
    addLogToTable(log);

    // Clear the form
    document.getElementById('log-form').reset();
});

function addLogToTable(log) {
    const tableBody = document.querySelector('#log-list tbody');
    const row = document.createElement('tr');

    const imageDisplay = log.logImage ? `<img src="${URL.createObjectURL(log.logImage)}" alt="Log Image" width="50">` : 'No Image';

    row.innerHTML = `
        <td>${log.logId}</td>
        <td>${log.logDate}</td>
        <td>${log.logDetails}</td>
        <td>${imageDisplay}</td>
        <td>${log.fields.join(', ')}</td>
        <td>${log.crops.join(', ')}</td>
        <td>${log.staffs.join(', ')}</td>
        <td><button value="${log.logId}" class="edit-btn" onclick="editLog(this)">Edit</button></td>
        <td><button value="${log.logId}" class="delete-btn" onclick="deleteLog(this)">Delete</button></td>
    `;

    tableBody.appendChild(row);
}

function deleteLog(button) {
    const row = button.parentElement.parentElement;
    row.remove();
}

function editLog(button) {
    const row = button.parentElement.parentElement;
    // Implement edit functionality as needed
}
