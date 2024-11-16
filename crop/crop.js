
initializeCrop();

function initializeCrop() {
    loadCropTable();
    loadFieldIdOnCrop();
    loadLogIdsOnCrop()
    clearCropForm();
}

function loadLogIdsOnCrop() {
    $.ajax({
        url: "http://localhost:8082/cms/api/v1/logs",
        type: "GET",
        headers: {
            "Authorization": "Bearer " + localStorage.getItem('token')
        },
        success: (res) => {
            const logSelect = document.getElementById('logIdOnCrop');
            $('#logIdOnCrop').empty();
            $('#logIdOnCrop').append('<option selected>Select Log</option>');
            res.forEach(log => {
                const option = document.createElement('option');
                option.value = log.logId;
                option.textContent = log.logId;
                logSelect.appendChild(option);
            });
        },
        error: (res) => {
            console.error(res);
        }
    });
}

function loadFieldIdOnCrop() {
    $.ajax({
        url: "http://localhost:8082/cms/api/v1/fields",
        type: "GET",
        headers: {
            "Authorization": "Bearer " + localStorage.getItem('token')
        },
        success: (res) => {
            const fieldSelect = document.getElementById('fieldIdOnCrop');
            $('#fieldIdOnCrop').empty();
            $('#fieldIdOnCrop').append('<option selected>Select Field</option>');
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

function loadCropTable() {
    $.ajax({
        url: "http://localhost:8082/cms/api/v1/crops",
        type: "GET",
        headers: {
            "Authorization": "Bearer " + localStorage.getItem('token')
        },
        success: (res) => {
            console.log(res);
            res.forEach(crop => {
                addCropToTable(crop);
            });
            new DataTable("#crop-list", {paging: false, pageLength: 100, destroy: false});
        },
        error: (res) => {
            console.error(res);
        }
    });
}


document.getElementById('crop-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const commonName = document.getElementById('commonName').value;
    const scientificName = document.getElementById('scientificName').value;
    let cropImg = document.getElementById('cropImg').value;
    const category = document.getElementById('cropCategory').value;
    const cropSeason = document.getElementById('cropSeason').value;
    let fieldId = document.getElementById('fieldIdOnCrop').value;
    let logId = document.getElementById('logIdOnCrop').value;

    if (cropImg == null) {
        cropImg = null;
    }

    if (fieldId == null) {
        fieldId = null;
    }

    if (logId == null) {
        logId = null;
    }

    const crop = {
        commonName,
        scientificName,
        cropImg,
        category,
        cropSeason,
        fieldId,
        logId
    };

    $.ajax({
        url: "http://localhost:8082/cms/api/v1/crops",
        type: "POST",
        headers: {
            "Authorization": "Bearer " + localStorage.getItem('token')
        },
        data: JSON.stringify(crop),
        contentType: "application/json",
        success: (res) => {
            console.log(res);
            initializeCrop()
        },
        error: (res) => {
            console.error(res);
        }
    });

});

function clearCropForm() {
    document.getElementById('crop-form').reset();
    $('#updateCropBtn').css('display', 'none');
}

function addCropToTable(crop) {
    const tableBody = document.querySelector('#crop-list tbody');
    const row = document.createElement('tr');

    row.innerHTML = `
        <td>${crop.commonName}</td>
        <td>${crop.scientificName}</td>
        <td>${crop.category}</td>
        <td>${crop.cropSeason}</td>
        <td>${crop.fieldId}</td>
        <td><button value="${crop.cropId}" class="edit-btn" onclick="editCrop(this)">Edit</button></td>
        <td><button value="${crop.cropId}" class="delete-btn" onclick="deleteCrop(this)">Delete</button></td>
    `;

    tableBody.appendChild(row);
}

function deleteCrop(button) {
    const row = button.parentElement.parentElement;

    const cropId = row.querySelector('td:nth-child(1)').textContent;

    $.ajax({
        url: "http://localhost:8082/cms/api/v1/crops/" + cropId,
        type: "DELETE",
        headers: {
            "Authorization": "Bearer " + localStorage.getItem('token')
        },
        success: (res) => {
            console.log(res);
            initializeCrop()
        },
        error: (res) => {
            console.error(res);
        }
    });
}

let updateCropId = null;

function editCrop(button) {
    const row = button.parentElement.parentElement;

    updateCropId = row.cells[0].textContent;

    $.ajax({
        url: "http://localhost:8082/cms/api/v1/crops/" + updateCropId,
        type: "GET",
        headers: {
            "Authorization": "Bearer " + localStorage.getItem('token')
        },
        success: (res) => {
            console.log(res);
            document.getElementById('commonName').value = res.commonName;
            document.getElementById('scientificName').value = res.scientificName;
            document.getElementById('cropCategory').value = res.category;
            document.getElementById('cropSeason').value = res.cropSeason;
            if (res.fieldId != null) {
                document.getElementById('fieldIdOnCrop').value = res.fieldId;
            } else {
                document.getElementById('fieldIdOnCrop').value = 'Select Field';
            }

            if (res.logId != null) {
                document.getElementById('logIdOnCrop').value = res.logId;
            } else {
                document.getElementById('logIdOnCrop').value = 'Select Log';
            }
            $('#updateCropBtn').css('display', 'inline');
        },
        error: (res) => {
            console.error(res);
        }
    });

}

$('#updateCropBtn').on('click', function() {
    const commonName = document.getElementById('commonName').value;
    const scientificName = document.getElementById('scientificName').value;
    let cropImg = document.getElementById('cropImg').value;
    const category = document.getElementById('cropCategory').value;
    const cropSeason = document.getElementById('cropSeason').value;
    let fieldId = document.getElementById('fieldIdOnCrop').value;
    let logId = document.getElementById('logIdOnCrop').value;

    if (fieldId == null) {
        fieldId = null;
    }

    if (logId == null) {
        logId = null;
    }

    if (cropImg == null) {
        cropImg = null;
    }

    const crop = {
        commonName,
        scientificName,
        cropImg,
        category,
        cropSeason,
        fieldId,
        logId
    };

    $.ajax({
        url: "http://localhost:8082/cms/api/v1/crops/" + updateCropId,
        type: "PUT",
        headers: {
            "Authorization": "Bearer " + localStorage.getItem('token')
        },
        data: JSON.stringify(crop),
        contentType: "application/json",
        success: (res) => {
            console.log(res);
            initializeCrop()
        },
        error: (res) => {
            console.error(res);
        }
    });
});
