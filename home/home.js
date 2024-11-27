const logout = document.querySelector('#logout');

logout.addEventListener('click', () => {
    window.location.href = '../index.html';
});

function updateTime() {
    document.getElementById('time').value = new Date().toLocaleDateString() + "   " + new Date().toLocaleTimeString();
}

setInterval(updateTime, 1000);

updateTime();
