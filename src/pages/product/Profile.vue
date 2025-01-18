<template>
    <div>
      <h1>Location Details</h1>
      <input
        type="text"
        v-model="address"
        placeholder="Enter an address"
      />
      <button @click="getLocationDetails">Get Location Details</button>
  
      <div v-if="locationDetails">
        <h2>Details:</h2>
        <p><strong>Longitude:</strong> {{ locationDetails.lng }}</p>
        <p><strong>Latitude:</strong> {{ locationDetails.lat }}</p>
        <p><strong>Barangay:</strong> {{ locationDetails.barangay }}</p>
        <p><strong>City:</strong> {{ locationDetails.city }}</p>
        <p><strong>Province:</strong> {{ locationDetails.province }}</p>
        <p><strong>Region:</strong> {{ locationDetails.region }}</p>
        <p><strong>Country:</strong> {{ locationDetails.country }}</p>
      </div>
    </div>
  </template>
  
  <script>
  import axios from "axios";
  
  export default {
    data() {
      return {
        address: "",
        locationDetails: null,
      };
    },
    methods: {
      async getLocationDetails() {
        const baseUrl = "https://nominatim.openstreetmap.org/search";
        try {
          const response = await axios.get(baseUrl, {
            params: {
              q: this.address,
              format: "json",
              addressdetails: 1,
            },
          });
  
          if (response.data.length === 0) {
            alert("No results found.");
            return;
          }
  
          const result = response.data[0];
          const address = result.address;
  
          // Parse and map location details
          this.locationDetails = {
            lng: result.lon,
            lat: result.lat,
            barangay: address.suburb || address.village || address.hamlet || null,
            city: address.city || address.town || address.municipality || null,
            province: address.state || null,
            region: address.region || null,
            country: address.country || null,
          };
        } catch (error) {
          console.error("Error fetching location details:", error);
          alert("Failed to fetch location details. Please try again.");
        }
      },
    },
  };
  </script>
  
  <style scoped>
  input {
    margin-right: 10px;
    padding: 8px;
    width: 300px;
  }
  </style>
  