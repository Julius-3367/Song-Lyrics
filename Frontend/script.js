const form = document.getElementById("form");
const search = document.getElementById("search");
const result = document.getElementById("result");
const savedLyricsList = document.getElementById("saved-lyrics-list");
const backBtn = document.getElementById("backBtn");

// API URL
const apiURL = "https://api.lyrics.ovh";
const serverURL = "http://localhost:5000"; // Your server URL

// History array to keep track of visited pages
let history = [];

// Event listener for form submission
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const searchValue = search.value.trim();

  if (!searchValue) {
    alert("Please enter an artist name or song title to search!");
  } else {
    searchSong(searchValue);
  }
});

// Search song
async function searchSong(searchValue, page = 1) {
  try {
    showSpinner();
    const searchResult = await fetch(`${apiURL}/suggest/${searchValue}?page=${page}`);
    const data = await searchResult.json();
    showData(data, searchValue, page);
  } catch (error) {
    showError("Something went wrong. Please try again later.");
  } finally {
    hideSpinner();
  }
}

// Display search results
function showData(data, searchValue, page) {
  if (data && data.data && data.data.length > 0) {
    result.innerHTML = `
      <ul class="song-list">
        ${data.data.map((song) => `
          <li>
            <div>
              <img src="${song.artist.picture}" alt="${song.artist.name}" />
              <strong>${song.artist.name}</strong> - ${song.title}
            </div>
            <span class="get-lyrics btn"
                  data-artist="${song.artist.name}"
                  data-songtitle="${song.title}">Get Lyrics</span>
            <button class="save-lyrics btn"
                    data-artist="${song.artist.name}"
                    data-songtitle="${song.title}">Save Lyrics</button>
          </li>
        `).join('')}
      </ul>
      <div class="pagination">
        ${data.prev ? `<button class="btn page-btn" data-page="${data.prev}">Prev</button>` : ''}
        ${data.next ? `<button class="btn page-btn" data-page="${data.next}">Next</button>` : ''}
      </div>
    `;

    // Save current page to history
    history.push({ searchValue, page });

    // Show the back button if there is history
    backBtn.style.display = history.length > 1 ? "block" : "none";
  } else {
    showError("No songs found. Please try a different search term.");
  }
}

// Event listener for lyrics, save, and pagination buttons
result.addEventListener("click", async (e) => {
  const clickedElement = e.target;

  if (clickedElement.classList.contains("get-lyrics")) {
    const artist = clickedElement.getAttribute("data-artist");
    const songTitle = clickedElement.getAttribute("data-songtitle");
    getLyrics(artist, songTitle);
  } else if (clickedElement.classList.contains("save-lyrics")) {
    const artist = clickedElement.getAttribute("data-artist");
    const songTitle = clickedElement.getAttribute("data-songtitle");
    saveLyrics(artist, songTitle);
  } else if (clickedElement.classList.contains("page-btn")) {
    const page = clickedElement.getAttribute("data-page");
    searchSong(search.value.trim(), page);
  }
});

// Get lyrics
async function getLyrics(artist, songTitle) {
  try {
    showSpinner();
    const res = await fetch(`${apiURL}/v1/${artist}/${songTitle}`);
    const data = await res.json();

    if (data.error) {
      showError(data.error);
    } else {
      const lyrics = data.lyrics.replace(/(\r\n|\r|\n)/g, "<br>");
      result.innerHTML = `
        <h2>${artist} - ${songTitle}</h2>
        <p>${lyrics}</p>
        <button class="btn save-lyrics"
                data-artist="${artist}"
                data-songtitle="${songTitle}">Save Lyrics</button>
      `;
      history.push({ type: 'lyrics', artist, songTitle });
      backBtn.style.display = "block"; // Show back button
    }
  } catch (error) {
    showError("Something went wrong. Please try again later.");
  } finally {
    hideSpinner();
  }
}

// Function to display saved lyrics from the server
async function displaySavedLyrics() {
  try {
    const res = await fetch(`${serverURL}/saved-lyrics`);
    const savedLyrics = await res.json();

    if (savedLyrics.length > 0) {
      savedLyricsList.innerHTML = savedLyrics.map((lyric) => `
        <li>
          <span>${lyric.artist} - ${lyric.songTitle} <br><small>${new Date(lyric.savedAt).toLocaleString()}</small></span>
          <button class="view-lyrics btn"
                  data-id="${lyric._id}">View</button>
          <button class="delete-lyrics btn"
                  data-id="${lyric._id}">Delete</button>
        </li>
      `).join('');
    } else {
      savedLyricsList.innerHTML = "<p>No saved lyrics found.</p>";
    }
  } catch (error) {
    showError("Unable to fetch saved lyrics. Please try again later.");
  }
}

// Function to save lyrics to server
async function saveLyrics(artist, songTitle) {
  try {
    const res = await fetch(`${serverURL}/save-lyrics`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ artist, songTitle })
    });

    const data = await res.json();

    if (res.status === 201) {
      displaySavedLyrics();
      alert("Lyrics saved successfully!");
    } else {
      alert(data.message);
    }
  } catch (error) {
    showError("Unable to save lyrics. Please try again later.");
  }
}

// Function to delete saved lyrics from server
savedLyricsList.addEventListener("click", async (e) => {
  const clickedElement = e.target;

  if (clickedElement.classList.contains("delete-lyrics")) {
    const id = clickedElement.getAttribute("data-id");

    try {
      const res = await fetch(`${serverURL}/delete-lyrics/${id}`, {
        method: "DELETE"
      });

      if (res.status === 200) {
        displaySavedLyrics();
      } else {
        showError("Unable to delete lyrics. Please try again later.");
      }
    } catch (error) {
      showError("Unable to delete lyrics. Please try again later.");
    }
  } else if (clickedElement.classList.contains("view-lyrics")) {
    const id = clickedElement.getAttribute("data-id");
    viewLyrics(id);
  }
});

// Function to view saved lyrics from server
async function viewLyrics(id) {
  try {
    showSpinner();
    const res = await fetch(`${serverURL}/saved-lyrics/${id}`);
    const data = await res.json();

    if (data.error) {
      showError(data.error);
    } else {
      const lyrics = data.lyrics.replace(/(\r\n|\r|\n)/g, "<br>");
      result.innerHTML = `
        <h2>${data.artist} - ${data.songTitle}</h2>
        <p>${lyrics}</p>
        <button class="btn save-lyrics"
                data-artist="${data.artist}"
                data-songtitle="${data.songTitle}">Save Lyrics</button>
      `;
      history.push({ type: 'lyrics', artist: data.artist, songTitle: data.songTitle });
      backBtn.style.display = "block"; // Show back button
    }
  } catch (error) {
    showError("Unable to view lyrics. Please try again later.");
  } finally {
    hideSpinner();
  }
}

// Event listener for back button
backBtn.addEventListener("click", () => {
  // Remove the current page from history
  history.pop();
  const lastPage = history[history.length - 1];

  if (lastPage) {
    if (lastPage.type === 'lyrics') {
      viewLyrics(lastPage.id);
    } else {
      searchSong(lastPage.searchValue, lastPage.page);
    }
  } else {
    // Reset to initial state
    result.innerHTML = '';
    backBtn.style.display = 'none';
  }
});

// Function to show spinner
function showSpinner() {
  result.innerHTML = '<div class="spinner"></div>';
}

// Function to hide spinner
function hideSpinner() {
  const spinner = document.querySelector(".spinner");
  if (spinner) {
    spinner.remove();
  }
}

// Function to show error message
function showError(message) {
  result.innerHTML = `<p class="error">${message}</p>`;
}

// Display saved lyrics on page load
displaySavedLyrics();