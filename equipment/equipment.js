document.getElementById('equipment-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const equipmentId = document.getElementById('equipmentId').value;
    const equipmentName = document.getElementById('equipmentName').value;
    const equipmentType = document.getElementById('equipmentType').value;
    const equipmentStatus = document.getElementById('equipmentStatus').value;
    const staffId = document.getElementById('staffId').value;
    const fieldId = document.getElementById('fieldId').value;

    const equipment = {
        equipmentId,
        equipmentName,
        equipmentType,
        equipmentStatus,
        staffId,
        fieldId
    };

    // Add equipment to the table
    addEquipmentToTable(equipment);

    // Clear the form
    document.getElementById('equipment-form').reset();
});

function addEquipmentToTable(equipment) {
    const tableBody = document.querySelector('#equipment-list tbody');
    const row = document.createElement('tr');

    row.innerHTML = `
        <td>${equipment.equipmentName}</td>
        <td>${equipment.equipmentType}</td>
        <td>${equipment.equipmentStatus}</td>
        <td>${equipment.staffId}</td>
        <td>${equipment.fieldId}</td>
        <td><button value=${equipment.equipmentId} class="edit-btn" onclick="editEquipment(this)">Edit</button></td>
        <td><button value=${equipment.equipmentId} class="delete-btn" onclick="deleteEquipment(this)">Delete</button></td>
    `;

    tableBody.appendChild(row);
}

function deleteEquipment(button) {
    const row = button.parentElement.parentElement;
    row.remove();
}
