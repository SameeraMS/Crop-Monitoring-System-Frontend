

initializeVehicle();

export function initializeVehicle() {
    loadVehicleTable();
    clearVehicleForm();
    loadStaffOnVehicle();
}

function loadStaffOnVehicle() {
    $.ajax({
        url: "http://localhost:8082/cms/api/v1/staffs",
        type: "GET",
        headers: {
            "Authorization": "Bearer " + localStorage.getItem('token')
        },
        success: (res) => {
            const staffIds = res.map(staff => staff.staffId);
            const staffIdSelect = document.getElementById('staffIdOnVehicle');
            $('#staffIdOnVehicle').empty();
            $('#staffIdOnVehicle').append('<option selected>Select Staff</option>');
            staffIds.forEach(staffId => {
                const option = document.createElement('option');
                option.value = staffId;
                option.textContent = staffId;
                staffIdSelect.appendChild(option);
            });
        },
        error: (res) => {
            console.error(res);
        }
    });
}

function clearVehicleForm() {
    document.getElementById('vehicle-form').reset();
    $('#updateVehicleBtn').css('display', 'none');
}

function loadVehicleTable() {
    $.ajax({
        url: "http://localhost:8082/cms/api/v1/vehicles",
        type: "GET",
        headers: {
            "Authorization": "Bearer " + localStorage.getItem('token')
        },
        success: (res) => {
            $('#vehicle-list').DataTable().destroy();
            $('#vehicle-list tbody').empty();
            res.forEach(vehicle => {
                addVehicleToTable(vehicle);
            });
            new DataTable("#vehicle-list", {paging: false, pageLength: 100, destroy: true});
        },
        error: (res) => {
            console.error(res);
        }
    });
}

document.getElementById('vehicle-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const licenNo = document.getElementById('licenNo').value;
    const category = document.getElementById('category').value;
    const fuelType = document.getElementById('fuelType').value;
    const vehicleStatus = document.getElementById('vehicleStatus').value;
    let staffId = document.getElementById('staffIdOnVehicle').value;
    const remark = document.getElementById('remark').value;

    if (staffId === 'Select Staff') {
        staffId = null;
    }

    const vehicle = {
        licenNo,
        category,
        fuelType,
        vehicleStatus,
        staffId,
        remark
    };

    $.ajax({
        url: "http://localhost:8082/cms/api/v1/vehicles",
        type: "POST",
        headers: {
            "Authorization": "Bearer " + localStorage.getItem('token')
        },
        data: JSON.stringify(vehicle),
        contentType: "application/json",
        success: (res) => {
            console.log(res);
            initializeVehicle();
        },
        error: (res) => {
            console.error(res);
        }
    });

});

function addVehicleToTable(vehicle) {
    const tableBody = document.querySelector('#vehicle-list tbody');
    const row = document.createElement('tr');

    row.innerHTML = `
        <td>${vehicle.vehicleId}</td>
        <td>${vehicle.category}</td>
        <td>${vehicle.fuelType}</td>
        <td>${vehicle.vehicleStatus}</td>
        <td>${vehicle.staffId || "Not Assigned"}</td>
        <td><button class="edit-btn" data-vehicle-id="${vehicle.vehicleId}">Edit</button></td>
        <td><button class="delete-btn" data-vehicle-id="${vehicle.vehicleId}">Delete</button></td>
    `;

    tableBody.appendChild(row);
}

document.querySelector('#vehicle-list tbody').addEventListener('click', (e) => {
    const target = e.target;

    if (target.classList.contains('edit-btn')) {
        const vehicleId = target.getAttribute('data-vehicle-id');
        editVehicle(vehicleId);
    }

    if (target.classList.contains('delete-btn')) {
        const vehicleId = target.getAttribute('data-vehicle-id');
        deleteVehicle(vehicleId);
    }
});

function deleteVehicle(vehicleId) {
    if (!confirm(`Are you sure you want to delete the vehicle with ID ${vehicleId}?`)) return;

    $.ajax({
        url: `http://localhost:8082/cms/api/v1/vehicles/${vehicleId}`,
        type: "DELETE",
        headers: {
            "Authorization": "Bearer " + localStorage.getItem('token')
        },
        success: (res) => {
            console.log("Vehicle deleted successfully:", res);
            initializeVehicle();
        },
        error: (err) => {
            console.error("Error deleting vehicle:", err);
        }
    });
}

let updateVehicleId = null;

function editVehicle(vehicleId) {
    if (!confirm(`Are you sure you want to edit the vehicle with ID ${vehicleId}?`)) return;
    updateVehicleId = vehicleId;

    $('#updateVehicleBtn').css('display', 'inline');

    $.ajax({
        url: `http://localhost:8082/cms/api/v1/vehicles/${vehicleId}`,
        type: "GET",
        headers: {
            "Authorization": "Bearer " + localStorage.getItem('token')
        },
        success: (res) => {
            console.log("Vehicle data fetched successfully:", res);

            document.getElementById('licenNo').value = res.licenNo;
            document.getElementById('category').value = res.category;
            document.getElementById('fuelType').value = res.fuelType;
            document.getElementById('vehicleStatus').value = res.vehicleStatus;

            $('#staffIdOnVehicle').val(res.staffId || 'Select Staff');

            document.getElementById('remark').value = res.remark || "";
        },
        error: (err) => {
            console.error("Error fetching vehicle data:", err);
        }
    });
}


$('#updateVehicleBtn').on('click', function() {
    const licenNo = document.getElementById('licenNo').value;
    const category = document.getElementById('category').value;
    const fuelType = document.getElementById('fuelType').value;
    const vehicleStatus = document.getElementById('vehicleStatus').value;
    let staffId = document.getElementById('staffIdOnVehicle').value;
    const remark = document.getElementById('remark').value;

    if (staffId === 'Select Staff') {
        staffId = null;
    }

    const vehicle = {
        licenNo,
        category,
        fuelType,
        vehicleStatus,
        staffId,
        remark
    };

    $.ajax({
        url: "http://localhost:8082/cms/api/v1/vehicles/" + updateVehicleId,
        type: "PUT",
        headers: {
            "Authorization": "Bearer " + localStorage.getItem('token')
        },
        data: JSON.stringify(vehicle),
        contentType: "application/json",
        success: (res) => {
            console.log(res);
            initializeVehicle();
        },
        error: (res) => {
            console.error(res);
        }
    });

})

$('#clearVehicleBtn').on('click', function() {
    clearVehicleForm();
});
