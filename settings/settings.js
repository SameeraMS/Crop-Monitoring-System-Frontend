
let userEmail = localStorage.getItem('user');
let userRole = null;
let userPassword = null;

initializeSettings();


function initializeSettings() {
    getUserDetails();
    setEmailInSettings();
    getUserDetails();
}

function getUserDetails() {
    $.ajax({
        url: "http://localhost:8082/cms/api/v1/users/" + userEmail,
        type: "GET",
        headers: {
            "Authorization": "Bearer " + localStorage.getItem('token')
        },
        success: function (response) {
            userRole = response.role;
            userPassword = response.password;
            document.getElementById('roleForSettings').value = userRole;
        },
        error: function (error) {
            console.log(error);
        }
    });
}

function setEmailInSettings(){
    document.getElementById('emailForSettings').value = localStorage.getItem('user');
}


$('#saveSettingsBtn').on('click', function (e) {

    const email = document.getElementById('emailForSettings').value;
    const role = document.getElementById('roleForSettings').value;
    const roleCode = document.getElementById('roleCode').value;


    const user = {
        email,
        role,
        roleCode
    };

    $.ajax({
        url: "http://localhost:8082/cms/api/v1/users/" + userEmail,
        type: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + localStorage.getItem('token')
        },
        data: JSON.stringify(user),
        success: function (response) {
            console.log("User updated successfully:", response);
            initializeSettings();
            alert("Role saved successfully!");
        },
        error: function (error) {
            console.log(error);
            initializeSettings()
        }
    });


});

// Change Password
$('#changePasswordBtn').on('click', function (e) {
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    // Password Validation
    if (newPassword !== confirmPassword) {
        alert("New password and confirmation do not match!");
    }

    if (newPassword === currentPassword) {
        alert("New password cannot be the same as the current password!");
    }

    const email = userEmail;
    const password = currentPassword;

    const checkUser = {
        email,
        password
    };

    $.ajax({
        url: 'http://localhost:8082/cms/api/v1/auth/signin',
        type: 'POST',
        data: JSON.stringify(checkUser),
        headers: { "Content-Type": "application/json" },
        success: (response) => {
            const password = newPassword;
            const role = userRole;

            const user = {
                email,
                password
            };

            $.ajax({
                url: "http://localhost:8082/cms/api/v1/users/changePassword/" + userEmail,
                type: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + localStorage.getItem('token')
                },
                data: JSON.stringify(user),
                success: function (response) {
                    console.log("User updated successfully:", response);
                    initializeSettings();
                    alert("Password Updated successfully!");
                },
                error: function (error) {
                    console.log(error);
                    initializeSettings()
                }
            });
        },
        error: (xhr, status, error) => {
            console.log(xhr.responseText);
            alert("Incorrect Password!");
        }
    });




});

// Clear Form Inputs (Optional)
document.getElementById('saveSettingsBtn').addEventListener('click', () => {
    document.getElementById('settings-form').reset();
});

document.getElementById('changePasswordBtn').addEventListener('click', () => {
    document.getElementById('change-password-form').reset();
});

document.getElementById('delete-account-form').addEventListener('submit', (e) => {

    $.ajax({
        url: 'http://localhost:8082/cms/api/v1/auth/signin',
        type: 'POST',
        data: JSON.stringify(checkUser),
        headers: { "Content-Type": "application/json" },
        success: (response) => {

            const password = newPassword;

            const user = {
                email,
                password
            };

            $.ajax({
                url: "http://localhost:8082/cms/api/v1/users/" + userEmail,
                type: "DELETE",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem('token')
                },
                success: function (response) {
                    console.log("User deleted successfully:", response);
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    window.location.href = "../login/login.html";
                },
                error: function (error) {
                    console.log(error);
                }
            });
        },
        error: (xhr, status, error) => {
            console.log(xhr.responseText);
            alert("Incorrect Password!");
        }
    });


});