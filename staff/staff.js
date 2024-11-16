initializeStaff()

 function initializeStaff() {
    loadStaffTable()
    loadLogIds()
    loadFieldIds()
    clearStaffForm()
}

function loadFieldIds() {

    $.ajax({
        url: "http://localhost:8082/cms/api/v1/fields",
        type: "GET",
        headers: {
            "Authorization": "Bearer " + localStorage.getItem('token')
        },
        success: (res) => {
            console.log(res);
            const fieldIds = res.map(field => field.fieldId);
            const fieldIdSelect = document.getElementById('fieldIdOnStaff');
            $('#fieldIdOnStaff').empty();
            $('#fieldIdOnStaff').append('<option selected>Select Field</option>');
            fieldIds.forEach(fieldId => {
                const option = document.createElement('option');
                option.value = fieldId;
                option.text = fieldId;
                fieldIdSelect.appendChild(option);
            });
        },
        error: (res) => {
            console.error(res);
        }
    });
}


function loadStaffTable() {
    $.ajax({
        url: "http://localhost:8082/cms/api/v1/staffs",
        type: "GET",
        headers: {
            "Authorization": "Bearer " + localStorage.getItem('token')
        },
        success: (res) => {
            $('#staff-list tbody').empty();
            res.forEach(staff => {
                addStaffToTable(staff);
            });
            new DataTable("#staff-list", {paging: false, pageLength: 100, destroy: false});
        },
        error: (res) => {
            console.error(res);
        }
    });
}

function loadLogIds() {

    $.ajax({
        url: "http://localhost:8082/cms/api/v1/logs",
        type: "GET",
        headers: {
            "Authorization": "Bearer " + localStorage.getItem('token')
        },
        success: (res) => {
            console.log(res);
            const logIds = res.map(log => log.logId);
            const logIdSelect = document.getElementById('logIdStaff');
            $('#logIdStaff').empty();
            $('#logIdStaff').append('<option selected>Select Log</option>');
            logIds.forEach(logId => {
                const option = document.createElement('option');
                option.value = logId;
                option.textContent = logId;
                logIdSelect.appendChild(option);
            });
        },
        error: (res) => {
            console.error(res);
        }
    });
}

document.getElementById('staff-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const designation = document.getElementById('designation').value;
    const gender = document.getElementById('gender').value;
    const joinedDate = document.getElementById('joinedDate').value;
    const dob = document.getElementById('dob').value;
    const buildingNo = document.getElementById('buildingNo').value;
    const lane = document.getElementById('lane').value;
    const city = document.getElementById('city').value;
    const state = document.getElementById('state').value;
    const postalcode = document.getElementById('postalcode').value;
    const contactNo = document.getElementById('contactNo').value;
    const email = document.getElementById('email').value;
    const role = document.getElementById('role').value;
    let logId = document.getElementById('logIdStaff').value;

    if (logId === 'Select Log') {
        logId = null
    }

    const staff = {
        firstName,
        lastName,
        designation,
        gender,
        joinedDate,
        dob,
        buildingNo,
        lane,
        city,
        state,
        postalcode,
        contactNo,
        email,
        role,
        logId
    };

    $.ajax({
        url: "http://localhost:8082/cms/api/v1/staffs",
        type: "POST",
        data: JSON.stringify(staff),
        contentType: "application/json",
        headers: {
            "Authorization": "Bearer " + localStorage.getItem('token')
        },
        success: (res) => {
            console.log(res);
            initializeStaff()
        },
        error: (res) => {
            console.error(res);
        }
    });


});

function addStaffToTable(staff) {
    const tableBody = document.querySelector('#staff-list tbody');
    const row = document.createElement('tr');

    row.innerHTML = `
        <td>${staff.staffId}</td>
        <td>${staff.firstName}</td>
        <td>${staff.email}</td>
        <td>${staff.role}</td>
        <td><button value="${staff.staffId}" class="edit-btn" onclick="editStaff(this)">Edit</button></td>
        <td><button value="${staff.staffId}" class="delete-btn" onclick="deleteStaff(this)">Delete</button></td>
    `;

    tableBody.appendChild(row);
}

function deleteStaff(button) {
    const row = button.parentElement.parentElement;

    const staffId = row.querySelector('td:nth-child(1)').textContent;

    $.ajax({
        url: "http://localhost:8082/cms/api/v1/staffs/" + staffId,
        type: "DELETE",
        headers: {
            "Authorization": "Bearer " + localStorage.getItem('token')
        },
        success: (res) => {
            console.log(res);
            initializeStaff()
        },
        error: (res) => {
            console.error(res);
        }
    });
}

var updateStaffId = null;

function editStaff(button) {
    const row = button.parentElement.parentElement;

    const staffId = row.querySelector('td:nth-child(1)').textContent;

    $.ajax({
        url: "http://localhost:8082/cms/api/v1/staffs/" + staffId,
        type: "GET",
        headers: {
            "Authorization": "Bearer " + localStorage.getItem('token')
        },
        success: (res) => {
            console.log(res);
            updateStaffId = res.staffId;
            document.getElementById('firstName').value = res.firstName;
            document.getElementById('lastName').value = res.lastName;
            document.getElementById('designation').value = res.designation;
            document.getElementById('gender').value = res.gender;
            document.getElementById('joinedDate').value = res.joinedDate.split('T')[0];
            document.getElementById('dob').value = res.dob.split('T')[0];
            document.getElementById('buildingNo').value = res.buildingNo;
            document.getElementById('lane').value = res.lane;
            document.getElementById('city').value = res.city;
            document.getElementById('state').value = res.state;
            document.getElementById('postalcode').value = res.postalcode;
            document.getElementById('contactNo').value = res.contactNo;
            document.getElementById('email').value = res.email;
            document.getElementById('role').value = res.role;
            document.getElementById('logIdStaff').value = res.logId;
            $('#updateStaffBtn').css('display', 'inline');
        },
        error: (res) => {
            console.error(res);
        }
    });
}

function clearStaffForm() {
    document.getElementById('staff-form').reset();
    $('#updateStaffBtn').css('display', 'none');
}

$('#clearStaffBtn').on('click', () => {
    clearStaffForm();
});

$('#updateStaffBtn').on('click', () => {
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const designation = document.getElementById('designation').value;
    const gender = document.getElementById('gender').value;
    const joinedDate = document.getElementById('joinedDate').value;
    const dob = document.getElementById('dob').value;
    const buildingNo = document.getElementById('buildingNo').value;
    const lane = document.getElementById('lane').value;
    const city = document.getElementById('city').value;
    const state = document.getElementById('state').value;
    const postalcode = document.getElementById('postalcode').value;
    const contactNo = document.getElementById('contactNo').value;
    const email = document.getElementById('email').value;
    const role = document.getElementById('role').value;
    let logId = document.getElementById('logIdStaff').value;

    if (logId === 'Select Log') {
        logId = null
    }

    const staff = {
        firstName,
        lastName,
        designation,
        gender,
        joinedDate,
        dob,
        buildingNo,
        lane,
        city,
        state,
        postalcode,
        contactNo,
        email,
        role,
        logId
    };

    $.ajax({
        url: "http://localhost:8082/cms/api/v1/staffs/" + updateStaffId,
        type: "PUT",
        data: JSON.stringify(staff),
        contentType: "application/json",
        headers: {
            "Authorization": "Bearer " + localStorage.getItem('token')
        },
        success: (res) => {
            console.log(res);
            initializeStaff()
        },
        error: (res) => {
            console.error(res);
        }
    });

});
