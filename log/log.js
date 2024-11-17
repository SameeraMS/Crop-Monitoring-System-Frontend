import { initializeStaff } from "../staff/staff.js";

initializeLog();

function initializeLog() {
    loadLogTable()
    clearForm()
    initializeStaff()
}

function encodeLogImage(imageFile) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = function (event) {
            resolve(event.target.result); // Ensure 'event' is correctly passed
        };
        reader.onerror = function (error) {
            reject(error); // Handle errors properly
        };
        reader.readAsDataURL(imageFile);
    });
}

document.getElementById('log-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const logDate = document.getElementById('logDate').value;
    const logDetails = document.getElementById('logDetails').value;
    const imageFile = document.getElementById('logImage').files[0];

    let image = null;

    (async function () {
        if (imageFile) {
            try {
                image = await encodeLogImage(imageFile);
            } catch (error) {
                console.error("Error encoding image:", error);
            }
        } else {
            console.log("No file selected.");
        }
    })();


    const log = {
        logDate,
        logDetails
    };

    var jsonLog = JSON.stringify(log);

    $.ajax({
        url: "http://localhost:8082/cms/api/v1/logs",
        type: "POST",
        data: jsonLog,
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + localStorage.getItem('token')
        },
        success: (res) => {
            console.log(res);
            var logId = res.logId;
            saveImage(logId, image);
            initializeLog()
        },
        error: (res) => {
            console.error(res);
        }
    });



});

function saveImage(logId, image) {
    if (image != null) {

        const formData = new FormData();

        formData.append('logId', logId);
        formData.append('image', image);

        $.ajax({
            url: "http://localhost:8082/cms/api/v1/logs",
            type: "POST",
            data: formData,
            contentType: false,
            processData: false,
            headers: {
                "Authorization": "Bearer " + localStorage.getItem('token')
            },
            success: (res) => {
                console.log(res);
                initializeLog()
            },
            error: (res) => {
                console.error(res);
            }
        });
    } else {
        initializeLog()
    }

}

function loadLogTable() {
    $.ajax({
        url: "http://localhost:8082/cms/api/v1/logs",
        type: "GET",
        headers: {
            "Authorization": "Bearer " + localStorage.getItem('token')
        },
        success: (res) => {
            $('#log-list tbody').empty();
            res.forEach(log => {
                addLogToTable(log);
            });
            new DataTable("#log-list", {paging: false, pageLength: 100, destroy: false});
        },
        error: (res) => {
            console.error(res);
        }
    });
}

function addLogToTable(log) {
    const tableBody = document.querySelector('#log-list tbody');
    const row = document.createElement('tr');

    log.logDate = log.logDate.split('T')[0];

    const img = document.createElement('img');
    img.src = log.image ? log.image : 'default-image.png'; // Use a default image if log.image is null
    img.alt = 'Log Image';
    img.style.width = '50px'; // Adjust size as needed
    img.style.height = '50px';

    row.innerHTML = `
        <td>${log.logId}</td>
        <td>${log.logDate}</td>
        <td>${log.logDetails}</td>
        <td></td>
        <td><button value="${log.logId}" class="edit-btn">Edit</button></td>
        <td><button value="${log.logId}" class="delete-btn">Delete</button></td>`;

    row.cells[3].appendChild(img);

    tableBody.appendChild(row);
}

document.querySelector('#log-list tbody').addEventListener('click', (e) => {
    const target = e.target;

    if (target.classList.contains('edit-btn')) {
        editLog(target.value);
    }

    if (target.classList.contains('delete-btn')) {
        deleteLog(target.value);
    }
});

function deleteLog(logId) {
    if (!confirm(`Are you sure you want to delete log with ID ${logId}?`)) return;

    $.ajax({
        url: `http://localhost:8082/cms/api/v1/logs/${logId}`,
        type: "DELETE",
        headers: {
            "Authorization": "Bearer " + localStorage.getItem('token')
        },
        success: (res) => {
            console.log('Log deleted successfully:', res);
            initializeLog();
        },
        error: (err) => {
            console.error('Error deleting log:', err);
            alert('Failed to delete log. Please try again.');
        }
    });
}

let updateLogId = null;

function editLog(logId) {
    if (!confirm(`Are you sure you want to edit log with ID ${logId}?`)) return;

    updateLogId = logId;

    const row = document.querySelector(`#log-list tbody tr td button[value="${logId}"]`).closest('tr');

    const logDate = row.cells[1].textContent;
    const logDetails = row.cells[2].textContent;

    document.getElementById('logDate').value = logDate;
    document.getElementById('logDetails').value = logDetails;

    $('#updateLogBtn').css('display', 'inline');
}


$('#updateLogBtn').on('click', () => {

    const logDate = document.getElementById('logDate').value;
    const logDetails = document.getElementById('logDetails').value;
    const imageFile = document.getElementById('logImage').files[0];

    const log = {
        logDate,
        logDetails
    };

    let image = null;

    (async function () {
        if (imageFile) {
            try {
                image = await encodeLogImage(imageFile);
            } catch (error) {
                console.error("Error encoding image:", error);
            }
        } else {
            console.log("No file selected.");
        }
    })();


    $.ajax({
        url: "http://localhost:8082/cms/api/v1/logs/" + updateLogId,
        type: "PUT",
        headers: {
            "Authorization": "Bearer " + localStorage.getItem('token')
        },
        data: JSON.stringify(log),
        contentType: "application/json",
        success: (res) => {
            console.log(res);
            saveImage(updateLogId, image);
            initializeLog()
        },
        error: (res) => {
            console.error(res);
        }
    });
});

function clearForm() {
    document.getElementById('log-form').reset();
    $('#updateLogBtn').css('display', 'none');
}

$('#clearLogBtn').on('click', () => {
    clearForm();
});