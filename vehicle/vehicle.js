

initializeVehicle();

function initializeVehicle() {
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
            $('#vehicle-list tbody').empty();
            res.forEach(vehicle => {
                addVehicleToTable(vehicle);
            });
            new DataTable("#vehicle-list", {paging: false, pageLength: 100, destroy: false});
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
        <td>${vehicle.staffId}</td>
        <td><button class="edit-btn" onclick="editVehicle(this)">Edit</button></td>
        <td><button class="delete-btn" onclick="deleteVehicle(this)">Delete</button></td>
    `;

    tableBody.appendChild(row);
}


function deleteVehicle(button) {
    const row = button.parentElement.parentElement;

    $.ajax({
        url: "http://localhost:8082/cms/api/v1/vehicles/" + vehicleId,
        type: "DELETE",
        headers: {
            "Authorization": "Bearer " + localStorage.getItem('token')
        },
        success: (res) => {
            console.log(res);
            initializeVehicle()
        },
        error: (res) => {
            console.error(res);
        }
    });
}

var updateVehicleId = null;

function editVehicle(button) {
    const row = button.parentElement.parentElement;

    const vehicleId = row.cells[0].textContent;
    $.ajax({
        url: "http://localhost:8082/cms/api/v1/vehicles/" + vehicleId,
        type: "GET",
        headers: {
            "Authorization": "Bearer " + localStorage.getItem('token')
        },
        success: (res) => {
            console.log(res);
            document.getElementById('licenNo').value = res.licenNo;
            document.getElementById('category').value = res.category;
            document.getElementById('fuelType').value = res.fuelType;
            document.getElementById('vehicleStatus').value = res.vehicleStatus;
            if (res.staffId != null) {
                document.getElementById('staffIdOnVehicle').value = res.staffId;
            } else {
                document.getElementById('staffIdOnVehicle').value = 'Select Staff';
            }
            document.getElementById('remark').value = res.remark;
            $('#updateVehicleBtn').css('display', 'inline');
            updateVehicleId = vehicleId;
        },
        error: (res) => {
            console.error(res);
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
