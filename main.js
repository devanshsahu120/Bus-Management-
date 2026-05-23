// ==================== Global Variables ====================
let user = JSON.parse(localStorage.getItem("user")) || null; // Load user data from localStorage

// ==================== Profile Dropdown ====================
function toggleProfileDropdown() {
  const profileDropdown = document.getElementById("profile-dropdown");
  if (profileDropdown.style.display === "block") {
    profileDropdown.style.display = "none"; // Hide dropdown
  } else {
    profileDropdown.style.display = "block"; // Show dropdown
    updateProfileContent(); // Update content dynamically
  }
}

// Close the dropdown if clicked outside
window.onclick = function (event) {
  const profileDropdown = document.getElementById("profile-dropdown");
  const profileIcon = document.querySelector(".profile-icon");
  if (event.target !== profileIcon && !profileIcon.contains(event.target)) {
    profileDropdown.style.display = "none"; // Hide dropdown
  }
};

// Function to update profile content
function updateProfileContent() {
  const profileContent = document.getElementById("profile-content");
  if (user) {
    // User is logged in, display profile details
    profileContent.innerHTML = `
      <p><strong>Name:</strong> ${user.name}</p>
      <p><strong>SAP ID:</strong> ${user.sapId}</p>
      <p><strong>Bus Number:</strong> ${user.busNumber}</p>
      <p><strong>Bus Stop:</strong> ${user.busStop}</p>
      <p><strong>Bus Stop Timing:</strong> ${user.busStopTiming}</p>
      <a href="login.html" onclick="logout()">Logout</a>
    `;
  } else {
    // No user is logged in, display login prompt
    profileContent.innerHTML = `
      <p>Please <a href="login.html">login</a> to view your profile.</p>
    `;
  }
}

// Function to simulate logout
function logout() {
  localStorage.removeItem("user");
  user = null; // Clear user data
  alert("Logged out successfully!");
  window.location.href = "index.html";
}

// ==================== Bus Schedule Table ====================
if (document.querySelector(".schedule-table")) {
  const busSchedule = [
    {
      busNumber: "101",
      driverName: "Ramesh Kumar",
      driverPhone: "+91 98765 43210",
      stops: [
        { name: "Vijay Nagar Square", timing: "7:00 AM" },
        { name: "Palasia Square", timing: "7:20 AM" },
        { name: "Rajwada", timing: "7:40 AM" },
        { name: "Geeta Bhawan", timing: "8:00 AM" },
        { name: "College", timing: "8:30 AM" }
      ]
    },
    {
      busNumber: "102",
      driverName: "Suresh Sharma",
      driverPhone: "+91 98765 12345",
      stops: [
        { name: "Airport Road", timing: "7:00 AM" },
        { name: "Super Corridor", timing: "7:25 AM" },
        { name: "Bypass Road", timing: "7:50 AM" },
        { name: "Rau Circle", timing: "8:15 AM" },
        { name: "College", timing: "8:45 AM" }
      ]
    },
    {
      busNumber: "103",
      driverName: "Anil Patel",
      driverPhone: "+91 98765 67890",
      stops: [
        { name: "Sapna Sangeeta", timing: "7:00 AM" },
        { name: "Tower Square", timing: "7:30 AM" },
        { name: "56 Dukan", timing: "7:55 AM" },
        { name: "Navlakha", timing: "8:20 AM" },
        { name: "College", timing: "8:50 AM" }
      ]
    }
  ];

  // Function to populate the schedule table
  function populateScheduleTable() {
    const tbody = document.querySelector(".schedule-table tbody");
    busSchedule.forEach((bus) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${bus.busNumber}</td>
        <td>${bus.driverName}</td>
        <td>${bus.driverPhone}</td>
        <td>
          <ul>
            ${bus.stops.map(stop => `<li>${stop.name} - ${stop.timing}</li>`).join("")}
          </ul>
        </td>
      `;
      tbody.appendChild(row);
    });
  }

  // Call the function to populate the table
  populateScheduleTable();
}

// ==================== Bus Pass Registration Form ====================
if (document.getElementById("bus-pass-form")) {
  const busPassForm = document.getElementById("bus-pass-form");

  busPassForm.addEventListener("submit", (e) => {
    e.preventDefault();

    // Get form data
    const sapId = document.getElementById("sap-id").value;
    const name = document.getElementById("name").value;
    const year = document.getElementById("year").value;
    const photo = document.getElementById("photo").files[0];

    // Validate form data
    if (!sapId || !name || !year || !photo) {
      alert("Please fill out all fields.");
      return;
    }

    // Create a FormData object
    const formData = new FormData();
    formData.append("sap-id", sapId);
    formData.append("name", name);
    formData.append("year", year);
    formData.append("photo", photo);

    // Simulate form submission (replace with actual API call)
    console.log("Form Data:", {
      sapId,
      name,
      year,
      photo: photo.name,
    });

    // Show success pop-up
    showPopup();

    // Reset the form
    busPassForm.reset();
  });

  // Function to show the pop-up
  function showPopup() {
    const popup = document.getElementById("popup");
    const overlay = document.getElementById("overlay");
    popup.style.display = "block";
    overlay.style.display = "block";
  }

  // Function to close the pop-up
  function closePopup() {
    const popup = document.getElementById("popup");
    const overlay = document.getElementById("overlay");
    popup.style.display = "none";
    overlay.style.display = "none";
  }
}

// ==================== Login Form with Human Verification ====================
if (document.getElementById("login-form")) {
  const loginForm = document.getElementById("login-form");

  // Generate a random math question for human verification
  const verificationQuestion = document.getElementById("verification-question");
  let num1 = Math.floor(Math.random() * 10);
  let num2 = Math.floor(Math.random() * 10);
  let correctAnswer = num1 + num2;
  verificationQuestion.textContent = `What is ${num1} + ${num2}?`;

  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();

    // Get form data
    const sapId = document.getElementById("sap-id").value;
    const password = document.getElementById("password").value;
    const verificationAnswer = document.getElementById("verification-answer").value;

    // Validate human verification
    if (parseInt(verificationAnswer) !== correctAnswer) {
      alert("Human verification failed. Please try again.");
      // Generate a new math question
      num1 = Math.floor(Math.random() * 10);
      num2 = Math.floor(Math.random() * 10);
      correctAnswer = num1 + num2;
      verificationQuestion.textContent = `What is ${num1} + ${num2}?`;
      return;
    }

    // Validate login credentials (mock validation for now)
    if (sapId === "12345" && password === "12345") {
      alert("Login successful!");
      user = {
        name: "Devansh Sahu",
        sapId: "12345",
        busNumber: "101",
        busStop: "Vijay Nagar Square",
        busStopTiming: "7:15 AM"
      };
      localStorage.setItem("user", JSON.stringify(user));
      window.location.href = "index.html"; // Redirect to home page
    } else {
      alert("Invalid SAP ID or password. Please try again.");
    }

    // Reset the form
    loginForm.reset();
  });
}

// Initialize profile content on page load
if (document.getElementById("profile-content")) {
  updateProfileContent();
}