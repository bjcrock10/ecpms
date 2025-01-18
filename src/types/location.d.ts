import { ref } from 'vue';

export interface LocationDetails {
  lng: number;
  lat: number;
  barangay: string | null;
  city: string | null;
  province: string | null;
  region: string | null;
  country: string | null;
}

export function useAutocomplete(inputElement: HTMLInputElement | null) {
  const locationDetails = ref<LocationDetails | null>(null);

  const initializeAutocomplete = () => {
    if (!inputElement) {
      console.error("Autocomplete input element is not available.");
      return;
    }

    const autocomplete = new google.maps.places.Autocomplete(inputElement, {
      types: ["geocode"],
    });

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();

      if (!place.geometry || !place.address_components) {
        console.error("No geometry or address components available for the selected place.");
        return;
      }

      const getAddressComponent = (types: string[]) => {
        const component = place.address_components?.find(comp =>
          types.some(type => comp.types.includes(type))
        );
        return component?.long_name || null;
      };

      locationDetails.value = {
        lng: place.geometry.location?.lng() || 0,
        lat: place.geometry.location?.lat() || 0,
        barangay: getAddressComponent(["sublocality_level_1", "sublocality"]),
        city: getAddressComponent(["locality"]),
        province: getAddressComponent(["administrative_area_level_1"]),
        region: getAddressComponent(["administrative_area_level_2"]),
        country: getAddressComponent(["country"]),
      };
    });
  };

  return {
    locationDetails,
    initializeAutocomplete,
  };
}
