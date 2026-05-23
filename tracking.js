document.addEventListener("DOMContentLoaded", function () {
  const map = L.map("map").setView([22.7196, 75.8577], 13);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors"
  }).addTo(map);

  let busMarkers = {};

  function fetchBusLocations() {
      fetch("http://localhost:5000/buses")
          .then(response => response.json())
          .then(data => {
              data.forEach(bus => {
                  const { id, latitude, longitude, bus_number } = bus;

                  if (busMarkers[id]) {
                      busMarkers[id].setLatLng([latitude, longitude]);
                  } else {
                      busMarkers[id] = L.marker([latitude, longitude])
                          .addTo(map)
                          .bindPopup(`Bus ${bus_number}`);
                  }
              });
          })
          .catch(error => console.error("Error fetching buses:", error));
  }

  setInterval(fetchBusLocations, 5000);
});
