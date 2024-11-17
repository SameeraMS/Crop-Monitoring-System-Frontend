
initializeField();

function initializeField() {
    loadFieldTable();
    loadLogIdsOnField();
}

function encodeFieldImage(imageFile) {
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

function saveFieldImage(fieldId, image1, image2) {
    if (image1 != null || image2 != null) {
        const formData = new FormData();

        formData.append('fieldId', fieldId);
        formData.append('image1', image1);
        formData.append('image2', image2);

        $.ajax({
            url: "http://localhost:8082/cms/api/v1/fields",
            type: "POST",
            data: formData,
            contentType: false,
            processData: false,
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
    } else {
        initializeField()
    }


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
    let imageFile1 = document.getElementById('image1').files[0];
    let imageFile2 = document.getElementById('image2').files[0];
    let logId = document.getElementById('logIdOnField').value;

    if (logId === 'select log') {
        logId = null;
    }

    let image1 = null;
    let image2 = null;

    (async function () {
        if (imageFile1) {
            try {
                image1 = await encodeFieldImage(imageFile1);
            } catch (error) {
                console.error("Error encoding image:", error);
            }
        } else {
            console.log("No file selected.");
        }

        if (imageFile2) {
            try {
                image2 = await encodeFieldImage(imageFile2);
            } catch (error) {
                console.error("Error encoding image:", error);
            }
        } else {
            console.log("No file selected.");
        }
    })();


    fieldLocation = extractCoordinates(fieldLocation);

    const field = {
        fieldName,
        fieldLocation,
        fieldSize,
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
            var fieldId = res.fieldId;
            saveFieldImage(fieldId, image1, image2);
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

    const img1 = document.createElement('img');
    const img2 = document.createElement('img');

    if (field.image1) {
        img1.src = field.image1;
        img1.alt = 'Field Image 1';
        img1.style.width = '50px'; // Adjust size as needed
        img1.style.height = '50px';
    }

    if (field.image2) {
        img2.src = field.image2;
        img2.alt = 'Field Image 2';
        img2.style.width = '50px'; // Adjust size as needed
        img2.style.height = '50px';
    }

    row.innerHTML = `
        <td>${field.fieldId}</td>
        <td>${field.fieldName}</td>
        <td>${field.fieldSize}</td>
        <td></td>
        <td></td>
        <td><button value="${field.fieldId}" class="edit-btn" onclick="editField(this)">Edit</button></td>
        <td><button value="${field.fieldId}" class="delete-btn" onclick="deleteField(this)">Delete</button></td>
    `;

    if (field.image1) row.cells[3].appendChild(img1);
    if (field.image2) row.cells[4].appendChild(img2);

    tableBody.appendChild(row);
}

function deleteField(button) {
    if (!confirm(`Are you sure you want to delete staff with ID ${button.value}?`)) return;

    const row = button.parentElement.parentElement;

    const fieldId = row.cells[0].textContent;

    $.ajax({
        url: `http://localhost:8082/cms/api/v1/fields/${fieldId}`,
        type: "DELETE",
        headers: {
            "Authorization": "Bearer " + localStorage.getItem('token')
        },
        success: (res) => {
            console.log("Field deleted successfully:", res);
            initializeField();
        },
        error: (err) => {
            console.error("Error deleting field:", err);
        }
    });
}

let updateFieldId = null;

function editField(button) {
    if (!confirm(`Are you sure you want to edit staff with ID ${button.value}?`)) return;

    const row = button.parentElement.parentElement;

    const fieldId = row.cells[0].textContent;
    updateFieldId = fieldId;

    $('#updateFieldBtn').css('display', 'inline');

    $.ajax({
        url: `http://localhost:8082/cms/api/v1/fields/${fieldId}`,
        type: "GET",
        headers: {
            "Authorization": "Bearer " + localStorage.getItem('token')
        },
        success: (res) => {
            console.log("Field data fetched successfully:", res);

            document.getElementById('fieldName').value = res.fieldName;
            document.getElementById('fieldLocation').value = `${res.fieldLocation.x}, ${res.fieldLocation.y}`;
            document.getElementById('fieldSize').value = res.fieldSize;

            $('#logIdOnField').val(res.logId || 'Select Log');
        },
        error: (err) => {
            console.error("Error fetching field data:", err);
        }
    });
}


$('#updateFieldBtn').on('click', () => {
    const fieldName = document.getElementById('fieldName').value;
    let fieldLocation = document.getElementById('fieldLocation').value;
    const fieldSize = document.getElementById('fieldSize').value;
    const logId = document.getElementById('logIdOnField').value;
    let imageFile1 = document.getElementById('image1').files[0];
    let imageFile2 = document.getElementById('image2').files[0];

    let image1 = null;
    let image2 = null;

    (async function () {
        if (imageFile1) {
            try {
                image1 = await encodeFieldImage(imageFile1);
            } catch (error) {
                console.error("Error encoding image:", error);
            }
        } else {
            console.log("No file selected.");
        }

        if (imageFile2) {
            try {
                image2 = await encodeFieldImage(imageFile2);
            } catch (error) {
                console.error("Error encoding image:", error);
            }
        } else {
            console.log("No file selected.");
        }
    })();

    fieldLocation = extractCoordinates(fieldLocation);

    const field = {
        fieldName,
        fieldLocation,
        fieldSize,
        logId
    };

    $.ajax({
        url: "http://localhost:8082/cms/api/v1/fields/" + updateFieldId,
        type: "PUT",
        headers: {
            "Authorization": "Bearer " + localStorage.getItem('token')
        },
        data: JSON.stringify(field),
        contentType: "application/json",
        success: (res) => {
            console.log(res);
            saveFieldImage(updateFieldId, image1, image2);
            initializeField();
        },
        error: (res) => {
            console.error(res);
        }
    });
})
