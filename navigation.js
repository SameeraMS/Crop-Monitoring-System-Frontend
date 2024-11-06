$('#vehicle_management').css('display','none');
$('#equipment_management').css('display','none');
$('#vehicle_management').css('display','none');
$('#vehicle_management').css('display','none');
$('#vehicle_management').css('display','none');
$('#vehicle_management').css('display','none');
$('#vehicle_management').css('display','none');

$('#dashboard_nav').on('click', () => {
    $('#dashboard').css('display','block');
    $('#vehicle_management').css('display','none');
    $('#equipment_management').css('display','none');
});

$('#vehicle_nav').on('click', () => {
    $('#dashboard').css('display','none');
    $('#vehicle_management').css('display','block');
    $('#equipment_management').css('display','none');
});

$('#equipment_nav').on('click', () => {
    $('#dashboard').css('display','none');
    $('#vehicle_management').css('display','none');
    $('#equipment_management').css('display','block');
});

$('#log_nav').on('click', () => {
    $('#dashboard').css('display','none');
    $('#vehicle_management').css('display','none');
    $('#equipment_management').css('display','none');
});

$('#staff_nav').on('click', () => {
    $('#dashboard').css('display','none');
    $('#vehicle_management').css('display','none');
    $('#equipment_management').css('display','none');
});

$('#crop_nav').on('click', () => {
    $('#dashboard').css('display','none');
    $('#vehicle_management').css('display','none');
    $('#equipment_management').css('display','none');
});

$('#fields_nav').on('click', () => {
    $('#dashboard').css('display','none');
    $('#vehicle_management').css('display','none');
    $('#equipment_management').css('display','none');
});

$('#settings_nav').on('click', () => {
    $('#dashboard').css('display','none');
    $('#vehicle_management').css('display','none');
    $('#equipment_management').css('display','none');
});
