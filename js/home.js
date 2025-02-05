document.getElementById('playbutton').addEventListener('click', () => {
    const username = document.getElementById('username').value;
    if(username.trim()) {
        localStorage.setItem('username', username);
        // window.location.href = "http://127.0.0.1:5500/game.html";
        window.open("./game.html", "_blank");
    } 
});