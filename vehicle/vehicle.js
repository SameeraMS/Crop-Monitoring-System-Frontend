document.getElementById('vehicle-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const vehicleId = document.getElementById('vehicleId').value;
    const licenNo = document.getElementById('licenNo').value;
    const category = document.getElementById('category').value;
    const fuelType = document.getElementById('fuelType').value;
    const vehicleStatus = document.getElementById('vehicleStatus').value;
    const staffId = document.getElementById('staffId').value;
    const remark = document.getElementById('remark').value;

    const vehicle = {
        vehicleId,
        licenNo,
        category,
        fuelType,
        vehicleStatus,
        staffId,
        remark
    };

    // Add vehicle to the table
    addVehicleToTable(vehicle);

    // Clear the form
    document.getElementById('vehicle-form').reset();
});

function addVehicleToTable(vehicle) {
    const tableBody = document.querySelector('#vehicle-list tbody');
    const row = document.createElement('tr');

    row.innerHTML = `
        <td>${vehicle.vehicleId}</td>
        <td>${vehicle.licenNo}</td>
        <td>${vehicle.category}</td>
        <td>${vehicle.fuelType}</td>
        <td>${vehicle.vehicleStatus}</td>
        <td>${vehicle.staffId}</td>
        <td>${vehicle.remark}</td>
        <td><button class="delete-btn" onclick="deleteVehicle(this)">Delete</button></td>
    `;

    tableBody.appendChild(row);
}

function deleteVehicle(button) {
    const row = button.parentElement.parentElement;
    row.remove();
}
