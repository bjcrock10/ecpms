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
          {{ suggestion.display_name }}
        </li>
      </ul>
      
      <l-map ref="map" v-model:zoom="zoom" :center="mapCenter" style="height: 400px; width: 100%; margin-top: 10em;">
        <l-tile-layer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="© OpenStreetMap contributors"
        />
        <l-marker :lat-lng="mapCenter" />
      </l-map>
    </div>
  </template>
  
  <script>
  import { ref } from "vue";
  import { LMap, LTileLayer, LMarker } from "@vue-leaflet/vue-leaflet";
  import axios from "axios";
  
  export default {
    components: { LMap, LTileLayer, LMarker },
    setup() {
      const searchQuery = ref("");
      const suggestions = ref([]);
      const zoom = ref(13);
      const mapCenter = ref([14.5995, 120.9842]); // Default: Manila, PH
  
      const fetchAddressSuggestions = async () => {
        if (searchQuery.value.length < 3) {
          suggestions.value = [];
          return;
        }
  
        try {
          const response = await axios.get("https://nominatim.openstreetmap.org/search", {
            params: {
              q: searchQuery.value,
              format: "json",
              addressdetails: 1,
              limit: 5,
            },
          });
  
          suggestions.value = response.data;
        } catch (error) {
          console.error("Error fetching address suggestions:", error);
        }
      };
  
      const selectAddress = (suggestion) => {
        const latitude = parseFloat(suggestion.lat);
        const longitude = parseFloat(suggestion.lon);
        // const province = getValue(context, "region");
        // const city = getValue(context, "place") || getValue(context, "locality");
        // const district = getValue(context, "neighborhood") || "N/A";
        // const barangay = getValue(context, "address") || "N/A";

        mapCenter.value = [parseFloat(suggestion.lat), parseFloat(suggestion.lon)];
        
  
        // console.log("Selected Address:");
        // console.log("Latitude:", latitude);
        // console.log("Longitude:", longitude);
        // console.log("Province:", province);
        // console.log("City:", city);
        // console.log("Barangay:", barangay);
        // console.log("District:", district);
        searchQuery.value = suggestion.display_name;
        suggestions.value = [];
      };
  
      return {
        searchQuery,
        suggestions,
        fetchAddressSuggestions,
        selectAddress,
        zoom,
        mapCenter,
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
  }
  .suggestions li {
    padding: 8px;
    cursor: pointer;
  }
  .suggestions li:hover {
    background-color: #f0f0f0;
  }
  </style>
  