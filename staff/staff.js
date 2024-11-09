document.getElementById('staff-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const staffId = document.getElementById('staffId').value;
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
    const logId = document.getElementById('logId').value;

    const staff = {
        staffId,
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

    // Add staff to the table
    addStaffToTable(staff);

    // Clear the form
    document.getElementById('staff-form').reset();
});

function addStaffToTable(staff) {
    const tableBody = document.querySelector('#staff-list tbody');
    const row = document.createElement('tr');

    row.innerHTML = `
        <td>${staff.firstName}</td>
        <td>${staff.lastName}</td>
        <td>${staff.designation}</td>
        <td>${staff.contactNo}</td>
        <td>${staff.email}</td>
        <td>${staff.city}</td>
        <td>${staff.role}</td>
        <td><button value="${staff.staffId}" class="edit-btn" onclick="editStaff(this)">Edit</button></td>
        <td><button value="${staff.staffId}" class="delete-btn" onclick="deleteStaff(this)">Delete</button></td>
    `;

    tableBody.appendChild(row);
}

function deleteStaff(button) {
    const row = button.parentElement.parentElement;
    row.remove();
}

function editStaff(button) {
    const row = button.parentElement.parentElement;
    // Implement editing functionality here
    // Populate form fields with existing data
}
