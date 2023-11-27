// Mock user data for testing in a development environment
const users = [
    { email: 'user1@example.com', password: 'P@ssw0rd1', name: 'User One' },
    { email: 'user2@example.com', password: 'P@ssw0rd2', name: 'User Two' },
    // Add more users as needed...
];

document.addEventListener('DOMContentLoaded', function() {
    // Get the email and password input fields
    const emailInput = document.getElementById('Email');
    const passwordInput = document.getElementById('Password');

    // Add keyup event listeners to both input fields
    emailInput.addEventListener('keyup', function(event) {
        if (event.key === 'Enter') {
            // Prevent the default form submission behavior
            event.preventDefault();
            // Focus on the password field
            passwordInput.focus();
        }
    });

    passwordInput.addEventListener('keyup', function(event) {
        if (event.key === 'Enter') {
            // Call the login function
            loginHandler();
        }
    });
});

// Retrieves values from the email and password input fields
function loginHandler() {
    const emailInput = document.getElementById('Email');
    const passwordInput = document.getElementById('Password');

    const userEmail = emailInput.value;
    let userPassword = passwordInput.value;

    // Call the login function with provided email and password
    login(userEmail, userPassword);
}

function getUserDetailsByEmail(email) {
    // Mock function to retrieve user details by email. Uses 'Array.find' to find a user with matching email.
    return users.find(user => user.email === email);
}

function login(email, password) {
    // Check if the provided email exists in the user database
    // If the credentials match, fetch the user's name
    const user = getUserDetailsByEmail(email);
    if (user && user.password === password) {
        // Store the user's name in localStorage
        localStorage.setItem('userName', user.name);
        // Redirect to the cafe search page
        window.location.href = './cafesearch.html';
    } else {
            alert('Incorrect email or/and password');
    }
}