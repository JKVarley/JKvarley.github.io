class SongPlace {
  constructor({ id, name, region, song, artist, url, story, lat, lng }) {
    this.id = id;
    this.name = name;
    this.region = region;
    this.song = song;
    this.artist = artist;
    this.url = url;
    this.story = story;
    this.lat = lat;
    this.lng = lng;
  }

  videoId() {
    if (!this.url) return "";
    try {
      const url = new URL(this.url);
      if (url.hostname === "youtu.be") return url.pathname.slice(1);
      return url.searchParams.get("v") || "";
    } catch (error) {
      return "";
    }
  }
}

class MapMarker {
  constructor(place, mapApp) {
    this.place = place;
    this.mapApp = mapApp;
    this.marker = null;
    this.element = null;
    this.visible = true;
    this.selected = false;
  }

  showFallback() {
    this.element = document.createElement("button");
    this.element.type = "button";
    this.element.className = "note-marker";
    this.element.title = this.place.name;
    this.element.setAttribute("aria-label", this.place.name);
    this.element.innerHTML = "<span>♫</span>";
    this.element.addEventListener("click", () => this.mapApp.selectPlace(this.place));
    const position = this.mapApp.latLngToFallbackPercent(this.place.lat, this.place.lng);
    this.element.style.left = position.x + "%";
    this.element.style.top = position.y + "%";
    this.mapApp.mapElement.appendChild(this.element);
  }

  showLeaflet() {
    const icon = L.divIcon({
      className: "note-marker-icon",
      html: '<span class="note-marker" aria-hidden="true">♫</span>',
      iconSize: [38, 38],
      iconAnchor: [19, 19],
    });
    this.marker = L.marker([this.place.lat, this.place.lng], {
      icon: icon,
      title: this.place.name,
      alt: this.place.name,
    });
    this.marker.on("click", () => this.mapApp.selectPlace(this.place));
    this.marker.on("add", () => {
      this.element = this.marker.getElement().querySelector(".note-marker");
      this.select(this.selected);
    });
    this.marker.addTo(this.mapApp.leafletMap);
  }

  remove() {
    if (this.element) this.element.remove();
    if (this.marker) this.marker.remove();
    this.element = null;
  }

  setVisible(isVisible) {
    this.visible = isVisible;
    if (this.marker) {
      if (isVisible) this.marker.addTo(this.mapApp.leafletMap);
      else this.marker.remove();
    } else if (this.element) {
      this.element.hidden = !isVisible;
    }
  }

  select(isSelected) {
    this.selected = isSelected;
    if (this.element) this.element.classList.toggle("selected", isSelected);
  }
}

class MusicMapApp {
  constructor() {
    this.storageKey = "gps-music-places";
    this.mapElement = document.getElementById("map");
    this.leafletMap = null;
    this.markers = [];
    this.taggingMode = false;
    this.selectedPlace = null;
    this.youtubePlayer = null;
    this.bounds = { north: 47.05, south: 43.35, west: -66.5, east: -59.4 };
    this.places = this.loadPlaces();
    this.bindUI();
    this.initMap();
  }

  seedPlaces() {
    return [
      new SongPlace({
        id: "inverness",
        name: "Inverness Beach",
        region: "Cape Breton",
        song: "Cape Breton Lullaby",
        artist: "Featured community recording",
        url: "",
        story: "A quiet coastal place where Cape Breton music traditions meet the Atlantic.",
        lat: 46.23, lng: -61.31,
      }),
      new SongPlace({
        id: "broad-cove",
        name: "Broad Cove",
        region: "Cape Breton",
        song: "The Mouth of the Tobique",
        artist: "Traditional",
        url: "",
        story: "Known for gathering, fiddle music, and the Broad Cove community musical tradition.",
        lat: 46.53, lng: -61.12,
      }),
      new SongPlace({
        id: "sydney",
        name: "Sydney Harbour",
        region: "Cape Breton",
        song: "Industrial Harbour",
        artist: "Community archive",
        url: "",
        story: "An industrial harbour with a rich soundscape of work, migration, and song.",
        lat: 46.14, lng: -60.18,
      }),
      new SongPlace({
        id: "halifax",
        name: "Halifax Waterfront",
        region: "Halifax",
        song: "The Halifax Seaport",
        artist: "Community archive",
        url: "",
        story: "A meeting place of ships, streets, performers, and stories arriving from many shores.",
        lat: 44.65, lng: -63.57,
      }),
      new SongPlace({
        id: "lunenburg",
        name: "Lunenburg",
        region: "South Shore",
        song: "Harbour Town",
        artist: "Community archive",
        url: "",
        story: "A colourful harbour shaped by fishing, maritime memory, and local music.",
        lat: 44.38, lng: -64.31,
      }),
      new SongPlace({
        id: "digby",
        name: "Digby Neck",
        region: "Bay of Fundy",
        song: "High Tide",
        artist: "Community archive",
        url: "",
        story: "A place where changing tides, ferry crossings, and long roads inspire local music.",
        lat: 44.62, lng: -65.76,
      }),
    ];
  }

  loadPlaces() {
    const saved = localStorage.getItem(this.storageKey);
    if (saved) {
      try {
        return JSON.parse(saved).map((place) => new SongPlace(place));
      } catch (error) {
        localStorage.removeItem(this.storageKey);
      }
    }
    return this.seedPlaces();
  }

  savePlaces() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.places));
  }

  bindUI() {
    document.getElementById("tag-button").addEventListener("click", () => this.beginTagging());
    document.getElementById("close-card").addEventListener("click", () => this.closeCard());
    document.getElementById("tag-form").addEventListener("submit", (event) => this.submitTag(event));
    document.getElementById("close-tag-dialog").addEventListener("click", () => document.getElementById("tag-dialog").close());
    document.getElementById("place-search").addEventListener("input", (event) => this.searchPlaces(event.target.value));
    document.getElementById("play-button").addEventListener("click", () => this.playSelected());
  }

  initMap() {
    if (!window.L) {
      this.initFallback();
      return;
    }

    this.mapElement.classList.remove("map-fallback");
    this.leafletMap = L.map(this.mapElement).setView([46.15, -61.1], 7);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.leafletMap);
    this.leafletMap.on("click", (event) => {
      if (this.taggingMode) this.openTagDialog(event.latlng.lat, event.latlng.lng);
    });
    document.getElementById("map-status").textContent = "OpenStreetMap";
    this.renderMarkers();
  }

  initFallback() {
    this.mapElement.className = "map map-fallback";
    this.mapElement.innerHTML = "";
    this.mapElement.onclick = (event) => {
      if (!this.taggingMode) return;
      const rect = this.mapElement.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 100;
      const y = ((event.clientY - rect.top) / rect.height) * 100;
      const lat = this.bounds.north - (y / 100) * (this.bounds.north - this.bounds.south);
      const lng = this.bounds.west + (x / 100) * (this.bounds.east - this.bounds.west);
      this.openTagDialog(lat, lng);
    };
    document.getElementById("map-status").textContent = "Illustrated map";
    this.renderMarkers();
  }

  latLngToFallbackPercent(lat, lng) {
    return {
      x: ((lng - this.bounds.west) / (this.bounds.east - this.bounds.west)) * 100,
      y: ((this.bounds.north - lat) / (this.bounds.north - this.bounds.south)) * 100,
    };
  }

  renderMarkers() {
    for (const marker of this.markers) marker.remove();
    this.markers = [];
    for (const place of this.places) {
      const marker = new MapMarker(place, this);
      this.markers.push(marker);
      if (this.leafletMap) marker.showLeaflet();
      else marker.showFallback();
    }
  }

  beginTagging() {
    this.taggingMode = true;
    document.getElementById("tagging-banner").hidden = false;
  }

  openTagDialog(lat, lng) {
    this.taggingMode = false;
    document.getElementById("tagging-banner").hidden = true;
    document.getElementById("tag-lat").value = lat.toFixed(6);
    document.getElementById("tag-lng").value = lng.toFixed(6);
    document.getElementById("tag-place").value = "";
    document.getElementById("tag-region").value = "";
    document.getElementById("tag-song").value = "";
    document.getElementById("tag-artist").value = "";
    document.getElementById("tag-url").value = "";
    document.getElementById("tag-story").value = "";
    document.getElementById("tag-dialog").showModal();
  }

  submitTag(event) {
    event.preventDefault();
    const place = new SongPlace({
      id: "place-" + Date.now(),
      name: document.getElementById("tag-place").value.trim(),
      region: document.getElementById("tag-region").value.trim(),
      song: document.getElementById("tag-song").value.trim(),
      artist: document.getElementById("tag-artist").value.trim(),
      url: document.getElementById("tag-url").value.trim(),
      story: document.getElementById("tag-story").value.trim(),
      lat: parseFloat(document.getElementById("tag-lat").value),
      lng: parseFloat(document.getElementById("tag-lng").value),
    });
    this.places.push(place);
    this.savePlaces();
    document.getElementById("tag-dialog").close();
    this.renderMarkers();
    this.selectPlace(place);
  }

  selectPlace(place) {
    this.selectedPlace = place;
    for (const marker of this.markers) marker.select(marker.place.id === place.id);
    document.getElementById("empty-state").hidden = true;
    document.getElementById("place-card").hidden = false;
    document.getElementById("place-region").textContent = place.region;
    document.getElementById("place-name").textContent = place.name;
    document.getElementById("place-story").textContent = place.story;
    document.getElementById("song-title").textContent = place.song;
    document.getElementById("song-artist").textContent = place.artist;
    const songLink = document.getElementById("song-link");
    if (place.url) {
      songLink.href = place.url;
      songLink.hidden = false;
    } else {
      songLink.hidden = true;
    }
    document.getElementById("player-wrap").hidden = true;
    document.getElementById("play-button").textContent = place.videoId() ? "▶ Play song" : "No audio link";
  }

  closeCard() {
    this.selectedPlace = null;
    document.getElementById("place-card").hidden = true;
    document.getElementById("empty-state").hidden = false;
    for (const marker of this.markers) marker.select(false);
  }

  searchPlaces(query) {
    const normalized = query.trim().toLowerCase();
    for (const marker of this.markers) {
      const matches = !normalized || (
        marker.place.name.toLowerCase().includes(normalized) ||
        marker.place.region.toLowerCase().includes(normalized) ||
        marker.place.song.toLowerCase().includes(normalized)
      );
      marker.setVisible(matches);
    }
  }

  playSelected() {
    if (!this.selectedPlace || !this.selectedPlace.videoId()) return;
    const videoId = this.selectedPlace.videoId();
    document.getElementById("player-wrap").hidden = false;
    if (!window.YT) {
      const script = document.createElement("script");
      script.src = "https://www.youtube.com/iframe_api";
      document.head.appendChild(script);
      window.onYouTubeIframeAPIReady = () => this.createYouTubePlayer(videoId);
    } else {
      this.createYouTubePlayer(videoId);
    }
  }

  createYouTubePlayer(videoId) {
    if (this.youtubePlayer) {
      this.youtubePlayer.loadVideoById(videoId);
      this.youtubePlayer.playVideo();
      return;
    }
    this.youtubePlayer = new YT.Player("youtube-player", {
      videoId,
      playerVars: { autoplay: 1, rel: 0 },
    });
  }
}

window.addEventListener("DOMContentLoaded", () => {
  window.musicMap = new MusicMapApp();
});
