fetch('/schedule-data')
  .then(res => res.json())
  .then(data => {
    const tbody = document.getElementById('scheduleBody');
    data.forEach(item => {
      const row = document.createElement('tr');

      // Bus Number
      const busNumber = document.createElement('td');
      busNumber.textContent = item["Bus Number"];
      row.appendChild(busNumber);

      // Driver Name
      const driverName = document.createElement('td');
      driverName.textContent = item["Driver Name"];
      row.appendChild(driverName);

      // Driver Phone
      const driverPhone = document.createElement('td');
      driverPhone.textContent = item["Driver Phone"];
      row.appendChild(driverPhone);

      // Stops & Timings
      const stops = document.createElement('td');
      const stopList = document.createElement('ul');
      const stopsArray = item["Stops & Timings"]?.split(', ') || [];
      stopsArray.forEach(stop => {
        const li = document.createElement('li');
        li.textContent = stop;
        stopList.appendChild(li);
      });
      stops.appendChild(stopList);
      row.appendChild(stops);

      tbody.appendChild(row);
    });
  });
