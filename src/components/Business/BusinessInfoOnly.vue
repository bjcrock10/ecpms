<script setup lang="ts">
import _ from "lodash";
import Button from "../../base-components/Button";
import { FormSwitch, FormInput, FormSelect, InputGroup, FormLabel, FormTextarea} from "../../base-components/Form";
import Lucide from "../../base-components/Lucide";
import { Menu, Tab, Dialog } from "../../base-components/Headless";
import TomSelect from "../../base-components/TomSelect";
import Table from "../../base-components/Table";
import BusinessDataService from "../../services/BuisinessDataService";
import OrganizationDataService from "../../services/Organization"
import Assistance from '../../components/Assistance';
import ResponseData from "../../types/response.d";
import { TransitionRoot } from "@headlessui/vue";
import { useClient } from "../../types/client.d";
import { useBusiness } from "../../types/business.d";
import { useRouter } from "vue-router";
import { onMounted, ref, reactive, watch, provide, toRefs, nextTick} from "vue";
import Notification from "../../base-components/Notification";
import ClientDataService from "../../services/ClientDataService";
import CodeBook from "../../services/CodeBook";
import Product from "../../components/Product";
import MarketProfile from '../../components/MarketProfile';
import { tabulatorFunc } from "../../types/tabulator.d";
import LocationDetails from "../../components/Location/LocationDetails.vue";
import axios from "axios"
import mapboxgl from "mapbox-gl";
const searchQuery = ref("");
const suggestions = ref([]);
const mapContainer = ref<HTMLElement | null | string>(null);
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
 
  formBusiness.businessProvince = province
  formBusiness.businessLatitude = latitude
  formBusiness.businessLongitude = longitude
  formBusiness.businessCity = city
  formBusiness.businessBrgy = barangay
  formBusiness.businessBrgyAddress = searchQuery.value
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
      formBusiness.businessProvince = province
      formBusiness.businessLatitude = lat
      formBusiness.businessLongitude = lng
      formBusiness.businessCity = city
      formBusiness.businessBrgy = barangay
      formBusiness.businessBrgyAddress = searchQuery.value
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

const initializeMap = () => {
  if (!mapContainer.value) {
    console.error("Map container is not available!");
    return;
  }

  map = new mapboxgl.Map({
    container: mapContainer.value, // Ensure the container exists
    style: "mapbox://styles/mapbox/streets-v11",
    center: [120.9842, 14.5995], // Example: Manila
    zoom: 12,
  });

  map.on("click", async (e:any) => {
    const { lng, lat } = e.lngLat;
    await reverseGeocode(lat, lng);
  });
};

// const initializeMap = async () => {
//   await nextTick(); // Wait for the modal to be fully rendered

//   if (!mapContainer.value) {
//     console.error("Map container is not available.");
//     return;
//   }
//   map = new mapboxgl.Map({
//     container: mapContainer.value,
//     style: "mapbox://styles/mapbox/streets-v11",
//     center: [120.9842, 14.5995],
//     zoom: 12,
//   });

//   map.on("click", async (e:any) => {
//     const { lng, lat } = e.lngLat;
//     await reverseGeocode(lat, lng);
//   });
// };
//----------------------------------------------------End of MAPBOX--------------------------------------------------------------------
// Search Address
// Define the interface for location details
// const selectedAddress = ref()
// interface LocationDetails {
//   lng: number;
//   lat: number;
//   barangay: string | null;
//   city: string | null;
//   province: string | null;
//   region: string | null;
//   country: string | null;
//   place_name: string | null;
// }
// // Reactive state to store the selected location
// const selectedLocation = ref<LocationDetails | null>(null);
// const autocompleteInput = ref()
// // Handle the location-selected event
// const handleLocationSelected = (locationDetails: LocationDetails) => {
//   selectedLocation.value = locationDetails;
//   autocompleteInput.value = (locationDetails.barangay 
//             + ", " + locationDetails.city + ", " + locationDetails.province
//             + ", " + locationDetails.region + ", " + locationDetails.country).trim().toUpperCase()
//   formBusiness.businessProvince = (locationDetails.province || '0').toString().trim().toUpperCase()
//   formBusiness.businessLatitude = (locationDetails.lat || '0').toString().trim().toUpperCase()
//   formBusiness.businessLongitude = (locationDetails.lng || '0').toString().trim().toUpperCase()
//   formBusiness.businessCity = (locationDetails.city || '0').toString().trim().toUpperCase()
//   formBusiness.businessBrgy = (locationDetails.barangay || autocompleteInput.value).toString().trim().toUpperCase()
//   formBusiness.businessBrgyAddress = autocompleteInput.value
//   if(locationDetails.lat===0 || locationDetails.city === null || locationDetails.province === null){
//     selectedFromAddressDropdown.value = false
//   }else{
//     selectedFromAddressDropdown.value = true
//   }
  
// };
// End Search address
const router = useRouter();
const {message, messageDetail,patchClientInfo, brgySelect, clientList, hideSearchLname, showSearchLname, lnameDropdown} = useClient();
const {formBusiness, formBusinessOwner, formEcommerce, formSocialMedia,formMarketPlan, formMarketTraining, hideSearchBrgyBusiness, hideSearchBrgyPlant, 
        showSearchBrgyBusiness, showSearchBrgyPlant, brgyDropdownBusiness, brgyDropdownPlant, addressSelectBus,
      checkBusinessBrgy, checkPlantBrgy, businessID, businessSubmit, getBusinessInfo, 
      selectBusinessOwner, selectLineOfBusiness, selectStandardCertification, selectSocialMed, selectEcommerce, 
      selectBOwner, selectMarketPlan, selectMarketTraining, showSearchBusiness, hideSearchBusiness, businessList, businessDropdown, formOrganization, 
      orgList, selectOrganization, selectPriorityIndustry, columnData, selectedFromAddressDropdown, resetForm} = useBusiness();
const tableClient = ref<HTMLDivElement>();
const {initTabulator, initTabulatorByClient, reInitOnResizeWindow, tabulator, loadingIcon} = tabulatorFunc();
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
interface Business {
    clientId?: any;
    business?: any;
}
const addModal = ref(false)
const selectPsicSection = ref([1]);
const props = defineProps<Business>();
const sameAddress = ref(false);
const disAbled = ref(false);
const priorityIndustry = ref([]);
const psicSection = ref([]); 
watch(
  () => (formBusinessOwner.lname), async(lname, prevToe) => {
    if(lname.length>4){
        ClientDataService.findByLname(lname).then((response: ResponseData)=>{
          clientList.value = response.data
        }).catch((e: Error)=>{
          console.log(clientList.value)
        })
      }
    }
)
watch(
  () => (formBusiness.businessName), async(name, prevToe) => {
    if(name.length>4){
        BusinessDataService.findByName(name).then((response: ResponseData)=>{
          businessList.value = response.data
        }).catch((e: Error)=>{
          console.log(businessList.value)
        })
      }
    }
)
const socialMedList = ref([])
const ecommerceList = ref([])
const businessOwnerList = ref([])
const marketPlanList  = ref([])
const marketTrainingList  = ref([])
const rounded = ref(false)
const loadBusiness = () => {
  getBusinessInfo(formBusiness.id)
}
const loadSocial = async (id:any) =>{
  BusinessDataService.getSocialByBusiness(id).then((response: ResponseData)=>{
    socialMedList.value = response.data
  })
}
const loadEcommerce = async (id:any) =>{
  BusinessDataService.getEcommerceByBusiness(id).then((response: ResponseData)=>{
    ecommerceList.value = response.data
  })
}
const loadBusinessOwner = async (id:any) =>{
  BusinessDataService.getOwnerByBusiness(id).then((response: ResponseData)=>{
    businessOwnerList.value = response.data
  })
}
const loadMarketPlan = async (id:any) =>{
  BusinessDataService.getMarketPlanByBusiness(id).then((response: ResponseData)=>{
    marketPlanList.value = response.data
  })
}
const loadMarketTraining = async (id:any) =>{
  BusinessDataService.getMarketTrainingByBusiness(id).then((response: ResponseData)=>{
    marketTrainingList.value = response.data
  })
}
const removeSocial = async (id: any) =>{
  BusinessDataService.deleteSocial(id).then((response: ResponseData)=>{
    loadSocial(formBusiness.id)
  }).catch((e:Error)=>{
    console.log(e.message)
  })
}
const removeEcommerce = async (id: any) =>{
  BusinessDataService.deleteEcommerce(id).then((response: ResponseData)=>{
    loadEcommerce(formBusiness.id)
  }).catch((e:Error)=>{
    console.log(e.message)
  })
}
const removeBusinessOwner = async (id: any) =>{
  BusinessDataService.deleteOwner(id).then((response: ResponseData)=>{
    loadBusinessOwner(formBusiness.id)
  }).catch((e:Error)=>{
    console.log(e.message)
  })
}
const removeMarketPlan = async (id: any) =>{
  BusinessDataService.deleteMarketPlan(id).then((response: ResponseData)=>{
    loadMarketPlan(formBusiness.id)
  }).catch((e:Error)=>{
    console.log(e.message)
  })
}
const removeMarketTraining = async (id: any) =>{
  BusinessDataService.deleteMarketTraining(id).then((response: ResponseData)=>{
    loadMarketTraining(formBusiness.id)
  }).catch((e:Error)=>{
    console.log(e.message)
  })
}
const brgyId = ref()
const onAddBusiness = async () => {
  if(formBusiness.businessCity==="0"||formBusiness.businessCity===""
     ||formBusiness.businessProvince==="0"||formBusiness.businessProvince===""
     ||formBusiness.businessLatitude==="0"||formBusiness.businessLongitude==="0"){
    selectedFromAddressDropdown.value = false
  }else{
    selectedFromAddressDropdown.value = true
  }
  if(selectedFromAddressDropdown.value === true){
    formBusiness.businessOwnership = selectBusinessOwner.value.toString();
    formBusiness.lineOfBusiness = selectLineOfBusiness.value.toString();
    formBusiness.standardCertification = selectStandardCertification.value.toString();
    formBusiness.organization = selectOrganization.value.toString();
    formBusiness.clientId = props.clientId;
    if(formBusiness.businessProvince===undefined){
      addressSelectBus.businessAddress = ""
      successNotification.value.showToast();
      message.value = "Error in Saving!!!!!"
      messageDetail.value = "Error Occured, Please Select a proper Barangay/City or Municipality/Province"
      return
    }
    if(formBusiness.id==="0"){
      BusinessDataService.create(formBusiness).then((response: ResponseData)=>{
        businessID.value = response.data.id
        if(formBusiness.clientId!=="0"){
          patchClientInfo(formBusiness.clientId,{'businessId':businessID.value})
        }
        successNotification.value.showToast();
        message.value = "SUCESSFULL!!!!!"
        messageDetail.value = "You successfully business profile with a Business ID "+businessID.value;
        formBusiness.id = businessID.value.toString();
        // dataTable();
      }).catch((e:Error)=>{
        successNotification.value.showToast();
        message.value = "Error in Saving!!!!!"
        messageDetail.value = e.message + " Details: Business Name Exists"
      })
    }else{
      if(formBusiness.businessLatitude.trim()!==''){
        if(formBusiness.psicSection.trim()===''){
          formBusiness.psicSection = "Accommodation and Food Service Activities"
        }
        BusinessDataService.update(formBusiness.id, formBusiness).then((response: ResponseData)=>{
          businessID.value = response.data.id
          if(formBusiness.clientId!=="0"){
            patchClientInfo(formBusiness.clientId,{'businessId':businessID.value})
          }
          successNotification.value.showToast();
          messageDetail.value = "You successfully updated business profile with a Business ID "+businessID.value
          formBusiness.id = businessID.value.toString()
          // dataTable();
        }).catch((e:Error)=>{
          successNotification.value.showToast();
          message.value = "Error in Saving!!!!!"
          messageDetail.value = e.message
        })
      }else{
        alert('Please select the address in the dropdown for proper tagging. Thanks')
      }
    }
    formOrganization.title = formBusiness.organization.toUpperCase();
    OrganizationDataService.findByTitle(formBusiness.organization).then((response: ResponseData)=>{
      if(response.data.length===0){
        OrganizationDataService.create(formOrganization).then((response: ResponseData)=>{
            
        }).catch((e: Error)=>{
            console.log(e.message)
        })
      }
    })
  }
  else{
    alert('Please select the address in the dropdown for proper tagging. Thanks')
  }
  
}
const onAddBSocial = async () => {
  formSocialMedia.business = formBusiness.id
  formSocialMedia.platForm = selectSocialMed.value.toString()
  BusinessDataService.createSocial(formSocialMedia).then((response: ResponseData)=>{
    loadSocial(formBusiness.id)
    formSocialMedia.url = ""
    selectSocialMed.value = ["1"]
  }).catch((e:Error)=>{
    message.value = "Error in Saving!!!!!"
      messageDetail.value = e.message
  })
}
const onAddBusinessOwner = async () => {
  formBusinessOwner.business = formBusiness.id
  BusinessDataService.createOwner(formBusinessOwner).then((response: ResponseData)=>{
    loadBusinessOwner(formBusiness.id)
    formBusinessOwner.lname = ""
    formBusinessOwner.designation = ""
    formBusinessOwner.business = "0"
    formBusinessOwner.contactNo = ""
    formBusinessOwner.email ="" 
  }).catch((e:Error)=>{
    message.value = "Error in Saving!!!!!"
      messageDetail.value = e.message
  })
}
const onAddEcommerce = async () => {
  formEcommerce.business = formBusiness.id
  formEcommerce.platForm = selectEcommerce.value.toString()
  BusinessDataService.createEcommerce(formEcommerce).then((response: ResponseData)=>{
    loadEcommerce(formBusiness.id)
    formEcommerce.url = ""
    selectEcommerce.value = ["1"]
  }).catch((e:Error)=>{
    message.value = "Error in Saving!!!!!"
      messageDetail.value = e.message
  })
}
const onAddMarketPlan = async () => {
  formMarketPlan.business = formBusiness.id
  formMarketPlan.marketPlan = selectMarketPlan.value.toString()
  BusinessDataService.createMarketPlan(formMarketPlan).then((response: ResponseData)=>{
    loadMarketPlan(formBusiness.id)
    formMarketPlan.specific = ""
    selectMarketPlan.value = ["1"]
  }).catch((e:Error)=>{
    message.value = "Error in Saving!!!!!"
      messageDetail.value = e.message
  })
}
const onAddMarketTraining = async () => {
  formMarketTraining.business = formBusiness.id
  formMarketTraining.training = selectMarketTraining.value.toString()
  BusinessDataService.createMarketTraining(formMarketTraining).then((response: ResponseData)=>{
    loadMarketTraining(formBusiness.id)
    formMarketTraining.targetYear = ""
    selectMarketTraining.value = ["1"]
  }).catch((e:Error)=>{
    message.value = "Error in Saving!!!!!"
      messageDetail.value = e.message
  })
}
const searchBusiness = ref(false)
onMounted(async () => {
  if(sessionStorage.getItem('userId') === null){
      router.push({ path:'/login'})
      sessionStorage.clear()
    }
  // if(sessionStorage.getItem("privileges")==="0"){
  //   successNotification.value.showToast();
  //   message.value = "Redirecting...."
  //   messageDetail.value = "You don't have access to this page. Redirecting you the landing page."
  //   router.push({path: "/dashboard"});
  // }
  nextTick(() => {
      initializeMap();
      map = new mapboxgl.Map({
        container: (mapContainer.value===null)?'':mapContainer.value,
        style: "mapbox://styles/mapbox/streets-v11",
        center: [120.9842, 14.5995],
        zoom: 12,
      });

      map.on("click", async (e:any) => {
        const { lng, lat } = e.lngLat;
        await reverseGeocode(lat, lng);
      });
    })
  formBusiness.id = props.business || "0"
  loadBusiness();
  CodeBook.getType(11).then((resp: ResponseData)=>{
    priorityIndustry.value = resp.data
  })
  CodeBook.getPSICSection().then((resp: ResponseData)=>{
    psicSection.value = resp.data
  })
  formBusiness.noOfFemaleEmployee = "0"
  formBusiness.noOfMaleEmployee = "0"
  formBusiness.priorityIndustry = "OTHERS"
});
const capitalized = (item: any) =>{
  const capitalizedFirst = item[0].toUpperCase();
  const rest = item.slice(1);
  return capitalizedFirst.trim() + rest.trim();
}

const selectClient = (item:any) =>{
  formBusinessOwner.client = item.id
  formBusinessOwner.lname = item.lname + ", " + item.fname + " " + item.mname
  formBusinessOwner.designation = item.designation
  formBusinessOwner.contactNo = item.telNo +"|"+item.mobileNo
  formBusinessOwner.email = item.email
}

const redirectSocial = (url: any) =>{
  if(url.length>5){
    window.location.href = url
  }
}
const selectOwner = (item:any)=>{
  formBusiness.id = item.id
  formBusiness.businessName = item.businessName
  formBusiness.yearEstablished = item.yearEstablished
  selectBusinessOwner.value = ([item.businessOwnership])
  selectLineOfBusiness.value =  ([item.lineOfBusiness])
  selectStandardCertification.value =  ([item.standardCertification])
  selectOrganization.value = ([item.organization])
  formBusiness.capitalization = item.capitalization
  formBusiness.noOutlets = item.noOutlets
  formBusiness.noEmployee = item.noEmployee
  formBusiness.noOfMaleEmployee = item.noOfMaleEmployee
  formBusiness.noOfFemaleEmployee = item.noOfFemaleEmployee
  formBusiness.businessAddress = item.businessAddress
  addressSelectBus.businessAddress = item.businessBrgyAddress
  formBusiness.businessBrgy = item.businessBrgy
  formBusiness.businessLongitude = item.businessLongitude
  formBusiness.businessLatitude = item.businessLatitude
  formBusiness.plantAddress = item.plantAddress
  addressSelectBus.plantAddress = item.plantBrgyAddress
  formBusiness.plantBrgy = item.plantBrgy
  formBusiness.plantLongitude = item.plantLongitude
  formBusiness.plantLatitude = item.plantLatitude
  formBusiness.landlineNo = item.landlineNo
  formBusiness.mobileNo = item.mobileNo
  formBusiness.faxNo = item.faxNo
  formBusiness.website = item.website
  formBusiness.email = item.email
  formBusiness.priorityIndustry = item.priorityIndustry
  loadSocial(item.id);
  loadEcommerce(item.id);
  loadBusinessOwner(item.id);
}
const setAddModal = (value: boolean) => {
      addModal.value = value;
};
const sendButtonRef = ref(null);
</script>

<template>
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
          <Tab.Group>
                      <Tab.List variant="link-tabs"
                                class="flex-col justify-center text-center sm:flex-row lg:justify-start">
                          <Tab :fullWidth="false">
                              <Tab.Button class="flex items-center py-4 cursor-pointer">
                                  Main
                              </Tab.Button>
                          </Tab>
                          <Tab :fullWidth="false" v-if="formBusiness.id!=='0'" @click="loadSocial(formBusiness.id)">
                              <Tab.Button class="flex items-center py-4 cursor-pointer">
                                  Social Media
                              </Tab.Button>
                          </Tab>
                          <Tab :fullWidth="false" v-if="formBusiness.id!=='0'" @click="loadEcommerce(formBusiness.id)">
                              <Tab.Button class="flex items-center py-4 cursor-pointer">
                                  E-commerce
                              </Tab.Button>
                          </Tab>
                          <Tab :fullWidth="false" v-if="formBusiness.id!=='0'" @click="loadBusinessOwner(formBusiness.id)">
                              <Tab.Button class="flex items-center py-4 cursor-pointer">
                                  Business Owner/s and Representative/s
                              </Tab.Button>
                          </Tab>
                          <Tab :fullWidth="false" v-if="formBusiness.id!=='0'">
                              <Tab.Button class="flex items-center py-4 cursor-pointer">
                                  Marketing Support/Assistance
                              </Tab.Button>
                          </Tab>
                          <Tab :fullWidth="false" v-if="formBusiness.id!=='0'">
                              <Tab.Button class="flex items-center py-4 cursor-pointer">
                                <Lucide icon="Lock" class="w-4 h-4 mr-2" /> Product Information
                              </Tab.Button>
                          </Tab>
                      </Tab.List>
                      <Tab.Panels class="mt-5">
                          <Tab.Panel class="leading-relaxed">
                            <div class="p-5">
                              <form class="validate-form" @submit.prevent="onAddBusiness">
                                <div class="grid grid-cols-12 col-span-12 gap-4 gap-y-3">
                                  <div class="col-span-12 md:col-span-8">
                                      <FormLabel htmlFor="modal-form-2">Registered Business Name</FormLabel>
                                      <FormInput :rounded="rounded" 
                                      v-model="formBusiness.businessName" type="text" placeholder=""
                                      @focus="showSearchBusiness"
                                      @blur="hideSearchBusiness"
                                      required/>
                                    <TransitionRoot
                                      as="template"
                                      :show="businessDropdown"
                                      enter="transition-all ease-linear duration-150"
                                      enterFrom="mt-5 invisible opacity-0 translate-y-1"
                                      enterTo="mt-[3px] visible opacity-100 translate-y-0"
                                      entered="mt-[3px]"
                                      leave="transition-all ease-linear duration-150"
                                      leaveFrom="mt-[3px] visible opacity-100 translate-y-0"
                                      leaveTo="mt-5 invisible opacity-0 translate-y-1"
                                      class="w-full h-40 overflow-scroll"
                                    >
                                      <div class="absolute right-100 z-10 mt-[3px]">
                                        <div class="w-auto p-5 box">
                                          <div class="mb-2 font-medium">Business Name List</div>
                                          <div class="mb-5 hover:blue" v-for="item in businessList" :key="item.id" :value="item.id" v-on:click="selectOwner(item)">
                                            <button href="" class="w-full mb-5 flex items-center hover:bg-slate-400" type="button">
                                              <div
                                                class="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20 dark:bg-success/10 text-success"
                                              >
                                                <Lucide icon="User" class="w-4 h-4" />
                                              </div>
                                              <div class="ml-3">{{item.businessName}}</div>
                                            </button>
                                          </div>
                                          </div>
                                      </div>
                                    </TransitionRoot>
                                  </div>
                                  <div class="col-span-12 md:col-span-4">
                                    <FormLabel htmlFor="modal-form-3">Year Established</FormLabel>
                                    <FormInput :rounded="rounded" v-model="formBusiness.yearEstablished" 
                                        type="number" placeholder="" />
                                  </div>
                                  <div class="col-span-12 md:col-span-4">
                                    <FormLabel  htmlFor="modal-form-1"> Priority Industry </FormLabel>
                                    <TomSelect
                                          v-model="formBusiness.priorityIndustry"
                                          :options="{
                                            placeholder: 'Select item below. If not exist please specify...',
                                          }"
                                          class="w-full"
                                        >
                                        <option v-if="parseInt(formBusiness.id) === 0" :value="formBusiness.priorityIndustry">{{formBusiness.priorityIndustry}}</option>
                                        <option v-for="item in priorityIndustry" :value="item['textdata']" :key="item['id']">{{item['textdata']}}</option>
                                    </TomSelect>
                                </div>
                                  <div class="col-span-12 md:col-span-4">
                                    <FormLabel htmlFor="modal-form-3">Business Ownership</FormLabel>
                                    <TomSelect
                                      v-model="selectBusinessOwner"
                                      :options="{
                                        placeholder: 'Select item below. If not exist please key it in.',
                                      }"
                                      class="w-full"
                                    >
                                      <option value="Sole Proprietorship">Sole Proprietorship</option>
                                      <option value="Partnership/Corporation">Partnership/Corporation</option>
                                      <option value="Cooperative">Cooperative</option>
                                      <option value="Association">Association (DOLE Registration No. _____________)</option>
                                      <option :value="formBusiness.businessOwnership">{{formBusiness.businessOwnership}}</option>
                                    </TomSelect>
                                  </div>
                                  <div class="col-span-12 md:col-span-4">
                                    <FormLabel htmlFor="modal-form-3">PSIC Section</FormLabel>
                                    <TomSelect
                                        v-model="formBusiness.psicSection"
                                          :options="{
                                            placeholder: 'Select item below. If not exist please specify...',
                                          }"
                                          class="w-full"
                                        >
                                        <option v-if="parseInt(formBusiness.id) === 0" value="Other Service Activities">Other Service Activities</option>
                                        <option v-for="item in psicSection" :value="item['title']" :key="item['id']">{{item['title']}}</option>
                                    </TomSelect>
                                  </div>
                                  <div class="col-span-12 md:col-span-4">
                                    <FormLabel htmlFor="modal-form-3">Standard Certification/Accreditation</FormLabel>
                                    <TomSelect
                                      v-model="selectStandardCertification"
                                      :options="{
                                        placeholder: 'Select item below. If others please specify...',
                                      }"
                                      class="w-full" multiple
                                    >
                                      <option value="FDA-LTO">FDA-LTO</option>
                                      <option value="GMP">GMP</option>
                                      <option value="HACCP">HACCP</option>
                                      <option :value="formBusiness.standardCertification">{{formBusiness.standardCertification}}</option>
                                    </TomSelect>
                                  </div>
                                  <div class="col-span-12 md:col-span-4">
                                      <FormLabel htmlFor="modal-form-3 sm:text-xs text-xs"> Company Size/Capitalization</FormLabel>
                                      <FormSelect  v-model="formBusiness.capitalization" required>
                                        <option value="Micro">Micro (3M below)</option>
                                        <option value="Small">Small (3,000,001 – 15M)</option>
                                        <option value="Medium">Medium (15,000,001 – 100M)</option>
                                        <option value="Large">Large (100,000,001 above)</option>
                                      </FormSelect>
                                  </div>
                                  <div class="col-span-12 md:col-span-4">
                                    <FormLabel  htmlFor="modal-form-1"> Are you a member/affiliated of a organization? </FormLabel>
                                    <TomSelect
                                          v-model="selectOrganization"
                                          :options="{
                                            placeholder: 'Example: Cebu GTH',
                                            persist: false,
                                            createOnBlur: true,
                                            create: true,
                                          }"
                                          class="w-full" multiple
                                        >
                                        <option v-for="item in orgList" :value="item['title']" :key="item['id']">{{item['title']}}</option>
                                        <option :value="formBusiness.organization">{{formBusiness.organization}}</option>
                                        <option value="No">Not a member of any organization</option>
                                    </TomSelect>
                                  </div>
                                  <!-- <div class="col-span-12 md:col-span-3">
                                    <FormLabel htmlFor="modal-form-3"> No. of Outlet </FormLabel>
                                    <FormInput v-model="formBusiness.noOutlets" type="number"
                                        placeholder="" required/>
                                  </div> -->
                                  <div class="col-span-12 md:col-span-4">
                                    <FormLabel htmlFor="modal-form-3"> No. of Employees </FormLabel>
                                    <FormSelect v-model="formBusiness.noEmployee" required>
                                        <option value="1-9">1-9</option>
                                        <option value="10-99">10-99</option>
                                        <option value="100-199">100-199</option>
                                        <option value="200 and above">200 and above</option>
                                    </FormSelect>
                                  </div>
                                  <div class="col-span-12 md:col-span-4">
                                    <FormLabel  htmlFor="modal-form-3"> No. of Male </FormLabel>
                                    <FormInput v-model="formBusiness.noOfMaleEmployee" type="text"
                                    placeholder="If applicable"/>
                                  </div>
                                  <div class="col-span-12 md:col-span-4">
                                    <FormLabel  htmlFor="modal-form-3"> No. of Female </FormLabel>
                                    <FormInput v-model="formBusiness.noOfFemaleEmployee" type="text"
                                    placeholder="If applicable"/>
                                  </div>
                                  
                                  <fieldset class="grid grid-cols-12 col-span-12 gap-4 gap-y-3 border border-solid border-gray-300 p-3">
                                    <legend class="text-xs">Business Address</legend>
                                    <div class="col-span-12 md:col-span-12">
                                        <FormLabel  htmlFor="modal-form-1"> House No./Street Name</FormLabel>
                                        <FormInput v-model="formBusiness.businessAddress" type="text"
                                        placeholder="House/Building No. / Room & Floor No./ Building Name" required/>
                                    </div>
                                  <!-- BEGIN: Search -->
                                    <div class="col-span-12 sm:col-span-12">
                                      <div class="col-span-12 sm:col-span-12">
                                        <FormLabel  htmlFor="modal-form-1"> SEARCH BARANGAY / CITY or Municipality / PROVINCE / REGION</FormLabel>
                                        <!-- <LocationDetails :address="formBusiness.businessBrgyAddress" @location-selected="handleLocationSelected" /> -->
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
                                    <div class="col-span-12 md:col-span-9">
                                        <FormLabel  htmlFor="modal-form-1"> Current BARANGAY / CITY or Municipality / PROVINCE / REGION</FormLabel>
                                        <FormInput v-model="formBusiness.businessBrgyAddress" type="text"
                                        placeholder="House/Building No. / Room & Floor No./ Building Name" readonly/>
                                    </div>
                                    <div class="col-span-12 sm:col-span-3">
                                      <FormLabel  htmlFor="modal-form-3"> District </FormLabel>
                                      <FormSelect v-model="formBusiness.businessZipcode" required>
                                          <option value="LONE">LONE</option>
                                          <option value="1ST">1ST</option>
                                          <option value="2ND">2ND</option>
                                          <option value="3RD">3RD</option>
                                          <option value="4TH">4TH</option>
                                          <option value="5TH">5TH</option>
                                          <option value="6TH">6TH</option>
                                          <option value="7TH">7TH</option>
                                          <option value="8TH">8TH</option>
                                      </FormSelect>
                                    </div>
                                    <div class="col-span-12 sm:col-span-3">
                                      <FormLabel  htmlFor="modal-form-3"> Province </FormLabel>
                                      <FormInput  v-model="formBusiness.businessProvince" type="text"
                                      placeholder="If applicable" readonly/>
                                    </div>
                                    <div class="col-span-12 sm:col-span-3">
                                      <FormLabel  htmlFor="modal-form-3"> City / Municipality </FormLabel>
                                      <FormInput  v-model="formBusiness.businessCity" type="text"
                                      placeholder="If applicable" readonly/>
                                    </div>
                                    <div class="col-span-12 sm:col-span-3">
                                      <FormLabel  htmlFor="modal-form-3"> Longitude </FormLabel>
                                      <FormInput  v-model="formBusiness.businessLongitude" type="text"
                                      placeholder="If applicable" required readonly/>
                                    </div>
                                    <div class="col-span-12 sm:col-span-3">
                                      <FormLabel  htmlFor="modal-form-3"> Latitude </FormLabel>
                                      <FormInput  v-model="formBusiness.businessLatitude" type="text"
                                      placeholder="If applicable" required readonly/>
                                    </div>
                                  </fieldset>
                                  <!-- <div class="col-span-12 md:col-span-6">
                                    <FormSwitch>
                                        <FormSwitch.Label htmlFor="checkbox-switch-7">
                                          Is the Office and Factory/Plant Address the same? &nbsp;
                                        </FormSwitch.Label>
                                        <FormSwitch.Input v-model="sameAddress" type="checkbox" class="mr-5"/>
                                      </FormSwitch>
                                  </div>
                                  <fieldset class="grid grid-cols-12 col-span-12 gap-4 gap-y-3 border border-solid border-gray-300 p-3">
                                    <legend class="text-xs">Plant Address</legend>
                                    <div class="col-span-12 md:col-span-4">
                                        <FormLabel  htmlFor="modal-form-1"> House No./Street Name</FormLabel>
                                        <FormInput v-model="formBusiness.plantAddress" type="text"
                                        placeholder="House/Building No. / Room & Floor No./ Building Name" :disabled="disAbled"/>
                                    </div>
                                    <div class="col-span-12 md:col-span-4">
                                      <div class="col-span-12 md:col-span-12">
                                          <FormLabel  htmlFor="modal-form-1"> Municipality or City / Barangay / Region  </FormLabel>
                                          <FormInput form-input-size="sm"
                                              type="text"
                                              placeholder="Search Address..."
                                              @focus="showSearchBrgyPlant"
                                              @blur="hideSearchBrgyPlant"
                                              v-model="addressSelectBus.plantAddress" :disabled="disAbled"
                                              @keyup.space="searchLeoPlant"
                                              @paste="searchLeoPlant"
                                          />
                                      </div>
                                      <TransitionRoot
                                          as="template"
                                          :show="brgyDropdownPlant"
                                          enter="transition-all ease-linear duration-150"
                                          enterFrom="mt-5 invisible opacity-0 translate-y-1"
                                          enterTo="mt-[3px] visible opacity-100 translate-y-0"
                                          entered="mt-[3px]"
                                          leave="transition-all ease-linear duration-150"
                                          leaveFrom="mt-[3px] visible opacity-100 translate-y-0"
                                          leaveTo="mt-5 invisible opacity-0 translate-y-1"
                                          >
                                          <div class="absolute right-100 z-50 mt-[3px]">
                                              <div class="w-auto p-5 box">
                                              <div class="mb-2 font-medium">List of Address</div>
                                                <button href="" class="w-full mb-5 flex items-center hover:bg-slate-400" type="button" v-for="item in brgySelect" :key="item.id" :value="item.id" @click="checkPlantBrgy(item)">
                                                  <div
                                                      class="flex items-center justify-center w-8 h-8 rounded-full bg-success/20 dark:bg-success/10 text-success"
                                                  >
                                                      <Lucide icon="MapPin" class="w-4 h-4" />
                                                  </div>
                                                  <div class="ml-3">{{item.address}}</div>
                                                </button>
                                              </div>
                                          </div>
                                        </TransitionRoot>
                                  </div>
                                    <div class="col-span-12 md:col-span-2">
                                        <FormLabel  htmlFor="modal-form-3"> Longitude </FormLabel>
                                        <FormInput v-model="formBusiness.plantLongitude" type="text"
                                        placeholder="If applicable" :disabled="disAbled"/>
                                    </div>
                                    <div class="col-span-12 md:col-span-2">
                                        <FormLabel  htmlFor="modal-form-3"> Latitude </FormLabel>
                                        <FormInput v-model="formBusiness.plantLatitude" type="text"
                                        placeholder="If applicable" :disabled="disAbled"/>
                                    </div> -->
                                    
                                  <!-- </fieldset> -->
                                  <fieldset class="grid grid-cols-12 col-span-12 gap-4 gap-y-3 border border-solid border-gray-300 p-3">
                                    <legend class="text-xs">Contact Details</legend>
                                    <div class="col-span-12 md:col-span-4">
                                        <FormLabel  htmlFor="modal-form-3"> Landline Number </FormLabel>
                                        <FormInput v-model="formBusiness.landlineNo" type="text"
                                        placeholder="If applicable"/>
                                    </div>
                                    <div class="col-span-12 md:col-span-4">
                                        <FormLabel  htmlFor="modal-form-3"> Mobile Number </FormLabel>
                                        <FormInput v-model="formBusiness.mobileNo" type="text"
                                        placeholder="If applicable"/>
                                    </div>
                                    <div class="col-span-12 md:col-span-4">
                                        <FormLabel  htmlFor="modal-form-3"> Fax Number </FormLabel>
                                        <FormInput v-model="formBusiness.faxNo" type="text"
                                        placeholder="If applicable"/>
                                    </div>
                                    <div class="col-span-12 md:col-span-6">
                                      <FormLabel  htmlFor="modal-form-3"> Website </FormLabel>
                                      <FormInput v-model="formBusiness.website" type="text"
                                      placeholder="If applicable"/>
                                    </div>
                                    <div class="col-span-12 md:col-span-6">
                                        <FormLabel  htmlFor="modal-form-3"> Email Address </FormLabel>
                                        <FormInput v-model="formBusiness.email" type="email"
                                        placeholder="If applicable"/>
                                    </div>
                                  </fieldset>
                                </div>
                                  <Button type="submit" variant="primary" elevated class="w-auto bg-primary float-right">
                                    <Lucide icon="Save" class="w-4 h-4 mr-2" />Save
                                  </Button>
                              </form>
                            </div>
                          </Tab.Panel>
                          <Tab.Panel class="leading-relaxed">
                            <form class="validate-form p-2" @submit.prevent="onAddBSocial">
                              <div class="col-span-12 md:col-span-12">
                                <Table sm striped>
                                  <Table.Thead>
                                    <Table.Tr>
                                      <Table.Th class="whitespace-nowrap w-auto"> Platform </Table.Th>
                                      <Table.Th class="whitespace-nowrap w-auto"> URL </Table.Th>
                                      <Table.Th class="w-1"></Table.Th>
                                    </Table.Tr>
                                  </Table.Thead>
                                  <Table.Tbody>
                                    <Table.Tr v-for="item in socialMedList" :key="item['id']" :value="item['id']" class="-p-10">
                                      <Table.Td>
                                          <div class="flex flex-wrap p-0">
                                            <Button :variant="item['platForm']" class="w-32 mb-2 mr-2" @click="redirectSocial(item['url'])">
                                              <Lucide :icon="capitalized(item['platForm'])" class="w-4 h-4 mr-2" />{{capitalized(item['platForm'])}}
                                            </Button>
                                          </div>
                                      </Table.Td>
                                      <Table.Td>{{item['url']}}</Table.Td>
                                      <Table.Td>
                                        <Button variant="danger" class="mb-2 mr-1" @click="removeSocial(item['id'])">
                                          <Lucide icon="Trash2" class="w-4 h-4" />
                                        </Button>
                                      </Table.Td>
                                    </Table.Tr>
                                    <Table.Tr>
                                      <Table.Td>
                                        <TomSelect
                                          v-model="selectSocialMed"
                                          :options="{
                                            placeholder: 'Select item below. If not exist please key it in.',
                                            persist: false,
                                            createOnBlur: true,
                                            create: true,
                                            maxItems:1
                                          }"
                                          class="w-full col-span-12 md:col-span-4" multiple required
                                        >
                                          <option :value="formSocialMedia.platForm">Please Select.....</option>
                                          <option value="facebook">Facebook</option>
                                          <option value="instagram">Instagram</option>
                                          <option value="twitter">Twitter</option>
                                          <option value="linkedin">Linkedin</option>
                                        </TomSelect>
                                      </Table.Td>
                                      <Table.Td>
                                        <FormInput form-input-size="sm" :rounded="rounded" v-model="formSocialMedia.url" 
                                        type="text" placeholder="SocMed URL" class="col-span-12 md:col-span-12" required/>
                                      </Table.Td>
                                      <Table.Td>
                                        <Button type="submit" variant="primary" class="mb-2 mr-1" v-if="formBusiness.id!=='0'">
                                          <Lucide icon="Plus" class="w-5 h-5" />
                                        </Button>
                                      </Table.Td>
                                    </Table.Tr>
                                  </Table.Tbody>
                                </Table>
                              </div>
                          </form>
                          </Tab.Panel>
                          <Tab.Panel class="leading-relaxed">
                            <form class="validate-form p-2" @submit.prevent="onAddEcommerce">
                                  <div class="col-span-12 md:col-span-12">
                                    <Table sm striped>
                                      <Table.Thead>
                                        <Table.Tr>
                                          <Table.Th class="whitespace-nowrap sm:w-40"> Platform </Table.Th>
                                          <Table.Th class="whitespace-nowrap w-auto sm:w-96"> URL </Table.Th>
                                          <Table.Th class="w-1"></Table.Th>
                                        </Table.Tr>
                                      </Table.Thead>
                                      <Table.Tbody>
                                        <Table.Tr v-for="item in ecommerceList" :key="item['id']" :value="item['id']" class="-p-10">
                                          <Table.Td>
                                              <div class="flex flex-wrap p-0">
                                                <Button :variant="item['platForm']" class="w-32 mb-2 mr-2">
                                                  <Lucide icon="ShoppingBag" class="w-4 h-4 mr-2" />{{item['platForm']}}
                                                </Button>
                                              </div>
                                          </Table.Td>
                                          <Table.Td>{{item['url']}}</Table.Td>
                                          <Table.Td>
                                            <Button variant="danger" class="mb-2 mr-1" @click="removeEcommerce(item['id'])" v-if="formBusiness.id!=='0'">
                                              <Lucide icon="Trash2" class="w-4 h-4" />
                                            </Button>
                                          </Table.Td>
                                        </Table.Tr>
                                        <Table.Tr>
                                          <Table.Td>
                                            <TomSelect
                                              v-model="selectEcommerce"
                                              :options="{
                                                placeholder: 'Select item below. If not exist please key it in.',
                                                persist: false,
                                                createOnBlur: true,
                                                create: true,
                                                maxItems:1
                                              }"
                                              class="w-full col-span-12 md:col-span-12" multiple required
                                            >
                                              <option :value="formEcommerce.platForm">Please Select.....</option>
                                              <option value="Shopee">Shopee</option>
                                              <option value="Lazada">Lazada</option>
                                            </TomSelect>
                                          </Table.Td>
                                          <Table.Td>
                                            <FormInput form-input-size="sm" :rounded="rounded" v-model="formEcommerce.url" 
                                            type="text" placeholder="SocMed URL" class="col-span-12 md:col-span-12" required/>
                                          </Table.Td>
                                          <Table.Td>
                                            <Button type="submit" variant="primary" class="mb-2 mr-1" v-if="formBusiness.id!=='0'">
                                              <Lucide icon="Plus" class="w-5 h-5" />
                                            </Button>
                                          </Table.Td>
                                        </Table.Tr>
                                      </Table.Tbody>
                                    </Table>
                                  </div>
                              </form>
                          </Tab.Panel>
                          <Tab.Panel class="leading-relaxed">
                            <form class="validate-form p-2" @submit.prevent="onAddBusinessOwner">
                              <div class="col-span-12 md:col-span-12">
                                <Table sm striped>
                                  <Table.Thead>
                                    <Table.Tr>
                                      <Table.Th class="whitespace-nowrap w-auto sm:w-96 min-w-min"> Name </Table.Th>
                                      <Table.Th class="whitespace-nowrap w-auto sm:w-96 min-w-min"> Designation </Table.Th>
                                      <Table.Th class="whitespace-nowrap w-auto sm:w-96 min-w-min"> Contact Number </Table.Th>
                                      <Table.Th class="whitespace-nowrap w-auto sm:w-96 min-w-min"> Email </Table.Th>
                                      <Table.Th class="w-1"></Table.Th>
                                    </Table.Tr>
                                  </Table.Thead>
                                  <Table.Tbody>
                                    <Table.Tr v-for="item in businessOwnerList" :key="item['id']" :value="item['id']" class="-p-10">
                                      <Table.Td>{{item['lname']}} </Table.Td>
                                      <Table.Td>{{item['designation']}}</Table.Td>
                                      <Table.Td>{{item['contactNo']}}</Table.Td>
                                      <Table.Td>{{item['email']}}</Table.Td>
                                      <Table.Td>
                                        <Button variant="danger" class="mb-2 mr-1" @click="removeBusinessOwner(item['id'])" v-if="formBusiness.id!=='0'">
                                          <Lucide icon="Trash2" class="w-4 h-4" />
                                        </Button>
                                      </Table.Td>
                                    </Table.Tr>
                                    <Table.Tr>
                                        <Table.Td>
                                          <FormInput form-input-size="sm" :rounded="rounded" v-model="formBusinessOwner.id" 
                                          type="text" placeholder="SocMed URL" class="col-span-12 md:col-span-12 hidden" required/>
                                          <!-- <FormLabel  htmlFor="modal-form-1"> Name </FormLabel> -->
                                          <FormInput  :rounded="rounded"  form-input-size="sm"
                                            v-model="formBusinessOwner.lname" type="text" placeholder="" 
                                            @focus="showSearchLname"
                                            @blur="hideSearchLname"
                                            required/>
                                          <TransitionRoot
                                            as="template"
                                            :show="lnameDropdown"
                                            enter="transition-all ease-linear duration-150"
                                            enterFrom="mt-5 invisible opacity-0 translate-y-1"
                                            enterTo="mt-[3px] visible opacity-100 translate-y-0"
                                            entered="mt-[3px]"
                                            leave="transition-all ease-linear duration-150"
                                            leaveFrom="mt-[3px] visible opacity-100 translate-y-0"
                                            leaveTo="mt-5 invisible opacity-0 translate-y-1"
                                            class="w-96-40 overflow-scroll"
                                          >
                                            <div class="absolute right-100 z-10 mt-[3px]">
                                              <div class="w-auto p-5 box">
                                                <div class="mb-2 font-medium">Client Name List</div>
                                                  <button href="" class="w-full mb-5 flex items-center hover:bg-slate-400" type="button" v-for="item in clientList" :key="item.id" :value="item.id" v-on:click="selectClient(item)">
                                                    <div
                                                      class="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20 dark:bg-success/10 text-success"
                                                    >
                                                      <Lucide icon="User" class="w-4 h-4" />
                                                    </div>
                                                    <div class="ml-3">{{item.lname + ", " + item.fname + " " + item.mname}}</div>
                                                  </button>
                                                </div>
                                            </div>
                                          </TransitionRoot>
                                        </Table.Td>
                                        <Table.Td>
                                          <FormInput form-input-size="sm" :rounded="rounded" v-model="formBusinessOwner.designation" 
                                          type="text" placeholder="Designation" class="col-span-12 md:col-span-12" required/>
                                        </Table.Td>
                                        <Table.Td>
                                          <FormInput form-input-size="sm" :rounded="rounded" v-model="formBusinessOwner.contactNo" 
                                          type="text" placeholder="Contact Nu,mber" class="col-span-12 md:col-span-12" required/>
                                        </Table.Td>
                                        <Table.Td>
                                          <FormInput form-input-size="sm" :rounded="rounded" v-model="formBusinessOwner.email" 
                                          type="text" placeholder="Email" class="col-span-12 md:col-span-12" required/>
                                        </Table.Td>
                                        <Table.Td>
                                          <Button type="submit" variant="primary" class="mb-2 mr-1" v-if="formBusiness.id!=='0'">
                                            <Lucide icon="Plus" class="w-5 h-5" />
                                          </Button>
                                        </Table.Td>
                                      </Table.Tr>
                                    </Table.Tbody>
                                  </Table>
                                </div>
                            </form>
                          </Tab.Panel>
                          <Tab.Panel class="leading-relaxed">
                            <div class="grid grid-cols-12 gap-12">
                              <div class="col-span-12 intro-y box lg:col-span-12">
                                <div class="p-2">
                                    <Assistance :business="formBusiness.id" :clientId="formBusiness.clientId" :encoded-date="formBusiness.encodedDate" />
                                </div>
                              </div>
                            </div>
                            <form class="validate-form p-2" @submit.prevent="onAddMarketPlan">
                              <div class="col-span-12 md:col-span-12">
                                <Table sm striped>
                                  <Table.Thead>
                                    <Table.Tr>
                                      <Table.Th class="whitespace-nowrap w-auto"> Interventions that DTI can provide to help you improve your Marketing Plan </Table.Th>
                                      <Table.Th class="whitespace-nowrap w-auto"> Specify </Table.Th>
                                      <Table.Th class="w-1"></Table.Th>
                                    </Table.Tr>
                                  </Table.Thead>
                                  <Table.Tbody>
                                    <Table.Tr v-for="item in marketPlanList" :key="item['id']" :value="item['id']" class="-p-10">
                                      <Table.Td>
                                          {{ item['marketPlan'] }}
                                      </Table.Td>
                                      <Table.Td>{{item['specific']}}</Table.Td>
                                      <Table.Td>
                                        <Button variant="danger" class="mb-2 mr-1" @click="removeMarketPlan(item['id'])">
                                          <Lucide icon="Trash2" class="w-4 h-4" />
                                        </Button>
                                      </Table.Td>
                                    </Table.Tr>
                                    <Table.Tr>
                                      <Table.Td>
                                        <TomSelect
                                          v-model="selectMarketPlan"
                                          :options="{
                                            placeholder: 'Select item below. If not exist please specify...',
                                            persist: false,
                                            createOnBlur: true,
                                            create: true,
                                            maxItems:1
                                          }"
                                          class="w-full col-span-12 md:col-span-6" multiple required
                                        >
                                          <option value="Marketing Assistance">Marketing Assistance</option>
                                          <option value="Market Promotion">Market Promotion</option>
                                          <option :value="formMarketPlan.marketPlan">{{formMarketPlan.marketPlan}}</option>
                                        </TomSelect>
                                      </Table.Td>
                                      <Table.Td>
                                        <FormInput form-input-size="sm" :rounded="rounded" v-model="formMarketPlan.specific" 
                                        type="text" placeholder="Please specify" class="col-span-12 md:col-span-6" required/>
                                      </Table.Td>
                                      <Table.Td>
                                        <Button type="submit" variant="primary" class="mb-2 mr-1" v-if="formBusiness.id!=='0'">
                                          <Lucide icon="Plus" class="w-5 h-5" />
                                        </Button>
                                      </Table.Td>
                                    </Table.Tr>
                                  </Table.Tbody>
                                </Table>
                              </div>
                          </form>
                          <hr class="p-2"/>
                          <form class="validate-form p-2" @submit.prevent="onAddMarketTraining">
                              <div class="col-span-12 md:col-span-12">
                                <Table sm striped>
                                  <Table.Thead>
                                    <Table.Tr>
                                      <Table.Th class="whitespace-nowrap w-auto"> What Trainings would you like to join? </Table.Th>
                                      <Table.Th class="whitespace-nowrap w-auto"> Target Year </Table.Th>
                                      <Table.Th class="w-1"></Table.Th>
                                    </Table.Tr>
                                  </Table.Thead>
                                  <Table.Tbody>
                                    <Table.Tr v-for="item in marketTrainingList" :key="item['id']" :value="item['id']" class="-p-10">
                                      <Table.Td>
                                          {{ item['training'] }}
                                      </Table.Td>
                                      <Table.Td>{{item['targetYear']}}</Table.Td>
                                      <Table.Td>
                                        <Button variant="danger" class="mb-2 mr-1" @click="removeMarketTraining(item['id'])">
                                          <Lucide icon="Trash2" class="w-4 h-4" />
                                        </Button>
                                      </Table.Td>
                                    </Table.Tr>
                                    <Table.Tr>
                                      <Table.Td>
                                        <TomSelect
                                          v-model="selectMarketTraining"
                                          :options="{
                                            placeholder: 'Select item below. If not exist please specify...',
                                            persist: false,
                                            createOnBlur: true,
                                            create: true,
                                            maxItems:1,
                                          }"
                                          class="w-full col-span-12 md:col-span-12" multiple required
                                        >
                                          <option value="Entrepreneurial Mind-setting/Development Seminars">Entrepreneurial Mind-setting/Development Seminars</option>
                                          <option value="Business Registration 101">Business Registration 101</option>
                                          <option value="Basics of Recordkeeping/Bookkeeping ">Basics of Recordkeeping/Bookkeeping </option>
                                          <option value="Food Safety Protocols and Good Manufacturing Practices">Food Safety Protocols and Good Manufacturing Practices</option>
                                          <option value="FDA (LTO-CPR) Licensing/Registration">FDA (LTO-CPR) Licensing/Registration</option>
                                          <option value="Packaging and Labelling of Products">Packaging and Labelling of Products</option>
                                          <option value="Training for Market Requirements (e.g. Halal, Kosher, etc.)">Training for Market Requirements (e.g. Halal, Kosher, etc.)</option>
                                          <option value="Branding/Brand Identity Development ">Branding/Brand Identity Development </option>
                                          <option value="Intellectual Property (IP) Rights Awareness & Registration ">Intellectual Property (IP) Rights Awareness & Registration </option>
                                          <option value="Visual Merchandising">Visual Merchandising</option>
                                          <option value="Retail Store Management">Retail Store Management</option>
                                          <option value="Digitalization Seminars">Digitalization Seminars</option>
                                          <option value="Digital Marketing/Use of Social Media and other Marketing Platforms">Digital Marketing/Use of Social Media and other Marketing Platforms</option>
                                          <option value="Subcontracting Partners for Innovation (SPIN) Program"></option>
                                          <option :value="formMarketTraining.training">{{formMarketTraining.training}}</option>
                                        </TomSelect>
                                      </Table.Td>
                                      <Table.Td>
                                        <FormInput form-input-size="sm" :rounded="rounded" v-model="formMarketTraining.targetYear" 
                                        type="number" placeholder="Please specify" class="col-span-12 md:col-span-12" required/>
                                      </Table.Td>
                                      <Table.Td>
                                        <Button type="submit" variant="primary" class="mb-2 mr-1" v-if="formBusiness.id!=='0'">
                                          <Lucide icon="Plus" class="w-5 h-5" />
                                        </Button>
                                      </Table.Td>
                                    </Table.Tr>
                                  </Table.Tbody>
                                </Table>
                              </div>
                          </form>
                          </Tab.Panel>
                          <!-- BEGIN: Product Information -->
                          <Tab.Panel>
                            <Tab.Group>
                              <Tab.List variant="link-tabs"
                                        class="flex-col justify-center text-center sm:flex-row lg:justify-start">
                                  <Tab :fullWidth="false">
                                      <Tab.Button class="flex items-center py-4 cursor-pointer">
                                          Product List
                                      </Tab.Button>
                                  </Tab>
                                  <Tab :fullWidth="false">
                                      <Tab.Button class="flex items-center py-4 cursor-pointer">
                                          Market Profile List
                                      </Tab.Button>
                                  </Tab>
                              </Tab.List>
                              <Tab.Panels class="mt-5">
                                <Tab.Panel class="leading-relaxed">
                                  <Product :business="formBusiness.id"/>
                                </Tab.Panel>
                                <Tab.Panel class="leading-relaxed">
                                  <MarketProfile :business="formBusiness.id"/>
                                </Tab.Panel>
                              </Tab.Panels>
                            </Tab.Group>
                          </Tab.Panel>
                          <!-- END: Product Information -->
                      </Tab.Panels>
                    </Tab.Group>
      <!-- END: Modal Content -->
</template>

<style scoped>
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