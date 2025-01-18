<template>
    <div>
      <h1>Location Details</h1>
      <input
        type="text"
        id="autocomplete"
        placeholder="Enter an address"
      />
      <button @click="getLocationDetails">Get Location Details</button>
  
      <div v-if="locationDetails">
        <h2>Details:</h2>
        <p><strong>Longitude:</strong> {{ locationDetails.lng }}</p>
        <p><strong>Latitude:</strong> {{ locationDetails.lat }}</p>
        <p><strong>Barangay:</strong> {{ locationDetails.barangay }}</p>
        <p><strong>District:</strong> {{ locationDetails.district }}</p>
        <p><strong>City:</strong> {{ locationDetails.city }}</p>
        <p><strong>Province:</strong> {{ locationDetails.province }}</p>
        <p><strong>Region:</strong> {{ locationDetails.region }}</p>
        <p><strong>Country:</strong> {{ locationDetails.country }}</p>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        autocomplete: null,
        locationDetails: null,
      };
    },
    methods: {
      initAutocomplete() {
        // Initialize Google Places Autocomplete
        const input = document.getElementById("autocomplete");
        this.autocomplete = new google.maps.places.Autocomplete(input, {
          //types: ["geocode"], // Restrict suggestions to addresses
          componentRestrictions: { country: "ph" }, // Optional: Restrict to a specific country
        });
  
        // Add event listener for place selection
        this.autocomplete.addListener("place_changed", this.onPlaceChanged);
      },
      onPlaceChanged() {
        const place = this.autocomplete.getPlace();
  
        if (!place.geometry) {
          alert("No details available for the selected address.");
          return;
        }
  
        // Extract location details
        const location = place.geometry.location;
        const addressComponents = place.address_components;
  
        const getComponent = (type) =>
          addressComponents.find((component) =>
            component.types.includes(type)
          )?.long_name;
  
        this.locationDetails = {
          lng: location.lng(),
          lat: location.lat(),
          barangay: getComponent("sublocality_level_1"),
          district: getComponent("sublocality_level_2"),
          city: getComponent("locality"),
          province: getComponent("administrative_area_level_2"),
          region: getComponent("administrative_area_level_1"),
          country: getComponent("country"),
        };
      },
      async getLocationDetails() {
        if (!this.locationDetails) {
          alert("Please select a location from the autocomplete suggestions.");
        }
      },
    },
    mounted() {
      // Load Google Maps JavaScript API and initialize autocomplete
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyDF8Z1ViYmr_nCgQv11Sqya8ybRaA7otpg&libraries=places`;
      script.async = true;
      script.onload = this.initAutocomplete;
      document.head.appendChild(script);
    },
  };
  </script>
  
  <style scoped>
  input {
    margin-right: 10px;
    width: 300px;
    padding: 8px;
  }
  </style>
  