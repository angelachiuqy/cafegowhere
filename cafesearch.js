// these variables are used to store currently selected region/district. Initially set to null
let selectedRegion = null;
let selectedDistrict = null;

// Logs user out when the logout button is pressed
document.getElementById('logout').addEventListener('click', function() {
    logout();
});

// Check if the user is logged in and display the welcome message
document.addEventListener('DOMContentLoaded', function() {
    const userName = localStorage.getItem('userName');
    const welcomeMessage = document.getElementById('welcomeMessage');
    // If not logged in, prompt user to log in
    if (!userName) {
        const confirmation = confirm('Please log into your account.');
        if (confirmation) {
            // Redirect the user to the login page
            window.location.href = './index.html';
        }
    // If logged in, display a welcome message
    } else {
        welcomeMessage.innerText = `Welcome, ${userName}!`;
    }
});
// Coordinates of the five regions
const regionBounds = {
    North: {
        north: 1.4704,
        south: 1.4180,
        west: 103.7982,
        east: 103.8514
    },
    Northeast: {
        north: 1.4177,
        south: 1.3554,
        west: 103.8760,
        east: 103.9645
    },
    East: {
        north: 1.3570,
        south: 1.3067,
        west: 103.8916,
        east: 104.0075
    },
    Central: {
        north: 1.3341,
        south: 1.2605,
        west: 103.8098,
        east: 103.8741
    },
    West: {
        north: 1.3900,
        south: 1.2940,
        west: 103.6150,
        east: 103.7581
    }
};
// Clears previous selection, sets new region as selected, updates UI, and resets selected district and cafe suggestion
function selectRegion(region) {
    clearSelection('region', selectedRegion);
    selectedRegion = region;
    console.log('Selected Region:', selectedRegion);
    document.getElementById(`${region}Button`).classList.add('selected');
    
    // Reset selected district
    selectedDistrict = null;
    
    // Reset cafe suggestion
    resetCafeSuggestion();

    // Reset openNowCheckBox
    resetopenNowCheckBox();

    populateDistricts();
}

// Function to reset the cafe suggestion
function resetCafeSuggestion() {
    const cafeResult = document.getElementById('cafeResult');
    const cafeHopText = document.getElementById('cafeHopText');

    cafeResult.innerHTML = '';
    cafeHopText.textContent = 'Let\'s cafe-hop!';
    cafeHopText.onclick = suggestCafe;
    cafeResult.style.display = 'none';
}

function resetopenNowCheckBox() {
    const openNowCheckBox = document.getElementById('openNowCheckBox');
    openNowCheckBox.checked = false;
}

// Returns lat and lng bounds for given region
function getRegionLatLng(region) {
    return regionBounds[region];
}
// Populate district dropdown based on selected region
function populateDistricts() {
    const districtSelect = document.getElementById('districtSelect');

    const districts = getDistricts(selectedRegion);
    populateOptions(districts);
}
// Returns an array of districts for given region
function getDistricts(region) {
    let districts = [];

    if (region === 'north') {
        districts = ['Admiralty', 'Canberra','Kranji', 'Lentor', 'Marsiling', 'Sembawang', 'Woodlands', 'Yishun']
    } else if (region === 'northeast') {
        districts = ['Ang Mo Kio', 'Bartley', 'Buangkok', 'Hougang', 'Khatib', 'Lorong Chuan', 'Punggol', 'Sengkang', 'Serangoon', 'Yio Chu Kang']
    } else if (region === 'east') {
        districts = ['Bedok', 'Changi', 'Eunos', 'Joo Chiat', 'Kaki Bukit', 'Kembangan', 'Macpherson', 'Pasir Ris', 'Paya Lebar', 'Simei', 'Tai Seng', 'Tampines', 'Tanah Merah', 'Ubi']
    } else if (region === 'central') {
        districts = ['Bayfront', 'Bishan', 'Bugis', 'Bukit Timah', 'Chinatown', 'City Hall', 'Clarke Quay', 'Dhoby Ghaut', 'Farrer Park', 'Harbourfront', 'Kallang', 'Lavender', 'Little India', 'Marina Bay', 'Newton', 'Novena', 'Outram Park', 'Orchard', 'Potong Pasir', 'Promenade', 'Queenstown', 'Raffles Place', 'Redhill', 'Somerset', 'Tanjong Pagar', 'Tiong Bahru', 'Toa Payoh']
    } else if (region === 'west') {
        districts = ['Beauty World', 'Boon Lay', 'Bukit Batok', 'Bukit Gombak', 'Bukit Panjang', 'Buona Vista', 'Chinese Garden', 'Choa Chu Kang', 'Clementi', 'Dover', 'Holland Village', 'Joo Koon', 'Jurong East', 'Jurong West', 'Lakeside', 'Pioneer', 'Yew Tee']
    }

    return districts;
}
// Populates district dropdown with provided options
function populateOptions(options) {
    const districtSelect = document.getElementById('districtSelect');
    districtSelect.innerHTML = '<option value="" disabled selected>Select District</option>';
    options.forEach(option => {
        const optionElement = document.createElement('option');
        optionElement.value = option;
        optionElement.text = option;
        districtSelect.appendChild(optionElement);
    });
}

// Updates selected district, shows/hides cafe-hop button, and resets cafe suggestion
function selectDistrict(district) {
    selectedDistrict = district;
    console.log('Selected District:', selectedDistrict);
    
    // Reset cafe suggestion
    resetCafeSuggestion();

    // Reset openNowCheckBox
    resetopenNowCheckBox();

    const cafeHopButton = document.getElementById('cafeHopButton');
    if (selectedRegion && selectedDistrict) {
        cafeHopButton.style.display = 'block';
    } else {
        cafeHopButton.style.display = 'none';
    }
}

// Clears selection of specified type
function clearSelection(type, selected) {
    if (selected) {
        document.getElementById(`${selected}Button`).classList.remove('selected');
    }
}

// Generates a request object from the Places API based on user preferences
function generateRequest() {
    const openNowCheckbox = document.getElementById('openNowCheckBox');
    const request = {
        bounds: getRegionLatLng(selectedRegion),
        region: 'sg', 
        type: ['cafe'],
        query: `cafe in ${selectedDistrict} Singapore`,
    };

    // Check if the 'Open Now' checkbox is checked
    if (openNowCheckBox.checked) {
        request.openNow = true; // Add the 'openNow' filter to the request
    }

    return request;
}

// Calls API with generated request and handles response
function suggestCafe() {
    if (!selectedRegion || !selectedDistrict) {
        alert('Please select a region and district.');
        return;
    }

    const cafeResult = document.getElementById('cafeResult');
    cafeResult.innerHTML = '';
    // Creates a new instance of the Google Maps PlacesService
    const service = new google.maps.places.PlacesService(document.createElement('div'));
    const request = generateRequest();
    // Uses the textSearch method of the PlacesService to send the request and specifies a callback function (handlePlacesResponse) to handle the API response
    service.textSearch(request, handlePlacesResponse);
}

// Processes API response, filters and displays suitable cafes, and provides link to Google Maps
function handlePlacesResponse(results,status) {
    console.log('Original search results:', results);
    const cafeResult = document.getElementById('cafeResult');
    const cafeHopText = document.getElementById('cafeHopText');

    if (status === google.maps.places.PlacesServiceStatus.OK && results.length > 0) {
        const minRating = 4.0; // Minimum rating you want to filter by

        const filteredResults = results.filter(place => {
            const name = place.name.toLowerCase();
            // Check if the place meets certain criteria
            const types = place.types
            // Check if the rating of the place is greater than or equal to minRating
            // Check if the name does not contain specific keywords related to food establishments
            return place.rating >= minRating && /^(?!.*\bcoffee\s*shop\b)(?!.*\bkopitiam\b)(?!.*\bfood\s*stall\b)(?!.*\bfood\s*centre\b)(?!.*\beating\s*house\b).*$/i.test(name) && (!!types ? types.every(type => type !== 'store') : true);
        });

        if (filteredResults.length > 0) {
            console.log('Filtered search results:', filteredResults);
            const randomIndex = Math.floor(Math.random() * filteredResults.length);
            const suggestedCafe = filteredResults[randomIndex];
            const cafeName = suggestedCafe.name;
            const placeId = suggestedCafe.place_id;

            // Use placeId to construct the Google Maps link
            const mapsLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(cafeName)}&query_place_id=${placeId}`;
            const cafeNamewithLink = `<a href="${mapsLink}" target="_blank">${cafeName}</a>`;

            cafeResult.innerHTML = `How about trying out <strong>${cafeNamewithLink}</strong>?\n \nEnjoy your cafe-hopping!`;
            cafeHopText.textContent = 'Suggest me another cafe.';
            cafeHopText.onclick = suggestCafe;
        } else {
            cafeResult.textContent = 'No suitable cafes found.';
            cafeHopText.textContent = 'Try again.';
            cafeHopText.onclick = suggestCafe;
        }
    } else {
        cafeResult.textContent = 'No cafes found. Please select another region or district.';
        cafeHopText.textContent = 'Try again.';
        cafeHopText.onclick = suggestCafe;
    }
    cafeResult.style.display = 'block';
}

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
