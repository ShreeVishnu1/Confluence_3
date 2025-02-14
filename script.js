function register() {
    const username = document.getElementById("register-username");
    const password = document.getElementById("register-password");

    if (!username || !password) {
        console.error("Register inputs not found.");
        return;
    }

    fetch('/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.value, password: password.value })
    })
    .then(response => response.json()) // Ensure response is parsed as JSON
    .then(data => {
        if (data.success) {
            alert("Registration successful! You can now log in.");
window.location.href = "/index.html";  


        } else {
            alert(data.message);
        }
    })
    .catch(error => console.error("Error during registration:", error));
}




function login() {
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');

    if (!usernameInput || !passwordInput) {
        console.error("Login inputs not found.");
        return;
    }

    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    if (!username || !password) {
        alert("Please enter both username and password.");
        return;
    }

    fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            localStorage.setItem("username", username);  // ✅ Store username in localStorage
            alert("Login successful!");
            window.location.href = 'dashboard.html';
        } else {
            alert("Invalid credentials.");
        }
    })
    .catch(error => {
        console.error("Error during login:", error);
        alert("An error occurred. Please try again.");
    });
}


async function bookSlot() {
    const username = localStorage.getItem("username");
    const doctor = document.getElementById("doctor").value;
    const time = document.getElementById("time").value;

    const response = await fetch("/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, doctor, time })
    });

    if (response.ok) {
        alert("Slot booked successfully!");
        loadBookings();
    } else {
        alert("Failed to book slot.");
    }
}

async function loadBookings() {
    const username = localStorage.getItem("username");

    const response = await fetch(`/bookings?username=${username}`);
    const bookings = await response.json();

    const bookingBody = document.getElementById("booking-body");
    bookingBody.innerHTML = ""; 

    bookings.forEach(booking => {
        const [date, time] = booking.time.split("T"); // Split date and time
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${booking.doctor}</td>
            <td>${date}</td>
            <td>${time}</td>
        `;

        bookingBody.appendChild(row);
    });
}

function logout() {
    localStorage.removeItem("username");
    window.location.href = "/";
}
