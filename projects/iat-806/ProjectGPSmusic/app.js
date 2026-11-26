let places = [];
let placeLat = 0;
let placeLng = 0;
let choosingPlace = false;
let markers = [];
let searchMarker = null;
let map = L.map("map").setView([46.15, -61.1], 7);
let noteIcon = L.divIcon({
  className: "note-marker-icon",
  html: '<span class="note-marker"><span>♫</span></span>',
  iconSize: [38, 38],
  iconAnchor: [19, 19],
});

let savedPlaces = localStorage.getItem("songgroundsPlaces");
if (savedPlaces) {
  places = JSON.parse(savedPlaces);

  for (let place of places) {
    if (place.lat === undefined) {
      place.lat = 47.05 - (place.y / 100) * (47.05 - 43.35);
      place.lng = -66.5 + (place.x / 100) * (-59.4 + 66.5);
    }
  }
}

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

map.on("click", function (event) {
  if (!choosingPlace) return;

  placeLat = event.latlng.lat;
  placeLng = event.latlng.lng;
  choosingPlace = false;
  document.getElementById("tagging-banner").hidden = true;
  document.getElementById("tag-dialog").showModal();
});

drawMarkers();

document.getElementById("tag-button").addEventListener("click", function () {
  choosingPlace = true;
  document.getElementById("tagging-banner").hidden = false;
});

document.getElementById("place-search-form").addEventListener("submit", function (event) {
  event.preventDefault();

  let placeName = document.getElementById("place-search").value.trim();
  if (!placeName) {
    document.getElementById("map-status").textContent =
      "Type a place name to search.";
    return;
  }

  let searchButton = document.getElementById("search-button");
  searchButton.disabled = true;
  document.getElementById("map-status").textContent = "Searching...";

  let searchUrl =
    "https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1" +
    "&viewbox=-66.5,47.05,-59.4,43.35&bounded=1&q=" +
    encodeURIComponent(placeName + ", Nova Scotia, Canada");

  fetch(searchUrl)
    .then(function (response) {
      if (!response.ok) {
        throw new Error("The place search did not work.");
      }
      return response.json();
    })
    .then(function (results) {
      if (results.length === 0) {
        document.getElementById("map-status").textContent =
          "No matching place found in Nova Scotia.";
        return;
      }

      let location = [parseFloat(results[0].lat), parseFloat(results[0].lon)];
      map.setView(location, 12);

      if (searchMarker) {
        map.removeLayer(searchMarker);
      }
      searchMarker = L.marker(location).addTo(map);
      document.getElementById("map-status").textContent =
        "Found: " + placeName;
    })
    .catch(function (error) {
      document.getElementById("map-status").textContent =
        "Search failed. Check your connection and try again.";
      console.error(error);
    })
    .then(function () {
      setTimeout(function () {
        searchButton.disabled = false;
      }, 1000);
    });
});

document.getElementById("tag-form").addEventListener("submit", function (event) {
  event.preventDefault();

  let place = {
    name: document.getElementById("tag-place").value.trim(),
    song: document.getElementById("tag-song").value.trim(),
    url: document.getElementById("tag-url").value.trim(),
    story: document.getElementById("tag-story").value.trim(),
    lat: placeLat,
    lng: placeLng,
  };

  places.push(place);
  localStorage.setItem("songgroundsPlaces", JSON.stringify(places));
  document.getElementById("tag-dialog").close();
  document.getElementById("tag-form").reset();
  drawMarkers();
  showPlace(place);
});

document.getElementById("close-tag-dialog").addEventListener("click", function () {
  document.getElementById("tag-dialog").close();
});

document.getElementById("close-card").addEventListener("click", function () {
  document.getElementById("place-card").hidden = true;
  document.getElementById("empty-state").hidden = false;
});

function drawMarkers() {
  for (let marker of markers) {
    map.removeLayer(marker);
  }
  markers = [];

  for (let place of places) {
    let marker = L.marker([place.lat, place.lng], {
      icon: noteIcon,
      title: place.name + " — " + place.song + "\n\n" + place.story,
    });
    marker.on("click", function () {
      showPlace(place);
    });
    marker.addTo(map);
    markers.push(marker);
  }
}

function showPlace(place) {
  document.getElementById("empty-state").hidden = true;
  document.getElementById("place-card").hidden = false;
  document.getElementById("place-name").textContent = place.name;
  document.getElementById("song-title").textContent = place.song;
  document.getElementById("place-story").textContent = place.story;

  let songLink = document.getElementById("song-link");
  songLink.href = place.url || "#";
  songLink.hidden = !place.url;
}
