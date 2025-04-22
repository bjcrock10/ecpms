<template>
    <div>
      <input
        v-model="searchQuery"
        @input="fetchAddressSuggestions"
        placeholder="Search for an address"
        class="input"
      />
      <ul v-if="suggestions.length" class="suggestions">
        <li v-for="(suggestion, index) in suggestions" :key="index" @click="selectAddress(suggestion)">
          {{ suggestion.place_name }}
        </li>
      </ul>
  
      <div ref="mapContainer" class="map-container"></div>
    </div>
  </template>
  
  <script>
  import { ref, onMounted } from "vue";
  import mapboxgl from "mapbox-gl";
  import axios from "axios";
  
  export default {
    setup() {
      const searchQuery = ref("");
      const suggestions = ref([]);
      const mapContainer = ref(null);
      let map, marker;
  
      // Set Mapbox access token
      mapboxgl.accessToken = "pk.eyJ1IjoiYmpjcm9jazEwIiwiYSI6ImNtNXhrNTdibDBhYnQyam9ueWJmaDJ3ajYifQ.9LV1zKsB1AWBtrDaQdxCEA";
  
      // Initialize the Map
      onMounted(() => {
        map = new mapboxgl.Map({
          container: mapContainer.value,
          style: "mapbox://styles/mapbox/streets-v11",
          center: [120.9842, 14.5995], // Default: Manila
          zoom: 12,
        });
  
        // Add Click Event Listener
        map.on("click", async (e) => {
          const lng = e.lngLat.lng;
          const lat = e.lngLat.lat;
  
          // Call reverse geocoding
          await reverseGeocode(lat, lng);
        });
      });
  
      // Fetch address suggestions from Mapbox
      const fetchAddressSuggestions = async () => {
        if (searchQuery.value.length < 3) {
          suggestions.value = [];
          return;
        }
  
        try {
          const response = await axios.get(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${searchQuery.value}.json`,
            {
              params: {
                access_token: mapboxgl.accessToken,
                country: "PH",
                types: "place,address,poi",
                limit: 5,
              },
            }
          );
  
          suggestions.value = response.data.features;
        } catch (error) {
          console.error("Error fetching suggestions:", error);
        }
      };
  
      // Select an address and move the map
      const selectAddress = (suggestion) => {
        const longitude = suggestion.center[0];
        const latitude = suggestion.center[1];
        const context = suggestion.context || [];
  
        updateMap(latitude, longitude);
        const province = getValue(context, "region");
        const city = getValue(context, "place") || getValue(context, "locality");
        const district = getValue(context, "neighborhood") || "N/A";
        const barangay = getValue(context, "address") || "N/A";
        searchQuery.value = suggestion.place_name;
        suggestions.value = [];
        console.log("Selected Address:");
        console.log("Latitude:", latitude);
        console.log("Longitude:", longitude);
        console.log("Province:", province);
        console.log("City:", city);
        console.log("Barangay:", barangay);
        console.log("District:", district);
      };
  
      const reverseGeocode = async (lat, lng) => {
    try {
      const response = await axios.get(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json`,
        {
          params: {
            access_token: mapboxgl.accessToken,
            types: "place,address,poi",
          },
        }
      );
  
      if (response.data.features.length > 0) {
        const result = response.data.features[0];
  
        // Extract additional location details
        const context = result.context || [];
  
        const province = getValue(context, "region");
        const city = getValue(context, "place") || getValue(context, "locality");
        const district = getValue(context, "neighborhood") || "N/A";
        const barangay = getValue(context, "address") || "N/A";
  
        // Update search bar with full address
        searchQuery.value = result.place_name;
  
        // Log extracted details
        console.log("Clicked Location:");
        console.log("Latitude:", lat);
        console.log("Longitude:", lng);
        console.log("Province:", province);
        console.log("City:", city);
        console.log("District:", district);
        console.log("Barangay:", barangay);
  
        // Update Map & Marker
        updateMap(lat, lng);
      }
    } catch (error) {
      console.error("Error with reverse geocoding:", error);
    }
  };
      // Update Map with Marker
      const updateMap = (lat, lng) => {
        if (marker) marker.remove();
  
        marker = new mapboxgl.Marker().setLngLat([lng, lat]).addTo(map);
        map.flyTo({ center: [lng, lat], zoom: 20 });
      };
  
      const getValue = (context, type) => {
        const item = context.find((c) => c.id.startsWith(type));
        return item ? item.text : "N/A";
      };
  
      return {
        searchQuery,
        suggestions,
        fetchAddressSuggestions,
        selectAddress,
        mapContainer,
      };
    },
  };
  </script>
  
  <style scoped>
  .input {
    width: 100%;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
    margin-bottom: 5px;
  }
  .suggestions {
    list-style-type: none;
    padding: 0;
    border: 1px solid #ccc;
    background: white;
    position: absolute;
    width: 100%;
    max-height: 150px;
    overflow-y: auto;
    z-index: 100;
  }
  .suggestions li {
    padding: 8px;
    cursor: pointer;
  }
  .suggestions li:hover {
    background-color: #f0f0f0;
  }
  .map-container {
    height: 400px;
    width: 100%;
    margin-top: 10px;
  }
  </style>
  