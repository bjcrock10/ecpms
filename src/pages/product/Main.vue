<template>
  <div>
    <h1>Google Maps Autocomplete in Parent Component</h1>

    <!-- Autocomplete input element -->
    <input
      ref="autocompleteInput"
      type="text"
      placeholder="Enter a location"
    />

    <!-- Display the selected location details -->
    <div v-if="locationDetails">
      <h2>Location Details:</h2>
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

<script lang="ts">
import { defineComponent, ref, onMounted, nextTick } from "vue";
import { useAutocomplete, LocationDetails } from "../../types/location.d";

export default defineComponent({
  name: "ParentComponent",
  setup() {
    const autocompleteInput = ref<HTMLInputElement | null>(null);
    const { locationDetails, initializeAutocomplete } = useAutocomplete(autocompleteInput.value);

    onMounted(() => {
      nextTick(() => {
        initializeAutocomplete(); // Initialize after the DOM is updated
      });
    });

    return {
      autocompleteInput,
      locationDetails,
    };
  },
});
</script>

<style scoped>
input {
  padding: 8px;
  width: 300px;
  margin-bottom: 10px;
}
</style>
