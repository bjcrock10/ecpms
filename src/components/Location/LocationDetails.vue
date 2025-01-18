<!-- ChildComponent.vue -->
<template>
    <div>
      <input 
        ref="autocompleteInput" 
        v-model="autocompleteValue" 
        type="text" 
        placeholder="Enter a location"
        class="w-full p-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 !important"
      />
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted, watch } from 'vue';
  
  interface LocationDetails {
    lng: number;
    lat: number;
    barangay: string | null;
    city: string | null;
    province: string | null;
    region: string | null;
    country: string | null;
    place_name: string | null;
  }

  interface InputAutocomplete {
    address?: any;
  }
  const props = defineProps<InputAutocomplete>();
  const autocompleteValue = ref('');
  const autocompleteInput = ref<HTMLInputElement | null>(null);
  const locationDetails = ref<LocationDetails | null>(null);
  
  // Emit event
  const emit = defineEmits<{
    (event: 'location-selected', details: LocationDetails): void;
  }>();
  
  const initializeAutocomplete = () => {
    if (!autocompleteInput.value) {
      console.error("Autocomplete input element not found.");
      return;
    }
  
    const autocomplete = new google.maps.places.Autocomplete(autocompleteInput.value, {
      //types: ["geocode"],
    });
  
    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
  
      if (!place.geometry || !place.address_components) {
        console.error("No geometry or address components available.");
        return;
      }
  
      // Extract location details
      const getAddressComponent = (types: string[]) => {
        const component = place.address_components?.find((comp: any) =>
          types.some(type => comp.types.includes(type))
        );
        return component?.long_name || null;
      };
  
      locationDetails.value = {
        lng: place.geometry.location?.lng() || 0,
        lat: place.geometry.location?.lat() || 0,
        barangay: getAddressComponent(["sublocality_level_1", "sublocality"]) || getAddressComponent(["village"]),
        city: getAddressComponent(["locality"]),
        province: getAddressComponent(["administrative_area_level_2"]) || getAddressComponent(["administrative_area_level_1"]),
        region: getAddressComponent(["administrative_area_level_1"]),
        country: getAddressComponent(["country"]),
        place_name: getAddressComponent(["sublocality_level_1", "sublocality"]) || getAddressComponent(["village"]) 
            + ", " + getAddressComponent(["locality"]) + ", " + getAddressComponent(["administrative_area_level_2"]) || getAddressComponent(["administrative_area_level_1"])
            + ", " + getAddressComponent(["administrative_area_level_1"]) + ", " + getAddressComponent(["country"]),
      };
  
      // Emit the location details
      emit('location-selected', locationDetails.value);
    });
  };
  // Watch the autocompleteValue for changes and clear locationDetails if empty
    watch(autocompleteValue, (newValue:any) => {
    if (!newValue) {
        locationDetails.value = null; // Clear the location details if the input is empty
        locationDetails.value = {
        lng: 0,
        lat: 0,
        barangay: "",
        city: "",
        province: "",
        region: "",
        country: "",
        place_name: "",
      };
        emit('location-selected', locationDetails.value);
    }
    });

  onMounted(() => {
    initializeAutocomplete();
    autocompleteValue.value = props.address
  });
  </script>
  