document.addEventListener('DOMContentLoaded', () => {
    fetchEntries();
  
    document.getElementById('entryForm').addEventListener('submit', function(event) {
      event.preventDefault();
      const entryId = this.dataset.id;
      if (entryId) {
        updateEntry(entryId);
      } else {
        addEntry();
      }
    });
  });
  
  async function fetchEntries() {
    const response = await fetch('/api/journal-entries');
    const entries = await response.json();
    displayEntries(entries);
  }
  
  async function addEntry() {
    const title = document.getElementById('entryTitle').value;
    const location = document.getElementById('entryLocation').value;
    const date = document.getElementById('entryDate').value;
    const description = document.getElementById('entryDescription').value;
    const photos = document.getElementById('entryPhotos').value.split(',').map(photo => photo.trim());
    const mapLocation = document.getElementById('entryMapLocation').value;
  
    const response = await fetch('/api/journal-entries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, location, date, description, photos, mapLocation })
    });
  
    const newEntry = await response.json();
    displayEntry(newEntry);
  
    document.getElementById('entryForm').reset();
  }
  
  async function updateEntry(id) {
    const title = document.getElementById('entryTitle').value;
    const location = document.getElementById('entryLocation').value;
    const date = document.getElementById('entryDate').value;
    const description = document.getElementById('entryDescription').value;
    const photos = document.getElementById('entryPhotos').value.split(',').map(photo => photo.trim());
    const mapLocation = document.getElementById('entryMapLocation').value;
  
    const response = await fetch(`/api/journal-entries/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, location, date, description, photos, mapLocation })
    });
  
    const updatedEntry = await response.json();
    fetchEntries();
  
    document.getElementById('entryForm').reset();
    document.getElementById('entryForm').removeAttribute('data-id');
  }
  
  function displayEntries(entries) {
    const entryList = document.getElementById('entryList');
    entryList.innerHTML = '';
    entries.forEach(displayEntry);
  }
  
  function displayEntry(entry) {
    const entryList = document.getElementById('entryList');
    const entryElement = document.createElement('li');
    entryElement.className = 'list-group-item';
    entryElement.innerHTML = `
      <div class="d-flex justify-content-between">
        <div>
          <h5>${entry.title}</h5>
          <p>Location: ${entry.location}</p>
          <p>Date: ${new Date(entry.date).toLocaleDateString()}</p>
          <p>Description: ${entry.description}</p>
          <p>Photos: ${entry.photos.map(photo => `<img src="${photo}" alt="photo" class="img-thumbnail" style="max-width: 100px;">`).join(' ')}</p>
          <p>Map Location: <a href="https://www.google.com/maps/search/?api=1&query=${entry.mapLocation}" target="_blank">${entry.mapLocation}</a></p>
        </div>
        <div>
          <button class="btn btn-warning btn-sm mr-2" onclick="editEntry('${entry._id}')">Edit</button>
          <button class="btn btn-danger btn-sm" onclick="deleteEntry('${entry._id}')">Delete</button>
        </div>
      </div>
    `;
    entryList.appendChild(entryElement);
  }
  
  async function deleteEntry(id) {
    await fetch(`/api/journal-entries/${id}`, { method: 'DELETE' });
    fetchEntries();
  }
  
  function editEntry(id) {
    const entryElement = document.querySelector(`#entryList .list-group-item [onclick="editEntry('${id}')"]`).parentElement.parentElement;
    const title = entryElement.querySelector('h5').textContent;
    const location = entryElement.querySelector('p:nth-child(2)').textContent.split(': ')[1];
    const date = new Date(entryElement.querySelector('p:nth-child(3)').textContent.split(': ')[1]).toISOString().substr(0, 10);
    const description = entryElement.querySelector('p:nth-child(4)').textContent.split(': ')[1];
    const photos = Array.from(entryElement.querySelectorAll('p:nth-child(5) img')).map(img => img.src).join(', ');
    const mapLocation = entryElement.querySelector('p:nth-child(6) a').textContent;
  
    document.getElementById('entryTitle').value = title;
    document.getElementById('entryLocation').value = location;
    document.getElementById('entryDate').value = date;
    document.getElementById('entryDescription').value = description;
    document.getElementById('entryPhotos').value = photos;
    document.getElementById('entryMapLocation').value = mapLocation;
    document.getElementById('entryForm').dataset.id = id;
  }
  