<script setup lang="ts">
import _ from "lodash";
import fakerData from "../../utils/faker";
import Button from "../../base-components/Button";
import { FormSwitch, FormInput, FormSelect, InputGroup, FormLabel, FormTextarea} from "../../base-components/Form";
import Progress from "../../base-components/Progress";
import Lucide from "../../base-components/Lucide";
import { Menu, Tab } from "../../base-components/Headless";
import TomSelect from "../../base-components/TomSelect";
import { Tab as HeadlessTab } from "@headlessui/vue";
import Table from "../../base-components/Table";
import LocationDataService from "../../services/LocationDataService";
import BusinessDataService from "../../services/BuisinessDataService";
import ClientDataService  from "../../services/ClientDataService"
import OrganizationDataService from "../../services/Organization";
import ResponseData from "../../types/response.d";
import { TransitionRoot } from "@headlessui/vue";
import { useClient } from "../../types/client.d";
import { useBusiness } from "../../types/business.d";
import { tabulatorFunc } from "../../types/tabulator.d";
import { useRouter } from "vue-router";
import { onMounted, ref, reactive, watch, provide, toRefs, nextTick} from "vue";
import Notification from "../../base-components/Notification";
import { NotificationElement } from "../../base-components/Notification";
import Toastify from "toastify-js";
import { createIcons, icons } from "lucide";
import logoUrl from "../../assets/images/logo.svg";
import Item from '../../base-components/Headless/Menu/Item.vue';
import { Disclosure } from "../../base-components/Headless";
import Business from '../../components/Business'
import Assistance from '../../components/Assistance';
import CodeBook from "../../services/CodeBook";
import { integer } from "@vuelidate/validators";
import LocationDetails from "../../components/Location/LocationDetails.vue";
import axios from "axios"
import mapboxgl from "mapbox-gl";
const searchQuery = ref("");
const suggestions = ref([]);
const mapContainer = ref();
let map:any, marker:any;

mapboxgl.accessToken = "pk.eyJ1IjoiYmpjcm9jazEwIiwiYSI6ImNtNXhrNTdibDBhYnQyam9ueWJmaDJ3ajYifQ.9LV1zKsB1AWBtrDaQdxCEA";

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
          types: "address,place,locality,neighborhood,region,poi",
          limit: 5,
        },
      }
    );
    suggestions.value = response.data.features;
  } catch (error) {
    console.error("Error fetching suggestions:", error);
  }
};

const selectAddress = (suggestion:any) => {
  const [longitude, latitude] = suggestion.center;
  const context = suggestion.context || [];
  updateMap(latitude, longitude);
  const province = getValue(context, "region") || getValue(context, "place");
  const city = getValue(context, "place") || getValue(context, "locality") || getValue(context, "neighborhood");
  const district = getValue(context, "neighborhood") || "N/A";
  const barangay = getValue(context, "locality") || context.value;
  searchQuery.value = suggestion.place_name;
  suggestions.value = [];
  formClient.province = province
  formClient.lgu = city
  formClient.barangay = barangay || searchQuery
  formClient.longitude = longitude
  formClient.latitude = latitude
  formClient.city = searchQuery.value
  selectedFromAddressDropdown.value = true
};
const reverseGeocode = async (lat:any, lng:any) => {
  try {
    const response = await axios.get(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json`,
      {
        params: {
          access_token: mapboxgl.accessToken,
          types: "region,place,locality,neighborhood",
        },
      }
    );

    if (response.data.features.length > 0) {
      const result = response.data.features[0];
      searchQuery.value = result.place_name;
      updateMap(lat, lng);

      const context = result.context || [];

      // Extract location details
      const province = getValue(context, "region") || getValue(context, "place");
      const city = getValue(context, "place") || getValue(context, "locality") || getValue(context, "neighborhood");
      const district = getValue(context, "neighborhood") || "N/A";
      const barangay = getValue(context, "locality"); // Fixed the incorrect `context.value`

      // Assign values to form fields
      formClient.province = province;
      formClient.lgu = city;
      formClient.barangay = barangay || "N/A"; // Fallback if `barangay` is undefined
      formClient.longitude = lng;
      formClient.latitude = lat;
      formClient.city = searchQuery.value
      selectedFromAddressDropdown.value = true
    }
  } catch (error) {
    console.error("Error with reverse geocoding:", error);
  }
};

const updateMap = (lat:any, lng:any) => {
  if (!map) {
    console.error("Map is not initialized yet.");
    return;
  }
  if (marker) marker.remove();
  marker = new mapboxgl.Marker().setLngLat([lng, lat]).addTo(map);
  map.flyTo({ center: [lng, lat], zoom: 14 });
};

const getValue = (context:any, type:any) => {
  const item = context.find((c:any) => c.id.startsWith(type));
  return item ? item.text : "N/A";
};


const initializeMap = async () => {
  await nextTick(); // Wait for the modal to be fully rendered

  if (!mapContainer.value) {
    console.error("Map container is not available.");
    return;
  }
  map = new mapboxgl.Map({
    container: mapContainer.value,
    style: "mapbox://styles/mapbox/streets-v11",
    center: [120.9842, 14.5995],
    zoom: 12,
  });

  map.on("click", async (e:any) => {
    const { lng, lat } = e.lngLat;
    await reverseGeocode(lat, lng);
  });
};
//------------------------------------------------------------------------------------------------------------------------

// Search Address
// Define the interface for location details
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
// Reactive state to store the selected location
const selectedLocation = ref<LocationDetails | null>(null);
const autocompleteInput = ref()
// Handle the location-selected event
const handleLocationSelected = (locationDetails: LocationDetails) => {
  selectedLocation.value = locationDetails;
  autocompleteInput.value = (locationDetails.barangay 
            + ", " + locationDetails.city + ", " + locationDetails.province
            + ", " + locationDetails.region + ", " + locationDetails.country).trim().toUpperCase()
  formClient.province = (locationDetails.province || '0').toString().trim().toUpperCase()
  formClient.latitude = (locationDetails.lat || '0').toString().trim().toUpperCase()
  formClient.longitude = (locationDetails.lng || '0').toString().trim().toUpperCase()
  formClient.lgu = (locationDetails.city || '0').toString().trim().toUpperCase()
  formClient.barangay = (locationDetails.barangay || autocompleteInput.value).toString().trim().toUpperCase()
  formClient.city = autocompleteInput.value
  if(locationDetails.lat===0 || locationDetails.city === null || locationDetails.province === null){
    selectedFromAddressDropdown.value = false
  }else{
    selectedFromAddressDropdown.value = true
  }
  
};
// End Search address
const date = new Date();
const current_date = date.getFullYear()+"-"+(date.getMonth()+1)+"-"+ date.getDate();
const current_time = date.getHours()+"."+date.getMinutes()+date.getSeconds();
const componentKey = ref(0);
const forceRerender = () => {
      componentKey.value += 1;
}
const router = useRouter();
const {formClient, errorMessage, isError, columnData, addModal, rounded,  brgyDropdown,
        lnameDropdown, showSearchBrgy, hideSearchBrgy, showSearchLname, hideSearchLname, 
        message, messageDetail, buttonTitle, buttonIcon, setAddModal, select, brgy, sendButtonRef, ncfrs, tenurial,
        accreditation, organization, disNcfrs, disTenurial, disAccreditation, disOrganization, brgySelect, citySelect,
        clientList, addressSelect, checkBa, aNcfrs, dTenurial, dOrganization, dAccreditation, getClientInfo, 
        updateClientInfo, clientSubmit, patchClientInfo, formOrganization, orgList, selectOrganization, brgyId, selectedFromAddressDropdown, latitude, longitude} = useClient();

const clientID = ref(router.currentRoute.value.params.id);
const tableClient = ref<HTMLDivElement>();
const successNotification = ref();

provide("bind[successNotification]", (el: any) => {
  // Binding
  successNotification.value = el;
  });
const item = reactive({
        'id' : '',
        'platForm' : '',
        'url' : '',
      })

const selectedAddress = ref();
const disAbled = ref(false);

const searchLeo = () => {
  if(addressSelect.addressName.length>4){
        LocationDataService.getBarangayVal(addressSelect.addressName).then((response: ResponseData)=>{
        brgySelect.value = response.data
        selectedFromAddressDropdown.value = false
        }).catch((e: Error)=>{
          console.log(citySelect.value)
        })
      }
}
const orgId = ref(0)
const currentClientId = ref();
const onSubmit = () =>{
  // brgyId.value = addressSelect.addressName.split(", ")
  // formClient.farmerId = currentClientId.value
  // formClient.barangay = brgyId.value[0].trim()
  // formClient.lgu = brgyId.value[1].trim()
  // formClient.province = brgyId.value[2].trim()
  if(formClient.lgu==="0"||formClient.lgu===""||formClient.province==="0"||formClient.province===""||formClient.latitude==="0"||formClient.longitude==="0"){
    selectedFromAddressDropdown.value = false
  }else{
    selectedFromAddressDropdown.value = true
  }
  if(selectedFromAddressDropdown.value){
    if(formClient.farmerId===""){
      formClient.farmerId = sessionStorage.getItem("office")+"-"+current_date+"-"+current_time
    }
    if(formClient.province===undefined || formClient.latitude==='' || formClient.longitude===''){
      addressSelect.addressName = ""
      successNotification.value.showToast();
      message.value = "Error Saving!!!!"
      messageDetail.value = "Error Occured, Please Select a proper Barangay/City or Municipality/Province"
      return
    }
    formClient.ipGroup = selectOrganization.value.toString()
    formClient.lname.toUpperCase().trim().replace(
      /[@!^&\/\\#,+()$~%.'":*?<>{}]/g,
      '',
    );
    formClient.fname.toUpperCase().trim().replace(
      /[@!^&\/\\#,+()$~%.'":*?<>{}]/g,
      '',
    );
    formClient.mname.toUpperCase().trim().replace(
      /[@!^&\/\\#,+()$~%.'":*?<>{}]/g,
      '',
    );
    formClient.fullName = formClient.lname.toUpperCase().trim() + ", " + formClient.fname.toUpperCase().trim() + " " + formClient.mname.toUpperCase().trim().replace(
      /[@!^&\/\\#,+()$~%.'":*?<>{}]/g,
      '',
    );
    formOrganization.title = selectOrganization.value.toString()
    formClient.gender = (formClient.prefix==='MR.')?"MALE":"FEMALE"
    formClient.classification = selectClassification.value.toString()
    updateClientInfo(clientID.value,formClient).then();
    message.value = "SUCCESSFULLY SAVE!!!"
    successNotification.value.showToast();
    messageDetail.value = "You successfully updated client profile..."
  }else{
    successNotification.value.showToast();
    message.value = "ERROR SAVING THE FORM!!!"
    messageDetail.value = "Error Occured, Please Select a proper Barangay/City or Municipality/Province"
  }
};
const retrieveBusinessId = async () => {
  ClientDataService.get(formClient.id).then((response: ResponseData)=>{
    formClient.businessId = response.data[0].businessId
    formClient.id = response.data[0].id
  })
}
const priorityIndustry = ref([])
const loadOrganization = () =>{
  if(orgList.value.length===0){
    OrganizationDataService.getAll().then((response: ResponseData)=>{
      orgList.value = response.data
    })
  }
}
const loadPriority = () => {
  if(priorityIndustry.value.length===0){
    CodeBook.getType(11).then((resp: ResponseData)=>{
    priorityIndustry.value = resp.data
  })
  }
}
// Watch for modal open and initialize map
watch(addModal, (newVal) => {
  if (newVal) {
    initializeMap();
  }
});
const long = ref()
const lat = ref()
const selectClassification = ref();
const classificationList = ref([]);
const loadClassification = async (idType:any)=>{
  CodeBook.getType(idType).then((resp:ResponseData)=>{
    classificationList.value = resp.data
  })
}
onMounted(async () => {
  //alert(longitude.value)
  nextTick(async() => {
    //getClientInfo(clientID.value);
    ClientDataService.get(clientID.value).then((response: ResponseData)=>{
            formClient.id = response.data[0].id
            formClient.farmerId = response.data[0].farmerIds
            formClient.lname = response.data[0].lname.toUpperCase()
            formClient.fname = response.data[0].fname.toUpperCase()
            formClient.mname = response.data[0].mname.toUpperCase()
            formClient.suffix = response.data[0].suffix.toUpperCase()
            formClient.province = response.data[0].province.toUpperCase()
            formClient.lgu = response.data[0].lgu.toUpperCase()
            formClient.city = response.data[0].city.toUpperCase()
            formClient.longitude = response.data[0].longitude.toUpperCase()
            formClient.latitude = response.data[0].latitude.toUpperCase()
            formClient.barangay = response.data[0].barangay.toUpperCase()
            addressSelect.addressName = response.data[0].barangay.toUpperCase() + ", " +response.data[0].lgu.toUpperCase()+ ",  " + response.data[0].province.toUpperCase()
            formClient.address = response.data[0].address.toUpperCase()
            formClient.gender = response.data[0].gender
            formClient.age = response.data[0].age
            formClient.civilStatus = response.data[0].civilStatus
            formClient.tenurialStatus = response.data[0].tenurialStatus.toUpperCase()
            formClient.investor = response.data[0].investor
            formClient.typeOfInvestment = response.data[0].typeOfInvestment.toUpperCase()
            formClient.classification = response.data[0].classification
            selectClassification.value = [response.data[0].classification]
            formClient.telNo = response.data[0].telNo.toUpperCase()
            formClient.personNotify = response.data[0].personNotify.toUpperCase()
            formClient.socialClassification = response.data[0].socialClassification
            formClient.faxNo = response.data[0].faxNo.toUpperCase()
            formClient.pwdSpecify = response.data[0].pwdSpecify.toUpperCase()
            formClient.farmerId = response.data[0].farmerId.toUpperCase()
            formClient.ipGroup = response.data[0].ipGroup
            selectOrganization.value = [response.data[0].ipGroup]
            formClient.designation = response.data[0].designation.toUpperCase()
            formClient.tenurialStatus = response.data[0].tenurialStatus.toUpperCase()
            formClient.accreditation = response.data[0].accreditation.toUpperCase()
            formClient.mobileNo = response.data[0].mobileNo
            formClient.email = response.data[0].email
            formClient.yearStarted = response.data[0].yearStarted
            formClient.businessId = response.data[0].businessId
            formClient.clientCode = response.data[0].clientCode
            formClient.prefix = response.data[0].prefix.toUpperCase()
            formClient.zipcode = response.data[0].zipcode
            formClient.designation = response.data[0].designation.toUpperCase()
            formClient.recStat = response.data[0].recStat
            formClient.encodedDate = response.data[0].encodedDate
            
            longitude.value = response.data[0].longitude
            latitude.value = response.data[0].latitude
    
            map = new mapboxgl.Map({
              container: mapContainer.value,
              style: "mapbox://styles/mapbox/streets-v11",
              center: [parseFloat(longitude.value), parseFloat(latitude.value)],
              zoom: 12,
            });
            map.on("click", async (e:any) => {
              const { lng, lat } = e.lngLat;
              if(lng==='' && lat===''){
                await reverseGeocode(parseFloat(latitude.value), parseFloat(longitude.value));
              }else{
                await reverseGeocode(lat, lng);
              }
            });
          }).catch((e: Error)=>{
              console.log(e.message)
          })
    // long.value = formClient.longitude
    // lat.value = formClient.latitude
    // selectedAddress.value = formClient.city
    // map = new mapboxgl.Map({
    //   container: mapContainer.value,
    //   style: "mapbox://styles/mapbox/streets-v11",
    //   center: [120.9842, 14.5995],
    //   zoom: 12,
    // });
    // map.on("click", async (e:any) => {
    //   const { lng, lat } = e.lngLat;
    //   await reverseGeocode(lat, lng);
    // });
  })
  if(sessionStorage.getItem('userId') === null){
      router.push({ path:'/login'})
      sessionStorage.clear()
    }
  else{
    loadClassification(2);
  }
  
});

</script>

<template>
  <div class="flex items-center mt-8 intro-y">
    <h2 class="mr-auto text-lg font-medium">Profile Layout</h2>
  </div>
  <Tab.Group>
    <!-- BEGIN: Notification Content -->
    <Notification refKey="successNotification" :options="{
        duration: 3000,
        }" class="flex bg-slate-200">
        <Lucide icon="CheckCircle" class="block mx-auto" />
      <div class="ml-4 mr-4">
        <div class="font-medium">
          {{message}}
        </div>
        <div class="text-slate-500 mt-1">
          {{ messageDetail }}
        </div>
      </div>
    </Notification>
  <!-- END: Notification Content -->
    <!-- BEGIN: Profile Info -->
    <div class="px-5 pt-5 mt-5 intro-y box">
      <div
        class="flex flex-col pb-5 -mx-5 border-b lg:flex-row border-slate-200/60 dark:border-darkmode-400"
      >
        <div
          class="flex items-center justify-center flex-1 px-5 lg:justify-start"
        >
          <div
            class="relative flex-none w-20 h-20 sm:w-24 sm:h-24 lg:w-32 lg:h-32 image-fit"
          >
            <img
              alt="ECPMS Template"
              class="rounded-full"
              :src="logoUrl"
            />
            <button
              class="absolute bottom-0 right-0 flex items-center justify-center p-2 mb-1 mr-1 rounded-full bg-primary hover:bg-slate-500"
            >
              <Lucide icon="Camera" class="w-4 h-4 text-white" />
            </button>
          </div>
          <div class="ml-5">
            <div
              class="w-24 text-lg font-medium truncate sm:w-40 sm:whitespace-normal"
            >
              {{formClient.fname + " " + formClient.mname.charAt(0) + ". " + formClient.lname }}
            </div>
            <div class="text-slate-500">{{ formClient.designation }}</div>
          </div>
        </div>
        <div
          class="flex-1 px-5 pt-5 mt-6 border-t border-l border-r lg:mt-0 border-slate-200/60 dark:border-darkmode-400 lg:border-t-0 lg:pt-0"
        >
          <div class="font-medium text-center lg:text-left lg:mt-3">
            Contact Details
          </div>
          <div
            class="flex flex-col items-center justify-center mt-4 lg:items-start"
          >
            <div class="flex items-center truncate sm:whitespace-normal">
              <Lucide icon="Mail" class="w-4 h-4 mr-2" />E-mail:
              {{ formClient.email }}
            </div>
            <div class="flex items-center mt-3 truncate sm:whitespace-normal">
              <Lucide icon="Phone" class="w-4 h-4 mr-2" /> Tel. No.:
              {{ formClient.telNo }}
            </div>
            <div class="flex items-center mt-3 truncate sm:whitespace-normal">
              <Lucide icon="Phone" class="w-4 h-4 mr-2" /> Fax No.:
              {{ formClient.faxNo }}
            </div>
            <div class="flex items-center mt-3 truncate sm:whitespace-normal">
                <Lucide icon="Phone" class="w-4 h-4 mr-2" /> Mobile No.:
                {{ formClient.mobileNo }}
              </div>
          </div>
        </div>
      </div>
      <Tab.List
        variant="link-tabs"
        class="flex-col justify-center text-center sm:flex-row lg:justify-start"
      >
        <Tab :fullWidth="false">
            <Tab.Button class="flex items-center py-4 cursor-pointer">
            <Lucide icon="User" class="w-4 h-4 mr-2" /> Profile
            </Tab.Button>
        </Tab>
        <Tab :fullWidth="false">
            <Tab.Button class="flex items-center py-4 cursor-pointer">
            <Lucide icon="Shield" class="w-4 h-4 mr-2" /> Business Information
            </Tab.Button>
        </Tab>
        <Tab :fullWidth="false" v-if="parseInt(formClient.businessId)===0">
            <Tab.Button class="flex items-center py-4 cursor-pointer" @click="retrieveBusinessId()">
            <Lucide icon="Settings" class="w-4 h-4 mr-2" /> Assistance for Potential Clients
            </Tab.Button>
        </Tab>
      </Tab.List>
    </div>
    <!-- END: Profile Info -->
    <Tab.Panels class="mt-5 intro-y">
       <Tab.Panel>
          <div class="grid grid-cols-12 gap-6">
            <!-- BEGIN: Top Categories -->
            <div class="col-span-12 intro-y box lg:col-span-12">
              <div class="p-5">
                <div class="flex flex-col sm:flex-row">
                    <form class="validate-form" @submit.prevent="onSubmit">
                        <fieldset class="grid grid-cols-12 col-span-12 gap-4 gap-y-3 
                                border border-solid border-gray-300 p-2">
                                <legend class="text-sm font-bold">Personal Information</legend>
                                <div class="col-span-12 md:col-span-1">
                                    <FormLabel htmlFor="modal-form-3"> Prefix </FormLabel>
                                    <FormSelect v-model="formClient.prefix" required>
                                      <option value="MR.">MR.</option>
                                      <option value="MS.">Ms.</option>
                                      <option value="MRS.">MRS.</option>
                                    </FormSelect>
                                </div>
                                <div class="col-span-12 md:col-span-3">
                                    <FormLabel  htmlFor="modal-form-1"> Last Name </FormLabel>
                                    <FormInput :rounded="rounded" 
                                    v-model="formClient.lname" type="text" placeholder=""
                                    autofocus
                                    @blur="
                                        () => {
                                          loadOrganization();
                                    }"
                                    required/>
                                </div>
                                <div class="col-span-12 md:col-span-4">
                                    <FormLabel htmlFor="modal-form-2"> First Name </FormLabel>
                                    <FormInput :rounded="rounded" 
                                    v-model="formClient.fname" type="text" placeholder="" required/>
                                </div>
                                <div class="col-span-12 md:col-span-3">
                                    <FormLabel htmlFor="modal-form-3">Middle Name</FormLabel>
                                    <FormInput :rounded="rounded" v-model="formClient.mname" 
                                        type="text" placeholder="M.I" />
                                </div>
                                <div class="col-span-12 md:col-span-1">
                                    <FormLabel htmlFor="modal-form-3"> Suffix </FormLabel>
                                    <FormInput :rounded="rounded" v-model="formClient.suffix" type="text" placeholder="Sr/Jr/III" />
                                </div>
                                <!-- <div class="col-span-12 md:col-span-2 hidden">
                                    <FormLabel htmlFor="modal-form-3"> Sex </FormLabel>
                                    <FormSelect v-model="formClient.gender" required>
                                      <option value="FEMALE">Female</option>
                                      <option value="MALE">Male</option>
                                      <option value="Other">Other</option>
                                    </FormSelect>
                                </div> -->
                                <div class="col-span-12 md:col-span-2">
                                    <FormLabel htmlFor="modal-form-3"> Civil Status </FormLabel>
                                    <FormSelect v-model="formClient.civilStatus" required>
                                        <option value="Single">Single</option>
                                        <option value="Married">Married</option>
                                        <option value="Widowed">Widowed</option>
                                        <option value="Legally Separated">Legally Separated</option>
                                    </FormSelect>
                                </div>
                                <div class="col-span-12 md:col-span-2">
                                    <FormLabel htmlFor="modal-form-3"> Social Classification </FormLabel>
                                    <FormSelect v-model="formClient.socialClassification" required>
                                        <option value="Abled">Abled</option>
                                        <option value="Indigenous Person">Indigenous Person</option>
                                        <option value="Differently-Abled (PWD)">Differently-Abled (PWD)</option>
                                        <option value="Senior Citizen">Senior Citizen</option>
                                    </FormSelect>
                                </div>
                                <div class="col-span-12 md:col-span-2">
                                    <FormLabel  htmlFor="modal-form-1"> Age </FormLabel>
                                    <FormSelect v-model="formClient.age" required>
                                        <option value="18 - 35 years old">18 - 35 years old</option>
                                        <option value="above 35 – below 60 years old">above 35 – below 60 years old</option>
                                        <option value="60 years old and  above">60 years old and  above</option>
                                    </FormSelect>
                                </div>
                                <div class="col-span-12 md:col-span-4">
                                  <FormLabel  htmlFor="modal-form-1"> Job Position </FormLabel>
                                  <FormInput :rounded="rounded" v-model="formClient.designation" type="text" placeholder=""/>
                                </div>
                                <div class="col-span-12 md:col-span-2">
                                  <FormLabel htmlFor="modal-form-3"> Classification / Occupation<span class="requiredTag"> *</span> </FormLabel>
                                  <!-- <FormSelect  v-model="formClient.classification" placeholder="Required Fields *" required>
                                    <option value="Housewife">Housewife</option>
                                    <option value="Self-Employed">Self-Employed</option>
                                    <option value="Government Employee">Government Employee</option>
                                    <option value="Professional">Professional</option>
                                    <option value="OFW">OFW</option>
                                    <option value="Military/Police">Military/Police</option>
                                    <option value="Retiree">Retiree</option>
                                    <option value="Drug Surrenderee">Drug Surrenderee</option>
                                    <option value="Ex-Convict">Ex-Convict</option>
                                    <option value="Other">Other</option>>
                                  </FormSelect> -->
                                  <TomSelect
                                        v-model="selectClassification"
                                        :options="{
                                          placeholder: 'Select item below. If not exist please specify...'
                                        }"
                                        class="w-full" multiple
                                      >
                                      <option :value="formClient.classification">{{formClient.classification}}</option>
                                      <option v-for="item in classificationList" :value="item['textdata']" :key="item['id']">{{item['textdata']}}</option>
                                  </TomSelect>
                                </div>
                                <div class="col-span-12 md:col-span-4">
                                  <FormLabel  htmlFor="modal-form-1"> Are you a member of a organization/cooperative? </FormLabel>
                                  <TomSelect
                                        v-model="selectOrganization"
                                        :options="{
                                          placeholder: 'Select item below. If not exist please specify...',
                                          persist: false,
                                          createOnBlur: true,
                                          create: true,
                                          maxItems:1,
                                        }"
                                        class="w-full" multiple
                                        @focus="() => {
                                                    loadOrganization();
                                                    loadPriority();
                                        }"
                                      >
                                      <option v-for="item in orgList" :value="item['title']" :key="item['id']">{{item['title']}}</option>
                                      <option value="No">Not a member of any organization</option>
                                  </TomSelect>
                                </div>
                                <div class="col-span-12 md:col-span-2">
                                  <FormLabel htmlFor="modal-form-3"> Are you an Investor </FormLabel>
                                  <FormSelect v-model="formClient.investor"
                                      @change="loadPriority()" required>
                                      <option value="Yes">Yes</option>
                                      <option value="No">No</option>
                                  </FormSelect>
                                </div>
                                <div class="col-span-12 md:col-span-4" v-if="formClient.investor==='Yes'">
                                    <FormLabel  htmlFor="modal-form-1"> Priority Industry </FormLabel>
                                    <TomSelect
                                          v-model="formClient.typeOfInvestment"
                                          :options="{
                                            placeholder: 'Select item below. If not exist please specify...',
                                            persist: false,
                                            createOnBlur: true,
                                            create: true,
                                          }"
                                          class="w-full" :required="(formClient.investor==='Yes')?true:false"
                                        >
                                        <option value="">N/A</option>
                                        <option v-for="item in priorityIndustry" :value="item['textdata']" :key="item['id']">{{item['textdata']}}</option>
                                        <option :value="formClient.typeOfInvestment">{{formClient.typeOfInvestment}}</option>
                                    </TomSelect>
                                </div>
                                <fieldset class="grid grid-cols-12 col-span-12 gap-4 gap-y-3 border border-solid border-gray-300 p-3">
                                    <legend class="text-xs">Address</legend>
                                    <div class="col-span-12 md:col-span-12">
                                        <FormLabel  htmlFor="modal-form-1"> House No./Street Name</FormLabel>
                                        <FormInput v-model="formClient.address" type="text"
                                        placeholder="House/Building No. / Room & Floor No./ Building Name" required/>
                                    </div>
                                    <div class="col-span-12 md:col-span-12">
                                        <FormLabel  htmlFor="modal-form-1"> Current BARANGAY / CITY or Municipality / PROVINCE / REGION</FormLabel>
                                        <FormInput v-model="formClient.city" type="text"
                                        placeholder="House/Building No. / Room & Floor No./ Building Name" readonly/>
                                    </div>
                                    <!-- BEGIN: Search -->
                                    <div class="col-span-12 sm:col-span-12">
                                      <div class="col-span-12 sm:col-span-12">
                                        <FormLabel  htmlFor="modal-form-1">SEARCH BARANGAY / CITY or Municipality / PROVINCE / REGION</FormLabel>
                                        <!-- <LocationDetails :address="selectedAddress" @location-selected="handleLocationSelected" /> -->
                                        <input
                                          v-model="searchQuery"
                                          @input="fetchAddressSuggestions"
                                          placeholder="Search for an address"
                                          class="input"
                                        />
                                        <ul v-if="suggestions.length" class="suggestions">
                                          <li v-for="(suggestion, index) in suggestions" :key="index" @click="selectAddress(suggestion)">
                                            {{ suggestion['place_name'] }}
                                          </li>
                                        </ul>
                                        <div ref="mapContainer" class="map-container"></div>
                                      </div>
                                    </div>
                                    <!-- END: Search -->
                                    
                                    <div class="col-span-12 sm:col-span-3">
                                      <FormLabel  htmlFor="modal-form-3"> Province </FormLabel>
                                      <FormInput  v-model="formClient.province" type="text"
                                      placeholder="If applicable" readonly required/>
                                    </div>
                                    <div class="col-span-12 sm:col-span-3">
                                      <FormLabel  htmlFor="modal-form-3"> City / Municipality </FormLabel>
                                      <FormInput  v-model="formClient.lgu" type="text"
                                      placeholder="If applicable" readonly required/>
                                    </div>
                                    <div class="col-span-12 sm:col-span-3">
                                      <FormLabel  htmlFor="modal-form-3"> Longitude </FormLabel>
                                      <FormInput  v-model="formClient.longitude" type="text"
                                      placeholder="If applicable" readonly required />
                                    </div>
                                    <div class="col-span-12 sm:col-span-3">
                                      <FormLabel  htmlFor="modal-form-3"> Latitude </FormLabel>
                                      <FormInput  v-model="formClient.latitude" type="text"
                                      placeholder="If applicable" required readonly/>
                                    </div>
                                    </fieldset>
                                    <fieldset class="grid grid-cols-12 col-span-12 gap-4 gap-y-3 border border-solid border-gray-300 p-3">
                                    <legend class="text-xs">Contact Details</legend>
                                    <div class="col-span-12 md:col-span-3">
                                        <FormLabel  htmlFor="modal-form-3"> Landline Number </FormLabel>
                                        <FormInput v-model="formClient.telNo" type="text"
                                        placeholder="If applicable"/>
                                    </div>
                                    <div class="col-span-12 md:col-span-3">
                                        <FormLabel  htmlFor="modal-form-3"> Mobile Number </FormLabel>
                                        <FormInput v-model="formClient.mobileNo" type="text"
                                        placeholder="If applicable"/>
                                    </div>
                                    <div class="col-span-12 md:col-span-3">
                                        <FormLabel  htmlFor="modal-form-3"> Fax Number </FormLabel>
                                        <FormInput v-model="formClient.faxNo" type="text"
                                        placeholder="If applicable"/>
                                    </div>
                                    <div class="col-span-12 md:col-span-3">
                                        <FormLabel  htmlFor="modal-form-3"> Email Address </FormLabel>
                                        <FormInput v-model="formClient.email" type="email"
                                        placeholder="If applicable"/>
                                    </div>
                                </fieldset>
                        </fieldset>
                      <Button type="submit" variant="primary" elevated class="w-auto bg-primary">
                        <Lucide icon="Save" class="w-4 h-4 mr-2" />Update
                      </Button>
                    </form>
                  </div>
                </div>
              </div>
            </div>  
      </Tab.Panel>
      <!-- END: Business Information -->
      <Tab.Panel>
        <Business :clientId="clientID"/>
      </Tab.Panel>
      <!-- BEGIN: Assistance Information -->
      <Tab.Panel v-if="parseInt(formClient.businessId)===0">
        <div class="grid grid-cols-12 gap-12">
          <div class="col-span-12 intro-y box lg:col-span-12">
            <div class="p-2">
                <Assistance :business="formClient.businessId" :clientId="formClient.id" :encoded-date="formClient.encodedDate" :key="componentKey" @click="forceRerender()"/>
            </div>
          </div>
        </div>
      </Tab.Panel>
      <!-- END: Assistance Information -->
    </Tab.Panels>
  </Tab.Group>
</template>

<style scoped>
  input{
    text-transform: uppercase;
  }
  ::placeholder {
    color: red;
    opacity: 1;
  }
  ::-ms-input-placeholder {
    color: red;
  }
  .requiredTag{
    color: red;
    opacity: 1;
  }
  .autocomplete-input {
    width: 100%;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
  
  .suggestions-list {
    list-style-type: none;
    padding: 0;
    margin: 0;
    border: 1px solid #ccc;
    border-top: none;
    max-height: 200px;
    overflow-y: auto;
  }
  
  .suggestions-list li {
    padding: 8px;
    cursor: pointer;
  }
  
  .suggestions-list li:hover {
    background-color: #f0f0f0;
  }
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
  .modal {
  display: flex;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  align-items: center;
  justify-content: center;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 80%;
  height: 500px;
}

.map-container {
  height: 400px;
  width: 100%;
}

</style>