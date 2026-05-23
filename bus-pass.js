document.addEventListener("DOMContentLoaded", function () {
    fetch("http://localhost:5000/bus-pass?user_id=1") // Change user_id dynamically
        .then(response => response.json())
        .then(data => {
            const passContainer = document.getElementById("bus-pass-container");
            if (data) {
                passContainer.innerHTML = `
                    <div class="bus-pass-card">
                        <h2>Bus Pass</h2>
                        <p><strong>Name:</strong> ${data.name}</p>
                        <p><strong>Bus Number:</strong> ${data.bus_number}</p>
                        <p><strong>Valid Till:</strong> ${data.expiry_date}</p>
                    </div>
                `;
            } else {
                passContainer.innerHTML = "<p>No bus pass found.</p>";
            }
        })
        .catch(error => console.error("Error fetching bus pass:", error));
});
