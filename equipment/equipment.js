
initializeEquipment();

function initializeEquipment() {
    loadEquipmentTable();
    loadStaffOnEquipment();
    loadFieldOnEquipment();
    clearEquipmentForm();
}

function loadFieldOnEquipment() {
    $.ajax({
        url: "http://localhost:8082/cms/api/v1/fields",
        type: "GET",
        headers: {
            "Authorization": "Bearer " + localStorage.getItem('token')
        },
        success: (res) => {
            const fieldSelect = document.getElementById('fieldIdOnEquipment');
            $('#fieldIdOnEquipment').empty();
            $('#fieldIdOnEquipment').append('<option selected>Select Field</option>');
            res.forEach(field => {
                const option = document.createElement('option');
                option.value = field.fieldId;
                option.textContent = field.fieldId;
                fieldSelect.appendChild(option);
            });
        },
        error: (res) => {
            console.error(res);
        }
    });
}

function loadStaffOnEquipment() {
    $.ajax({
        url: "http://localhost:8082/cms/api/v1/staffs",
        type: "GET",
        headers: {
            "Authorization": "Bearer " + localStorage.getItem('token')
        },
        success: (res) => {
            const staffSelect = document.getElementById('staffIdOnEquipment');
            $('#staffIdOnEquipment').empty();
            $('#staffIdOnEquipment').append('<option selected>Select Staff</option>');
            res.forEach(staff => {
                const option = document.createElement('option');
                option.value = staff.staffId;
                option.textContent = staff.staffId;
                staffSelect.appendChild(option);
            });
        },
        error: (res) => {
            console.error(res);
        }
    });
}

function loadEquipmentTable() {
    $.ajax({
        url: "http://localhost:8082/cms/api/v1/equipments",
        type: "GET",
        headers: {
            "Authorization": "Bearer " + localStorage.getItem('token')
        },
        success: (res) => {
            $('#equipment-list tbody').empty();
            res.forEach(equipment => {
                addEquipmentToTable(equipment);
            });
        },
        error: (res) => {
            console.error(res);
        }
    });
}

document.getElementById('equipment-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const equipmentName = document.getElementById('equipmentName').value;
    const equipmentType = document.getElementById('equipmentType').value;
    const equipmentStatus = document.getElementById('equipmentStatus').value;
    let staffId = document.getElementById('staffIdOnEquipment').value;
    let fieldId = document.getElementById('fieldIdOnEquipment').value;

    if (staffId === 'Select Staff') {
        staffId = null;
    }

    if (fieldId === 'Select Field') {
        fieldId = null;
    }

    const equipment = {
        equipmentName,
        equipmentType,
        equipmentStatus,
        staffId,
        fieldId
    };

    $.ajax({
        url: "http://localhost:8082/cms/api/v1/equipments",
        type: "POST",
        headers: {
            "Authorization": "Bearer " + localStorage.getItem('token')
        },
        data: JSON.stringify(equipment),
        contentType: "application/json",
        success: (res) => {
            console.log(res);
            initializeEquipment();
        },
        error: (res) => {
            console.error(res);
        }
    });

});

function clearEquipmentForm() {
    document.getElementById('equipment-form').reset();
    $('#updateEquipmentBtn').css('display', 'none');
}

$('#clearEquipmentBtn').on('click', () => {
    clearEquipmentForm();
});

function addEquipmentToTable(equipment) {
    const tableBody = document.querySelector('#equipment-list tbody');
    const row = document.createElement('tr');

    row.innerHTML = `
        <td>${equipment.equipmentId}</td>
        <td>${equipment.equipmentName}</td>
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

    const equipmentId = row.querySelector('td:nth-child(1)').textContent;

    $.ajax({
        url: "http://localhost:8082/cms/api/v1/equipments/" + equipmentId,
        type: "DELETE",
        headers: {
            "Authorization": "Bearer " + localStorage.getItem('token')
        },
        success: (res) => {
            console.log(res);
            initializeEquipment()
        },
        error: (res) => {
            console.error(res);
        }
    });
}

let updateEquipmentId = null;

function editEquipment(button) {
    const row = button.parentElement.parentElement;

    const equipmentId = row.querySelector('td:nth-child(1)').textContent;
    updateEquipmentId = equipmentId;
    $.ajax({
        url: "http://localhost:8082/cms/api/v1/equipments/" + equipmentId,
        type: "GET",
        headers: {
            "Authorization": "Bearer " + localStorage.getItem('token')
        },
        success: (res) => {

            document.getElementById('equipmentName').value = res.equipmentName;
            document.getElementById('equipmentType').value = res.equipmentType;
            document.getElementById('equipmentStatus').value = res.equipmentStatus;
            if (res.staffId === null) {
                $('#staffIdOnEquipment').val('Select Staff');
            } else {
                $('#staffIdOnEquipment').val(res.staffId);
            }

            if (res.fieldId === null) {
                $('#fieldIdOnEquipment').val('Select Field');
            } else {
                $('#fieldIdOnEquipment').val(res.fieldId);
            }
            $('#updateEquipmentBtn').css('display', 'inline');
        },
        error: (res) => {
            console.error(res);
        }
    });
}

$('#updateEquipmentBtn').on('click', () => {
    const equipmentName = document.getElementById('equipmentName').value;
    const equipmentType = document.getElementById('equipmentType').value;
    const equipmentStatus = document.getElementById('equipmentStatus').value;
    let staffId = document.getElementById('staffIdOnEquipment').value;
    let fieldId = document.getElementById('fieldIdOnEquipment').value;

    if (staffId === 'Select Staff') {
        staffId = null;
    }

    if (fieldId === 'Select Field') {
        fieldId = null;
    }

    const equipment = {
        equipmentName,
        equipmentType,
        equipmentStatus,
        staffId,
        fieldId
    };

    $.ajax({
        url: "http://localhost:8082/cms/api/v1/equipments/" + updateEquipmentId,
        type: "PUT",
        headers: {
            "Authorization": "Bearer " + localStorage.getItem('token')
        },
        data: JSON.stringify(equipment),
        contentType: "application/json",
        success: (res) => {
            console.log(res);
            initializeEquipment();
        },
        error: (res) => {
            console.error(res);
        }
    });

});

