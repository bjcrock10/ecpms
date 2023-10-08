<script setup lang="ts">
import _ from "lodash";
import Button from "../../base-components/Button";
import { FormSwitch, FormInput, FormSelect, InputGroup, FormLabel, FormTextarea} from "../../base-components/Form";
import Lucide from "../../base-components/Lucide";
import TomSelect from "../../base-components/TomSelect";
import LocationDataService from "../../services/LocationDataService";
import BusinessDataService from "../../services/BuisinessDataService";
import ResponseData from "../../types/response";
import { TransitionRoot } from "@headlessui/vue";
import { useBusiness } from "../../types/business";
import { useRouter } from "vue-router";
import { onMounted, ref, reactive, watch, provide, toRefs, computed} from "vue";
import Notification from "../../base-components/Notification";
import { NotificationElement } from "../../base-components/Notification";
import Toastify from "toastify-js";
import { createIcons, icons } from "lucide";
import { useClient } from "../../types/client";

const router = useRouter();
const {formBusiness, formBusinessOwner, formEcommerce, formSocialMedia, hideSearchBrgyBusiness, hideSearchBrgyPlant, 
        showSearchBrgyBusiness, showSearchBrgyPlant, brgyDropdownBusiness, brgyDropdownPlant, addressSelectBus,
      checkBusinessBrgy, checkPlantBrgy, businessID, businessSubmit, getBusinessInfo, 
      selectBusinessOwner, selectLineOfBusiness, selectStandardCertification, selectSocialMed, selectEcommerce, 
      selectBOwner, showSearchBusiness, hideSearchBusiness, businessList, businessDropdown} = useBusiness();
const {message, messageDetail,patchClientInfo, brgySelect} = useClient();
const tableClient = ref<HTMLDivElement>();
const successNotification = ref();
provide("bind[successNotification]", (el: any) => {
  // Binding
  successNotification.value = el;
  });
interface Client {
    clientId?: any;
    business?: any;
}
const props = defineProps<Client>();
const clientID = props.clientId;
const sameAddress = ref(false);
const disAbled = ref(false);
const rounded = ref(false);
watch(sameAddress, (sameAddress, prevAddProjectModal) => {
  if(sameAddress===true){
    formBusiness.plantAddress = formBusiness.businessAddress
    formBusiness.plantBrgy = formBusiness.businessBrgy
    formBusiness.plantCity = formBusiness.businessCity
    formBusiness.plantProvince = formBusiness.businessProvince
    formBusiness.plantLatitude = formBusiness.businessLatitude
    formBusiness.plantLongitude = formBusiness.businessLongitude
    addressSelectBus.plantAddress = addressSelectBus.businessAddress
    disAbled.value = true
  }
  else{
    formBusiness.plantAddress = ""
    formBusiness.plantBrgy = ""
    formBusiness.plantCity = ""
    formBusiness.plantLatitude = ""
    formBusiness.plantLongitude = ""
    addressSelectBus.plantAddress = ""
    formBusiness.plantProvince = ""
    disAbled.value = false
  }
  
})
watch(
  () => (addressSelectBus.businessAddress), async(address, prevToe) => {
    if(address.length>4){
        LocationDataService.getBarangayVal(address).then((response: ResponseData)=>{
        brgySelect.value = response.data
        }).catch((e: Error)=>{
          console.log(brgySelect.value)
        })
      }
    }
)
watch(
  () => (addressSelectBus.plantAddress), async(address, prevToe) => {
    if(address.length>4){
        LocationDataService.getBarangayVal(address).then((response: ResponseData)=>{
        brgySelect.value = response.data
        }).catch((e: Error)=>{
          console.log(brgySelect.value)
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

const loadBusiness = () => {
  getBusinessInfo(props.business)
}

const onAddBusiness = async () => {
  formBusiness.businessOwnership = selectBusinessOwner.value.toString();
  formBusiness.lineOfBusiness = selectLineOfBusiness.value.toString();
  formBusiness.standardCertification = selectStandardCertification.value.toString();
  formBusiness.plantBrgyAddress = addressSelectBus.plantAddress
  formBusiness.businessBrgyAddress = addressSelectBus.businessAddress
  if(props.business==="0"){
    BusinessDataService.create(formBusiness).then((response: ResponseData)=>{
      businessID.value = response.data.id
      patchClientInfo(clientID.value,{'businessId':businessID.value})
      successNotification.value.showToast();
      messageDetail.value = "You successfully business profile with a Business ID "+businessID.value
    }).catch((e:Error)=>{
      console.log(e.message)
    })
  }else{
    BusinessDataService.update(props.business, formBusiness).then((response: ResponseData)=>{
      businessID.value = response.data.id
      patchClientInfo(clientID.value,{'businessId':businessID.value})
      successNotification.value.showToast();
      messageDetail.value = "You successfully updated business profile with a Business ID "+businessID.value
    }).catch((e:Error)=>{
      console.log(e.message)
    })
  }
}
const selectOwner = (item:any)=>{
  formBusiness.businessName = item.businessName
  formBusiness.yearEstablished = item.yearEstablished
  selectBusinessOwner.value = ([item.businessOwnership])
  selectLineOfBusiness.value =  ([item.lineOfBusiness])
  selectStandardCertification.value =  ([item.standardCertification])
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
}
onMounted(async () => {
  if(sessionStorage.getItem('userId') === null){
      router.push({ path:'/login'})
      sessionStorage.clear()
    }
  if(sessionStorage.getItem("privileges")==="0"){
    successNotification.value.showToast();
    message.value = "Redirecting...."
    messageDetail.value = "You don't have access to this page. Redirecting you the landing page."
    router.push({path: "/dashboard"});
  }
  loadBusiness();
});
const capitalized = (item: any) =>{
  const capitalizedFirst = item[0].toUpperCase();
  const rest = item.slice(1);

  return capitalizedFirst.trim() + rest.trim();
}
</script>

<template>
<div class="flex items-center mt-8 intro-y">
    <h2 class="mr-auto text-lg font-medium">Profile Layout</h2>
</div>
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
        <form class="validate-form" @submit.prevent="onAddBusiness">
            <div class="grid grid-cols-12 col-span-12 gap-4 gap-y-3">
                <div class="col-span-12 md:col-span-8">
                    <FormLabel htmlFor="modal-form-2">Registered Business Name</FormLabel>
                    <FormInput form-input-size="sm"  :rounded="rounded" 
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
                        <button href="" class="flex items-center" type="button">
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
                <FormInput form-input-size="sm"  :rounded="rounded" v-model="formBusiness.yearEstablished" 
                    type="number" placeholder="" />
                </div>
                <div class="col-span-12 md:col-span-8">
                <FormLabel htmlFor="modal-form-3">Business Ownership</FormLabel>
                <TomSelect
                    v-model="selectBusinessOwner"
                    :options="{
                    placeholder: 'Select item below. If not exist please key it in.',
                    persist: false,
                    createOnBlur: true,
                    create: true,
                    maxItems:1
                    }"
                    class="w-full" multiple
                >
                    <option value="Sole Proprietorship">Sole Proprietorship</option>
                    <option value="Partnership/Corporation">Partnership/Corporation</option>
                    <option value="Cooperative">Cooperative</option>
                    <option value="Association">Association (DOLE Registration No. _____________)</option>
                    <option :value="formBusiness.businessOwnership">{{formBusiness.businessOwnership}}</option>
                </TomSelect>
                </div>
                <div class="col-span-12 md:col-span-4">
                <FormLabel htmlFor="modal-form-3">Main Line of Business</FormLabel>
                <TomSelect
                    v-model="selectLineOfBusiness"
                    :options="{
                    placeholder: 'Select item below. If not exist please key it in.',
                    persist: false,
                    createOnBlur: true,
                    create: true,
                    maxItems:1
                    }"
                    class="w-full" multiple
                >
                    <option value="Farming">Farming</option>
                    <option value="Manufacturing/Processing">Manufacturing/Processing</option>
                    <option value="Trader/Consolidator">Trader/Consolidator</option>
                    <option :value="formBusiness.lineOfBusiness">{{formBusiness.lineOfBusiness}}</option>
                </TomSelect>
                </div>
                <div class="col-span-12 md:col-span-8">
                <FormLabel htmlFor="modal-form-3">Standard Certification/Accreditation</FormLabel>
                <TomSelect
                    v-model="selectStandardCertification"
                    :options="{
                    placeholder: 'Select item below. If not exist please key it in.',
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
                    <option value="Micro (3M below)">Micro (3M below)</option>
                    <option value="Small (3M – 15M)">Small (3M – 15M)</option>
                    <option value="Cooperative (15M – 100M)">Cooperative (15M – 100M)</option>
                    <option value="Association (100M above)">Association (100M above)</option>
                    </FormSelect>
                </div>
                <div class="col-span-12 md:col-span-3">
                <FormLabel htmlFor="modal-form-3"> No. of Outlet </FormLabel>
                <FormInput form-input-size="sm"  v-model="formBusiness.noOutlets" type="number"
                    placeholder="" required/>
                </div>
                <div class="col-span-12 md:col-span-3">
                <FormLabel htmlFor="modal-form-3"> No. of Employees </FormLabel>
                <FormSelect form-select-size="sm"  v-model="formBusiness.noEmployee" required>
                    <option value="1-9">1-9</option>
                    <option value="10-99">10-99</option>
                    <option value="100-199">100-199</option>
                    <option value="200 and above">200 and above</option>
                </FormSelect>
                </div>
                <div class="col-span-12 md:col-span-3">
                <FormLabel  htmlFor="modal-form-3"> No. of Male </FormLabel>
                <FormInput form-input-size="sm"  v-model="formBusiness.noOfMaleEmployee" type="text"
                placeholder="If applicable"/>
                </div>
                <div class="col-span-12 md:col-span-3">
                <FormLabel  htmlFor="modal-form-3"> No. of Female </FormLabel>
                <FormInput form-input-size="sm"  v-model="formBusiness.noOfFemaleEmployee" type="text"
                placeholder="If applicable"/>
                </div>
                <fieldset class="grid grid-cols-12 col-span-12 gap-4 gap-y-3 border border-solid border-gray-300 p-3">
                <legend class="text-xs">Business Address</legend>
                <div class="col-span-12 md:col-span-6">
                    <FormLabel  htmlFor="modal-form-1"> House No./Street Name</FormLabel>
                    <FormInput form-input-size="sm"  v-model="formBusiness.businessAddress" type="text"
                    placeholder="House/Building No. / Room & Floor No./ Building Name" required/>
                </div>
                <div class="col-span-12 md:col-span-3">
                    <FormLabel  htmlFor="modal-form-3"> Longitude </FormLabel>
                    <FormInput form-input-size="sm"  v-model="formBusiness.businessLongitude" type="text"
                    placeholder="If applicable"/>
                </div>
                <div class="col-span-12 md:col-span-3">
                    <FormLabel  htmlFor="modal-form-3"> Latitude </FormLabel>
                    <FormInput form-input-size="sm"  v-model="formBusiness.businessLatitude" type="text"
                    placeholder="If applicable"/>
                </div>
                <!-- BEGIN: Search -->
                <div class="col-span-12 md:col-span-12">
                    <div class="col-span-12 md:col-span-3">
                        <FormLabel  htmlFor="modal-form-1"> Barangay  </FormLabel>
                        <FormInput form-input-size="sm"
                            type="text"
                            placeholder="Search Barangay..."
                            @focus="showSearchBrgyBusiness"
                            @blur="hideSearchBrgyBusiness"
                            v-model="addressSelectBus.businessAddress"
                        />
                    </div>
                    <TransitionRoot
                    as="template"
                    :show="brgyDropdownBusiness"
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
                        <div class="mb-2 font-medium">List of Barangay</div>
                        <div class="mb-5 hover:bg-slate-400" v-for="item in brgySelect" :key="item.id" :value="item.id" @click="checkBusinessBrgy(item)">
                            <button href="" class="flex items-center" type="button">
                            <div
                                class="flex items-center justify-center w-8 h-8 rounded-full bg-success/20 dark:bg-success/10 text-success"
                            >
                                <Lucide icon="MapPin" class="w-4 h-4" />
                            </div>
                            <div class="ml-3">{{item.address}}</div>
                            </button>
                        </div>
                        </div>
                    </div>
                    </TransitionRoot>
                </div>
                <!-- END: Search -->
                </fieldset>
                <div class="col-span-12 md:col-span-6">
                <FormSwitch>
                    <FormSwitch.Label htmlFor="checkbox-switch-7">
                        Is the Office and Factory/Plant Address the same? &nbsp;
                    </FormSwitch.Label>
                    <FormSwitch.Input v-model="sameAddress" type="checkbox" class="mr-5"/>
                    </FormSwitch>
                </div>
                <fieldset class="grid grid-cols-12 col-span-12 gap-4 gap-y-3 border border-solid border-gray-300 p-3">
                <legend class="text-xs">Plant Address</legend>
                <div class="col-span-12 md:col-span-6">
                    <FormLabel  htmlFor="modal-form-1"> House No./Street Name</FormLabel>
                    <FormInput form-input-size="sm"  v-model="formBusiness.plantAddress" type="text"
                    placeholder="House/Building No. / Room & Floor No./ Building Name" required :disabled="disAbled"/>
                </div>
                <div class="col-span-12 md:col-span-3">
                    <FormLabel  htmlFor="modal-form-3"> Longitude </FormLabel>
                    <FormInput form-input-size="sm"  v-model="formBusiness.plantLongitude" type="text"
                    placeholder="If applicable" :disabled="disAbled"/>
                </div>
                <div class="col-span-12 md:col-span-3">
                    <FormLabel  htmlFor="modal-form-3"> Latitude </FormLabel>
                    <FormInput form-input-size="sm"  v-model="formBusiness.plantLatitude" type="text"
                    placeholder="If applicable" :disabled="disAbled"/>
                </div>
                <!-- BEGIN: Search -->
                <div class="col-span-12 md:col-span-12">
                    <div class="col-span-12 md:col-span-3">
                        <FormLabel  htmlFor="modal-form-1"> Barangay  </FormLabel>
                        <FormInput form-input-size="sm"
                            type="text"
                            placeholder="Search Barangay..."
                            @focus="showSearchBrgyPlant"
                            @blur="hideSearchBrgyPlant"
                            v-model="addressSelectBus.plantAddress" :disabled="disAbled"
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
                            <div class="mb-2 font-medium">List of Barangay</div>
                            <div class="mb-5 hover:bg-slate-400" v-for="item in brgySelect" :key="item.id" :value="item.id" @click="checkPlantBrgy(item)">
                                <button href="" class="flex items-center" type="button">
                                <div
                                    class="flex items-center justify-center w-8 h-8 rounded-full bg-success/20 dark:bg-success/10 text-success"
                                >
                                    <Lucide icon="MapPin" class="w-4 h-4" />
                                </div>
                                <div class="ml-3">{{item.address}}</div>
                                </button>
                            </div>
                            </div>
                        </div>
                        </TransitionRoot>
                </div>
                <!-- END: Search -->
                </fieldset>
                <fieldset class="grid grid-cols-12 col-span-12 gap-4 gap-y-3 border border-solid border-gray-300 p-3">
                <legend class="text-xs">Contact Details</legend>
                <div class="col-span-12 md:col-span-4">
                    <FormLabel  htmlFor="modal-form-3"> Landline Number </FormLabel>
                    <FormInput form-input-size="sm"  v-model="formBusiness.landlineNo" type="text"
                    placeholder="If applicable"/>
                </div>
                <div class="col-span-12 md:col-span-4">
                    <FormLabel  htmlFor="modal-form-3"> Mobile Number </FormLabel>
                    <FormInput form-input-size="sm"  v-model="formBusiness.mobileNo" type="text"
                    placeholder="If applicable"/>
                </div>
                <div class="col-span-12 md:col-span-4">
                    <FormLabel  htmlFor="modal-form-3"> Fax Number </FormLabel>
                    <FormInput form-input-size="sm"  v-model="formBusiness.faxNo" type="text"
                    placeholder="If applicable"/>
                </div>
                <div class="col-span-12 md:col-span-6">
                    <FormLabel  htmlFor="modal-form-3"> Website </FormLabel>
                    <FormInput form-input-size="sm"  v-model="formBusiness.website" type="text"
                    placeholder="If applicable"/>
                </div>
                <div class="col-span-12 md:col-span-6">
                    <FormLabel  htmlFor="modal-form-3"> Email Address </FormLabel>
                    <FormInput form-input-size="sm"  v-model="formBusiness.email" type="email"
                    placeholder="If applicable"/>
                </div>
                </fieldset>
            </div>
            <Button type="submit" variant="primary" elevated class="w-auto bg-primary float-right">
                <Lucide icon="Save" class="w-4 h-4 mr-2" />Save
            </Button>
</form>
</template>
