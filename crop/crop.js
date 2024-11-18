
initializeCrop();

export function initializeCrop() {
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
            $('#crop-list tbody').empty();
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

function encodeCropImage(imageFile) {
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

function saveCropImage(cropId, image) {
    if (image != null) {

        const formData = new FormData();

        formData.append('cropId', cropId);
        formData.append('image', image);

        $.ajax({
            url: "http://localhost:8082/cms/api/v1/crops",
            type: "POST",
            data: formData,
            contentType: false,
            processData: false,
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
    } else {
        initializeCrop()
    }

}

document.getElementById('crop-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const commonName = document.getElementById('commonName').value;
    const scientificName = document.getElementById('scientificName').value;
    let cropImg = document.getElementById('cropImg').files[0];
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

    let image = null;

    (async function () {
        if (cropImg) {
            try {
                image = await encodeCropImage(cropImg);
            } catch (error) {
                console.error("Error encoding image:", error);
            }
        } else {
            console.log("No file selected.");
        }
    })();

    const crop = {
        commonName,
        scientificName,
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
            var cropId = res.cropId;
            saveCropImage(cropId, image);
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

    const img = document.createElement('img');
    img.src = crop.cropImg ? crop.cropImg : "https://images.app.goo.gl/a4CZZG5C3Y4UGcPu6";
    img.alt = 'Crop Image';
    img.style.width = '50px'; // Adjust size as needed
    img.style.height = '50px'; // Adjust size as needed

    row.innerHTML = `
        <td>${crop.cropId}</td>
        <td>${crop.commonName}</td>
        <td></td>
        <td>${crop.category}</td>
        <td>${crop.cropSeason}</td>
        <td>${crop.fieldId}</td>
        <td><button value="${crop.cropId}" class="edit-btn" onclick="editCrop(this)">Edit</button></td>
        <td><button value="${crop.cropId}" class="delete-btn" onclick="deleteCrop(this)">Delete</button></td>
    `;

    row.cells[2].appendChild(img);
    tableBody.appendChild(row);
}

function deleteCrop(button) {
    if (!confirm(`Are you sure you want to delete crop with ID ${button.value}?`)) return;

    const row = button.parentElement.parentElement;

    const cropId = row.cells[0].textContent;

    $.ajax({
        url: `http://localhost:8082/cms/api/v1/crops/${cropId}`,
        type: "DELETE",
        headers: {
            "Authorization": "Bearer " + localStorage.getItem('token')
        },
        success: (res) => {
            console.log("Crop deleted successfully:", res);
            initializeCrop();
        },
        error: (err) => {
            console.error("Error deleting crop:", err);
        }
    });
}

let updateCropId = null;

function editCrop(button) {
    if (!confirm(`Are you sure you want to edit crop with ID ${button.value}?`)) return;

    const row = button.parentElement.parentElement;

    const cropId = row.cells[0].textContent;
    updateCropId = cropId;

    $('#updateCropBtn').css('display', 'inline');

    $.ajax({
        url: `http://localhost:8082/cms/api/v1/crops/${cropId}`,
        type: "GET",
        headers: {
            "Authorization": "Bearer " + localStorage.getItem('token')
        },
        success: (res) => {
            console.log("Crop data fetched successfully:", res);

            document.getElementById('commonName').value = res.commonName;
            document.getElementById('scientificName').value = res.scientificName;
            document.getElementById('cropCategory').value = res.category;
            document.getElementById('cropSeason').value = res.cropSeason;

            document.getElementById('fieldIdOnCrop').value = res.fieldId || 'Select Field';
            document.getElementById('logIdOnCrop').value = res.logId || 'Select Log';
        },
        error: (err) => {
            console.error("Error fetching crop data:", err);
        }
    });
}


$('#updateCropBtn').on('click', function() {
    const commonName = document.getElementById('commonName').value;
    const scientificName = document.getElementById('scientificName').value;
    let cropImg = document.getElementById('cropImg').files[0];
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
        category,
        cropSeason,
        fieldId,
        logId
    };

    let image = null;

    (async function () {
        if (cropImg) {
            try {
                image = await encodeCropImage(cropImg);
            } catch (error) {
                console.error("Error encoding image:", error);
            }
        } else {
            console.log("No file selected.");
        }
    })();

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
            saveCropImage(updateCropId, image);
            initializeCrop()
        },
        error: (res) => {
            console.error(res);
        }
    });
});
