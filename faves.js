// Function to show the Faves section
function showFaves() {
    window.location.href = './faves.html';
}

// Function to show the Explore section
function showExplore() {
    window.location.href = './cafesearch.html';
}
// Logs user out by removing 'userName' from local storage
function logout() {
    localStorage.removeItem('userName');
    // Redirect the user to the login pagen
    window.location.href = './index.html';
}

// Add event listeners to the buttons
document.getElementById("faves").addEventListener("click", showFaves);
document.getElementById("explore").addEventListener("click", showExplore);
document.getElementById("logout").addEventListener("click", logout);
