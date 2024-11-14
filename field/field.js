
initializeField();

function initializeField() {
    loadFieldTable();
    loadLogIdsOnField();
}

function loadFieldTable() {
    $.ajax({
        url: "http://localhost:8082/cms/api/v1/fields",
        type: "GET",
        headers: {
            "Authorization": "Bearer " + localStorage.getItem('token')
        },
        success: (res) => {
            $('#field-list tbody').empty();
            res.forEach(field => {
                addFieldToTable(field);
            });
            new DataTable("#field-list", {paging: false, pageLength: 100, destroy: false});
        },
        error: (res) => {
            console.error(res);
        }
    });
}

function loadLogIdsOnField() {
    $.ajax({
        url: "http://localhost:8082/cms/api/v1/logs",
        type: "GET",
        headers: {
            "Authorization": "Bearer " + localStorage.getItem('token')
        },
        success: (res) => {
            const logIdSelect = document.getElementById('logIdOnField');
            $('#logIdOnField').empty();
            $('#logIdOnField').append('<option selected>Select Log</option>');
            res.forEach(log => {
                const option = document.createElement('option');
                option.value = log.logId;
                option.textContent = log.logId;
                logIdSelect.appendChild(option);
            });
        },
        error: (res) => {
            console.error(res);
        }
    });
}

document.getElementById('field-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const fieldName = document.getElementById('fieldName').value;
    let fieldLocation = document.getElementById('fieldLocation').value;
    const fieldSize = document.getElementById('fieldSize').value;
    let image1 = document.getElementById('image1').value;
    let image2 = document.getElementById('image2').value;
    let logId = document.getElementById('logIdOnField').value;

    if (image1 === '') {
        image1 = null;
    }

    if (image2 === '') {
        image2 = null;
    }

    if (logId === 'select log') {
        logId = null;
    }

    fieldLocation = extractCoordinates(fieldLocation);

    const field = {
        fieldName,
        fieldLocation,
        fieldSize,
        image1,
        image2,
        logId
    };

    $.ajax({
        url: "http://localhost:8082/cms/api/v1/fields",
        type: "POST",
        headers: {
            "Authorization": "Bearer " + localStorage.getItem('token')
        },
        data: JSON.stringify(field),
        contentType: "application/json",
        success: (res) => {
            console.log(res);
            initializeField();
            clearFieldForm();
        },
        error: (res) => {
            console.error(res);
        }
    });


});

function extractCoordinates(input) {
    const cleanedInput = input.replace(/\s+/g, ''); // Remove all spaces
    const [lat, lon] = cleanedInput.split(',');     // Split into latitude and longitude

    return {
        x: parseFloat(lat),
        y: parseFloat(lon)
    };
}

$('#clearFieldBtn').on('click', () => {
    clearFieldForm();
});

function clearFieldForm() {
    document.getElementById('field-form').reset();
    $('#updateFieldBtn').css('display', 'none');
}

function addFieldToTable(field) {
    const tableBody = document.querySelector('#field-list tbody');
    const row = document.createElement('tr');

    row.innerHTML = `
        <td>${field.fieldId}</td>
        <td>${field.fieldName}</td>
        <td>${field.fieldSize}</td>
        <td><img src="" alt="Image 1" style="width: 50px;" /></td>
        <td><img src="" alt="Image 2" style="width: 50px;" /></td>
        <td><button value="${field.fieldId}" class="edit-btn" onclick="editField(this)">Edit</button></td>
        <td><button value="${field.fieldId}" class="delete-btn" onclick="deleteField(this)">Delete</button></td>
    `;

    tableBody.appendChild(row);
}

function deleteField(button) {
    const row = button.parentElement.parentElement;

    const fieldId = row.querySelector('td:nth-child(1)').textContent;

    $.ajax({
        url: "http://localhost:8082/cms/api/v1/fields/" + fieldId,
        type: "DELETE",
        headers: {
            "Authorization": "Bearer " + localStorage.getItem('token')
        },
        success: (res) => {
            console.log(res);
            initializeField()
        },
        error: (res) => {
            console.error(res);
        }
    });
}

let updateFieldId = null;

function editField(button) {
    const row = button.parentElement.parentElement;

    const fieldId = row.querySelector('td:nth-child(1)').textContent;
    updateFieldId = fieldId;

    $('#updateFieldBtn').css('display', 'inline');

    $.ajax({
        url: "http://localhost:8082/cms/api/v1/fields/" + fieldId,
        type: "GET",
        headers: {
            "Authorization": "Bearer " + localStorage.getItem('token')
        },
        success: (res) => {
            console.log(res);
            document.getElementById('fieldName').value = res.fieldName;
            document.getElementById('fieldLocation').value = res.fieldLocation.x + ', ' + res.fieldLocation.y;
            document.getElementById('fieldSize').value = res.fieldSize;
            if (res.image1 === null) {
                document.getElementById('image1').value = '';
            } else {
                document.getElementById('image1').value = res.image1;
            }

            if (res.image2 === null) {
                document.getElementById('image2').value = '';
            } else {
                document.getElementById('image2').value = res.image2;
            }

            if (res.logId === null) {
                $('#logIdOnField').val('Select Log');
            } else {
                $('#logIdOnField').val(res.logId);
            }
        },
        error: (res) => {
            console.error(res);
        }
    });

}
