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
import { onMounted, ref, reactive, watch, provide, toRefs} from "vue";
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
        updateClientInfo, clientSubmit, patchClientInfo, formOrganization, orgList, selectOrganization, brgyId, selectedFromAddressDropdown} = useClient();

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

const sameAddress = ref(false);
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
  brgyId.value = addressSelect.addressName.split(", ")
  formClient.farmerId = currentClientId.value
  formClient.barangay = brgyId.value[0].trim()
  formClient.lgu = brgyId.value[1].trim()
  formClient.province = brgyId.value[2].trim()
  if(formClient.farmerId===""){
    formClient.farmerId = sessionStorage.getItem("office")+"-"+current_date+"-"+current_time
  }
  if(formClient.province===undefined){
    addressSelect.addressName = ""
    successNotification.value.showToast();
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
  formClient.gender = (formClient.prefix==='Mr.')?"MALE":"FEMALE"
  updateClientInfo(clientID.value,formClient).then();
      successNotification.value.showToast();
      messageDetail.value = "You successfully updated client profile..."
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
onMounted(async () => {
  getClientInfo(clientID.value);
  if(sessionStorage.getItem('userId') === null){
      router.push({ path:'/login'})
      sessionStorage.clear()
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
                                    <FormSelect form-select-size="sm"  v-model="formClient.prefix" required>
                                      <option value="MR.">MR.</option>
                                      <option value="MS.">Ms.</option>
                                      <option value="MRS.">MRS.</option>
                                    </FormSelect>
                                </div>
                                <div class="col-span-12 md:col-span-3">
                                    <FormLabel  htmlFor="modal-form-1"> Last Name </FormLabel>
                                    <FormInput form-input-size="sm"  :rounded="rounded" 
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
                                    <FormInput form-input-size="sm"  :rounded="rounded" 
                                    v-model="formClient.fname" type="text" placeholder="" required/>
                                </div>
                                <div class="col-span-12 md:col-span-3">
                                    <FormLabel htmlFor="modal-form-3">Middle Name</FormLabel>
                                    <FormInput form-input-size="sm"  :rounded="rounded" v-model="formClient.mname" 
                                        type="text" placeholder="M.I" />
                                </div>
                                <div class="col-span-12 md:col-span-1">
                                    <FormLabel htmlFor="modal-form-3"> Suffix </FormLabel>
                                    <FormInput form-input-size="sm"  :rounded="rounded" v-model="formClient.suffix" type="text" placeholder="Sr/Jr/III" />
                                </div>
                                <!-- <div class="col-span-12 md:col-span-2 hidden">
                                    <FormLabel htmlFor="modal-form-3"> Sex </FormLabel>
                                    <FormSelect form-select-size="sm"  v-model="formClient.gender" required>
                                      <option value="FEMALE">Female</option>
                                      <option value="MALE">Male</option>
                                      <option value="Other">Other</option>
                                    </FormSelect>
                                </div> -->
                                <div class="col-span-12 md:col-span-2">
                                    <FormLabel htmlFor="modal-form-3"> Civil Status </FormLabel>
                                    <FormSelect form-select-size="sm"  v-model="formClient.civilStatus" required>
                                        <option value="Single">Single</option>
                                        <option value="Married">Married</option>
                                        <option value="Widowed">Widowed</option>
                                        <option value="Legally Separated">Legally Separated</option>
                                    </FormSelect>
                                </div>
                                <div class="col-span-12 md:col-span-2">
                                    <FormLabel htmlFor="modal-form-3"> Social Classification </FormLabel>
                                    <FormSelect form-select-size="sm"  v-model="formClient.socialClassification" required>
                                        <option value="Abled">Abled</option>
                                        <option value="Indigenous Person">Indigenous Person</option>
                                        <option value="Differently-Abled (PWD)">Differently-Abled (PWD)</option>
                                        <option value="Senior Citizen">Senior Citizen</option>
                                    </FormSelect>
                                </div>
                                <div class="col-span-12 md:col-span-2">
                                    <FormLabel  htmlFor="modal-form-1"> Age </FormLabel>
                                    <FormSelect form-select-size="sm"  v-model="formClient.age" required>
                                        <option value="18 - 35 years old">18 - 35 years old</option>
                                        <option value="above 35 – below 60 years old">above 35 – below 60 years old</option>
                                        <option value="60 years old and  above">60 years old and  above</option>
                                    </FormSelect>
                                </div>
                                <div class="col-span-12 md:col-span-4">
                                  <FormLabel  htmlFor="modal-form-1"> Job Position </FormLabel>
                                  <FormInput form-input-size="sm"  :rounded="rounded" v-model="formClient.designation" type="text" placeholder=""/>
                                </div>
                                <div class="col-span-12 md:col-span-2">
                                  <FormLabel htmlFor="modal-form-3"> Are you an Investor </FormLabel>
                                  <FormSelect form-select-size="sm"  v-model="formClient.investor"
                                      @change="loadPriority()" required>
                                      <option value="Yes">Yes</option>
                                      <option value="No">No</option>
                                  </FormSelect>
                                </div>
                                <div class="col-span-12 md:col-span-4">
                                  <FormLabel  htmlFor="modal-form-1"> Are you a member of a organization/cooperative? </FormLabel>
                                  <TomSelect
                                        form-input-size="sm"
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
                                
                                <div class="col-span-12 md:col-span-4" v-if="formClient.investor==='Yes'">
                                    <FormLabel  htmlFor="modal-form-1"> Priority Industry </FormLabel>
                                    <TomSelect
                                          form-input-size="sm"
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
                                    <div class="col-span-12 md:col-span-6">
                                        <FormLabel  htmlFor="modal-form-1"> House No./Street Name</FormLabel>
                                        <FormInput form-input-size="sm"  v-model="formClient.address" type="text"
                                        placeholder="House/Building No. / Room & Floor No./ Building Name" required/>
                                    </div>
                                    <div class="col-span-12 md:col-span-3">
                                        <FormLabel  htmlFor="modal-form-3"> Longitude </FormLabel>
                                        <FormInput form-input-size="sm"  v-model="formClient.longitude" type="text"
                                        placeholder="If applicable"/>
                                    </div>
                                    <div class="col-span-12 md:col-span-3">
                                        <FormLabel  htmlFor="modal-form-3"> Latitude </FormLabel>
                                        <FormInput form-input-size="sm"  v-model="formClient.latitude" type="text"
                                        placeholder="If applicable"/>
                                    </div>
                                    <!-- BEGIN: Search -->
                                    <div class="col-span-12 md:col-span-12">
                                        <div class="col-span-12 md:col-span-3">
                                        <FormLabel  htmlFor="modal-form-1">  Municipality or City / Barangay / Region / Country  </FormLabel>
                                        <FormInput form-input-size="sm"
                                            type="text"
                                            placeholder="Search Municipality or City..."
                                            @focus="showSearchBrgy"
                                            @blur="hideSearchBrgy"
                                            v-model="addressSelect.addressName"
                                            @keyup.space="searchLeo"
                                            @paste="searchLeo"
                                            required
                                        />
                                    </div>
                                        <TransitionRoot
                                        as="template"
                                        :show="brgyDropdown"
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
                                            <div class="mb-5 hover:bg-slate-400" v-for="item in brgySelect" :key="item['id']" :value="item['id']" @click="checkBa(item)">
                                                <button href="" class="flex items-center" type="button">
                                                <div
                                                    class="flex items-center justify-center w-8 h-8 rounded-full bg-success/20 dark:bg-success/10 text-success"
                                                >
                                                    <Lucide icon="MapPin" class="w-4 h-4" />
                                                </div>
                                                <div class="ml-3">{{item['address']}}</div>
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
                                    <div class="col-span-12 md:col-span-3">
                                        <FormLabel  htmlFor="modal-form-3"> Landline Number </FormLabel>
                                        <FormInput form-input-size="sm"  v-model="formClient.telNo" type="text"
                                        placeholder="If applicable"/>
                                    </div>
                                    <div class="col-span-12 md:col-span-3">
                                        <FormLabel  htmlFor="modal-form-3"> Mobile Number </FormLabel>
                                        <FormInput form-input-size="sm"  v-model="formClient.mobileNo" type="text"
                                        placeholder="If applicable"/>
                                    </div>
                                    <div class="col-span-12 md:col-span-3">
                                        <FormLabel  htmlFor="modal-form-3"> Fax Number </FormLabel>
                                        <FormInput form-input-size="sm"  v-model="formClient.faxNo" type="text"
                                        placeholder="If applicable"/>
                                    </div>
                                    <div class="col-span-12 md:col-span-3">
                                        <FormLabel  htmlFor="modal-form-3"> Email Address </FormLabel>
                                        <FormInput form-input-size="sm"  v-model="formClient.email" type="email"
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
