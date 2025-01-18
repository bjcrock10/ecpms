<script setup lang="ts">
import Lucide from "../../base-components/Lucide";
import { Menu, Dialog, Tab } from "../../base-components/Headless";
import Button from "../../base-components/Button";
import { onMounted, ref, reactive, watch, provide, toRefs, nextTick, onUnmounted} from "vue";
import { FormInput, FormSelect, InputGroup, FormLabel, FormTextarea, FormSwitch} from "../../base-components/Form";
import Tippy from "../../base-components/Tippy";
import TomSelect from "../../base-components/TomSelect";
import ClientDataService from '../../services/ClientDataService';
import LocationDataService from "../../services/LocationDataService";
import OrganizationDataService from "../../services/Organization";
import ResponseData from "../../types/response.d";
import { TransitionRoot } from "@headlessui/vue";
import { useClient } from "../../types/client.d";
import { tabulatorFunc } from "../../types/tabulator.d";
import Notification from "../../base-components/Notification";
import { NotificationElement } from "../../base-components/Notification";
import Toastify from "toastify-js";
import { createIcons, icons } from "lucide";
import { useRouter } from "vue-router";
import LoadingIcon from "../../base-components/LoadingIcon";
import CodeBook from "../../services/CodeBook";
import Client from "../../components/Client/Client.vue";
import SearchBusiness from "../../components/BusinessSearch/SearchBusiness.vue"
import axios from "axios"
import LocationDetails from "../../components/Location/LocationDetails.vue";

const router = useRouter();
const {formClient, errorMessage, isError, columnData, addModal, rounded,  brgyDropdown,
        lnameDropdown, showSearchBrgy, hideSearchBrgy, showSearchLname, hideSearchLname, 
        message, messageDetail, buttonTitle, buttonIcon, setAddModal, select, brgy, sendButtonRef, ncfrs, tenurial,
        accreditation, organization, disNcfrs, disTenurial, disAccreditation, disOrganization, brgySelect, citySelect,
        clientList, addressSelect, checkBa, aNcfrs, dTenurial, dOrganization, dAccreditation, brgyId, formOrganization, 
        setAddModalSearch,addModalSearch,orgList, selectOrganization,selectedFromAddressDropdown} = useClient();
const {initTabulator, reInitOnResizeWindow, 
filter, onFilter, 
onExportCsv, onExportHtml, 
onExportJson, onExportXlsx, 
onPrint, onResetFilter, tabulator, loadingIcon} = tabulatorFunc();
const tableClient = ref<HTMLDivElement>();
const successNotification = ref();

provide("bind[successNotification]", (el: any) => {
  // Binding
  successNotification.value = el;
  });

  const searchLeo = () => {
  if(addressSelect.addressName.length>4){
        LocationDataService.getBarangayVal(addressSelect.addressName).then((response: ResponseData)=>{
        brgySelect.value = response.data
        }).catch((e: Error)=>{
          console.log(citySelect.value)
        })
      }
}

const onSubmit = () => {
  if(selectedFromAddressDropdown.value ===true){
    // brgyId.value = addressSelect.addressName.split(", ")
    // formClient.farmerId = currentClientId.value
    // formClient.lgu = brgyId.value[0].trim()
    // formClient.barangay = brgyId.value[1].trim()
    // formClient.province = brgyId.value[2].trim()
    if(formClient.province===undefined){
      addressSelect.addressName = ""
      successNotification.value.showToast();
      messageDetail.value = "Error Occured, Please Select a proper Barangay/City or Municipality/Province"
      return
    }
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
    formClient.address.toUpperCase().trim();
    formClient.barangay.toUpperCase().trim();
    formClient.ipGroup = selectOrganization.value.toString().toUpperCase()
    formOrganization.title = selectOrganization.value.toString().toUpperCase()
    OrganizationDataService.create(formOrganization).then((response: ResponseData)=>{
          formClient.organization = response.data.id
    }).catch((e: Error)=>{
      console.log(e.message)
    })
    OrganizationDataService.findByTitle(formClient.ipGroup).then((response: ResponseData)=>{
      if(response.data.length<0){
        OrganizationDataService.create(formOrganization).then((response: ResponseData)=>{
              formClient.organization = response.data.id
        }).catch((e: Error)=>{
          console.log(e.message)
        })
      }
      else{
        formClient.organization = response.data[0].id
      }
  })
  formClient.gender = (formClient.prefix==='Mr.')?"MALE":"FEMALE"
    ClientDataService.create(formClient).then((response: ResponseData)=>{
        successNotification.value.showToast();
        addModal.value = false
        messageDetail.value = "You successfully created client profile redirecting you to the profile page..."
        router.push({path:`/client/${response.data.id}`})
      }).catch((e : Error)=>{
        message.value = "Error occurred!!!"
        messageDetail.value = e.message.toString()
        formClient.fullName = formClient.lname.toUpperCase();
        setAddModalSearch(true);
      })
  }else{
    alert("Please select a valid address from the dropdown....")
  }
};
watch(addModal,(addModal, oldAdm)=> {
  if(addModal === false){
    formClient.id = "0";
  }else if(formClient.id!=="0"){
    buttonTitle.value = "Update"
    buttonIcon.value = "Edit"
  }
});
// watch(
//   () => (addressSelect.addressName), async(address, prevToe) => {
//     if(address.length>2){
//         LocationDataService.getBarangayVal(address).then((response: ResponseData)=>{
//         brgySelect.value = response.data
//         }).catch((e: Error)=>{
//           console.log(citySelect.value)
//         })
//       }
//     }
// )
// watch(
//   () => (formClient.fname), async(lname, prevToe) => {
//     if(lname.length>=2){
//         lname = formClient.lname + ", " + lname
//         ClientDataService.findByLname(lname).then((response: ResponseData)=>{
//           clientList.value = response.data
//         }).catch((e: Error)=>{
//           console.log(clientList.value)
//         })
//       }
//     }
// )
const showSearchLnamewithParam = async () => {
  lnameDropdown.value = true
  // ClientDataService.findByLname(formClient.lname+", "+formClient.fname+" "+formClient.mname)
  //   .then((response: ResponseData)=>{
  //       clientList.value = response.data
  //     }).catch((e: Error)=>{
  //       console.log(clientList.value)
  //     })
}
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
const priorityIndustry = ref([]);
const currentClientId = ref();

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
  if(locationDetails.lat===0){
    selectedFromAddressDropdown.value = false
  }else{
    selectedFromAddressDropdown.value = true
  }
  
};
// End Search address
onMounted(async () => {
  nextTick(() => {
    initTabulator(columnData.value, ClientDataService, tableClient);
    reInitOnResizeWindow();
    ClientDataService.getAll().then((resp: ResponseData)=>{
      currentClientId.value = sessionStorage.getItem('office') + resp.data.length.toString()
    })
  })
  tabulator.value?.on("rowClick",(e, cell)=>{
    const id = cell.getData().id
    router.push({path:`/client/${id}`, params:{id}})
  })
  if(sessionStorage.getItem('userId') === null){
      router.push({ path:'/login'})
      sessionStorage.clear()
    }
});
</script>
<template>
  <div class="flex flex-col items-center mt-8 intro-y sm:flex-row">
    <h2 class="mr-auto text-lg font-medium">Client Profile</h2>
    <div class="flex w-full mt-4 sm:w-auto sm:mt-0">
      <Button class="mr-2 shadow-md" as="a" href="#" variant="primary" @click="(event: MouseEvent) => {
          event.preventDefault();
          setAddModal(true);
        }">
        Add New Client Profile
      </Button>
      <Button class="mr-2 shadow-md" as="a" href="#" variant="success" @click="(event: MouseEvent) => {
          event.preventDefault();
          setAddModalSearch(true);
        }">
        Search Client
      </Button>
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
        </div>s
        </Notification>
    <!-- END: Notification Content -->
    <!-- Search Modal -->
      <Dialog size="2xl" :open="addModalSearch" @close="
                        () => {
                          setAddModalSearch(false);
                        }
                      " :initialFocus="sendButtonRef"
                      :draggable="true">
          <Dialog.Panel class="z-40 top-0 left-0 w-full h-full outline-none overflow-x-hidden overflow-y-auto">
              <Dialog.Title>
                  <h2 class="mr-auto text-base font-medium">
                      Client Profile
                  </h2>
                  <button type="button" variant="outline-secondary" @click="
                            () => {
                              setAddModalSearch(false);
                            }
                          " class="w-auto mr-1">
                          <Lucide icon="XSquare" class="w-4 h-4 mr-2" />
                  </button>
              </Dialog.Title>
              <Dialog.Description class="text-xs">
                <Tab.Group>
                  <Tab.List
                    variant="link-tabs"
                    class="flex-col justify-center text-center sm:flex-row lg:justify-start"
                  >
                      <Tab :fullWidth="false">
                          <Tab.Button class="flex items-center py-4 cursor-pointer">
                            <Lucide icon="User" class="w-4 h-4 mr-2" /> Search by Client Information
                          </Tab.Button>
                      </Tab>
                      <Tab :fullWidth="false">
                          <Tab.Button class="flex items-center py-4 cursor-pointer">
                            <Lucide icon="Shield" class="w-4 h-4 mr-2" /> Search by Business Information
                          </Tab.Button>
                      </Tab>
                  </Tab.List>
                  <Tab.Panels class="mt-5 intro-y">
                      <Tab.Panel>
                        <Client :clientName="formClient.fullName"/>
                      </Tab.Panel>
                      <Tab.Panel>
                        <SearchBusiness :businessName='0'/>
                      </Tab.Panel>
                  </Tab.Panels>
                </Tab.Group>
              </Dialog.Description>
          </Dialog.Panel>
      </Dialog>
    <!-- END: Search Modal -->
      <!-- BEGIN: Modal Content -->
      <Dialog size="2xl" :open="addModal" @close="
                      () => {
                        setAddModal(false);
                      }
                    " :initialFocus="sendButtonRef"
                    :draggable="true">
        <Dialog.Panel class="z-40 top-0 left-0 w-full h-full outline-none overflow-x-hidden overflow-y-auto">
            <Dialog.Title>
                <h2 class="mr-auto text-base font-medium">
                    Client Profile
                </h2>
                <button type="button" variant="outline-secondary" @click="
                          () => {
                            setAddModal(false);
                          }
                        " class="w-auto mr-1">
                        <Lucide icon="XSquare" class="w-4 h-4 mr-2" />
                </button>
            </Dialog.Title>
            <form class="validate-form" @submit.prevent="onSubmit">
              <Dialog.Description class="text-xs">
                <div class="grid grid-cols-12 col-span-12 gap-4 gap-y-3 p-2">
                  <fieldset class="grid grid-cols-12 col-span-12 gap-4 gap-y-3 
                        border border-solid border-gray-300 p-2">
                        <legend class="text-sm font-bold">Personal Information</legend>
                        <div class="col-span-12 sm:col-span-1">
                          <FormLabel htmlFor="modal-form-3"> Prefix<span class="requiredTag"> *</span></FormLabel>
                          <FormSelect form-select-size="sm"  v-model="formClient.prefix" required>
                            <option value="MR.">MR.</option>
                            <option value="MS.">Ms.</option>
                            <option value="MRS.">MRS.</option>
                          </FormSelect>
                        </div>
                        <div class="col-span-12 sm:col-span-4">
                          <FormLabel htmlFor="modal-form-2"> Last Name<span class="requiredTag"> *</span> </FormLabel>
                          <FormInput  :rounded="rounded" 
                            v-model="formClient.lname" type="text" placeholder="Required Fields *" 
                            v-focus 
                            @blur="
                                () => {
                                  loadOrganization();
                            }" required/>
                        </div>
                        <div class="col-span-12 sm:col-span-3">
                            <FormLabel  htmlFor="modal-form-1"> First Name<span class="requiredTag"> *</span> </FormLabel>
                            <FormInput  :rounded="rounded" 
                              v-model="formClient.fname" type="text" placeholder="Required Fields *" @focus="showSearchLnamewithParam"
                              @blur="hideSearchLname"
                              required/>
                            <!-- <TransitionRoot
                              as="template"
                              :show="lnameDropdown"
                              enter="transition-all ease-linear duration-150"
                              enterFrom="mt-5 invisible opacity-0 translate-y-1"
                              enterTo="mt-[3px] visible opacity-100 translate-y-0"
                              entered="mt-[3px]"
                              leave="transition-all ease-linear duration-150"
                              leaveFrom="mt-[3px] visible opacity-100 translate-y-0"
                              leaveTo="mt-5 invisible opacity-0 translate-y-1"
                              class="w-96 h-40"
                            >
                              <div class="absolute right-100 z-10 mt-[3px]">
                                <div class="w-auto p-5 box">
                                  <div class="mb-2 font-medium">Client Name List</div>
                                    <button  v-for="item in clientList" :key="item.id" :value="item.id" class="w-full mb-5 flex items-center hover:bg-slate-400" type="button" @click="router.push({path:`/client/${item.id}`,params:item.id})">
                                      <div
                                        class="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20 dark:bg-success/10 text-success"
                                      >
                                        <Lucide icon="User" class="w-4 h-4" />
                                      </div>
                                      <div class="ml-3">{{item.lname + ", " + item.fname + " " + item.mname}}</div>
                                    </button>
                                 </div>
                              </div>
                            </TransitionRoot> -->
                        </div>
                        <div class="col-span-12 sm:col-span-3">
                          <FormLabel htmlFor="modal-form-3">Middle Name</FormLabel>
                          <FormInput  :rounded="rounded" v-model="formClient.mname" 
                            type="text" placeholder="M.I" 
                            @blur="hideSearchLname"/>
                        </div>
                        <div class="col-span-12 sm:col-span-1">
                          <FormLabel htmlFor="modal-form-3"> Suffix </FormLabel>
                          <FormInput  :rounded="rounded" v-model="formClient.suffix" type="text" placeholder="Sr/Jr/III" />
                        </div>
                        <!-- <div class="col-span-12 sm:col-span-2 hidden">
                            <FormLabel htmlFor="modal-form-3"> Sex<span class="requiredTag hidden"> *</span> </FormLabel>
                            <FormSelect  v-model="formClient.gender" placeholder="Required Fields *" required>
                              <option value="FEMALE">Female</option>
                              <option value="MALE">Male</option>
                              <option value="Other">Other</option>
                            </FormSelect>
                        </div> -->
                        <div class="col-span-12 sm:col-span-2">
                          <FormLabel htmlFor="modal-form-3"> Civil Status<span class="requiredTag"> *</span> </FormLabel>
                          <FormSelect  v-model="formClient.civilStatus" placeholder="Required Fields *" required>
                            <option value="Single">Single</option>
                            <option value="Married">Married</option>
                            <option value="Widowed">Widowed</option>
                            <option value="Legally Separated">Legally Separated</option>
                          </FormSelect>
                        </div>
                        <div class="col-span-12 sm:col-span-2">
                          <FormLabel htmlFor="modal-form-3"> Social Classification<span class="requiredTag"> *</span> </FormLabel>
                          <FormSelect  v-model="formClient.socialClassification" placeholder="Required Fields *" required>
                            <option value="Abled">Abled</option>
                            <option value="Indigenous Person">Indigenous Person</option>
                            <option value="Differently-Abled (PWD)">Differently-Abled (PWD)</option>
                            <option value="Senior Citizen">Senior Citizen</option>
                          </FormSelect>
                        </div>
                        <div class="col-span-12 sm:col-span-2">
                          <FormLabel  htmlFor="modal-form-1"> Age<span class="requiredTag"> *</span> </FormLabel>
                          <FormSelect  v-model="formClient.age"  placeholder="Required Fields *" required>
                            <option value="18 - 35 years old">18 - 35 years old</option>
                            <option value="above 35 – below 60 years old">above 35 – below 60 years old</option>
                            <option value="60 years old and  above">60 years old and  above</option>
                          </FormSelect>
                        </div>
                        <div class="col-span-12 sm:col-span-4">
                          <FormLabel  htmlFor="modal-form-1"> Job Position </FormLabel>
                          <FormInput  :rounded="rounded" v-model="formClient.designation" type="text" placeholder=""/>
                        </div>
                        <div class="col-span-12 md:col-span-2">
                          <FormLabel htmlFor="modal-form-3"> Are you an Investor<span class="requiredTag"> *</span> </FormLabel>
                          <FormSelect v-model="formClient.investor" placeholder="Required Fields *" @change="loadPriority()" required>
                              <option value="Yes">Yes</option>
                              <option value="No">No</option>
                          </FormSelect>
                        </div>
                        <div class="col-span-12 sm:col-span-4">
                          <FormLabel  htmlFor="modal-form-1"> Are you a member of a organization? </FormLabel>
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
                          >
                            <option v-for="item in orgList" :value="item['title']" :key="item['id']">{{item['title']}}</option>
                            <option value="No">Not a member of any organization</option>
                          </TomSelect>
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
                          <legend class="text-xs">Address<span class="requiredTag"> *</span></legend>
                          <div class="col-span-12 sm:col-span-12">
                            <FormLabel  htmlFor="modal-form-1"> House No./Street Name</FormLabel>
                            <FormInput  v-model="formClient.address" type="text"
                            placeholder="House/Building No. / Room & Floor No./ Building Name" required/>
                          </div>
                          <!-- BEGIN: Search -->
                          <div class="col-span-12 sm:col-span-12">
                            <div class="col-span-12 sm:col-span-12">
                              <FormLabel  htmlFor="modal-form-1"> BARANGAY / CITY or Municipality / PROVINCE / REGION</FormLabel>
                              <LocationDetails @location-selected="handleLocationSelected" />
                            </div>
                          </div>
                          <!-- END: Search -->
                          <div class="col-span-12 sm:col-span-3">
                            <FormLabel  htmlFor="modal-form-3"> Province </FormLabel>
                            <FormInput  v-model="formClient.province" type="text"
                            placeholder="If applicable" readonly/>
                          </div>
                          <div class="col-span-12 sm:col-span-3">
                            <FormLabel  htmlFor="modal-form-3"> City / Municipality </FormLabel>
                            <FormInput  v-model="formClient.lgu" type="text"
                            placeholder="If applicable" readonly/>
                          </div>
                          <div class="col-span-12 sm:col-span-3">
                            <FormLabel  htmlFor="modal-form-3"> Longitude </FormLabel>
                            <FormInput  v-model="formClient.longitude" type="text"
                            placeholder="If applicable" readonly/>
                          </div>
                          <div class="col-span-12 sm:col-span-3">
                            <FormLabel  htmlFor="modal-form-3"> Latitude </FormLabel>
                            <FormInput  v-model="formClient.latitude" type="text"
                            placeholder="If applicable" readonly/>
                          </div>
                          
                        </fieldset>
                        <fieldset class="grid grid-cols-12 col-span-12 gap-4 gap-y-3 border border-solid border-gray-300 p-3">
                          <legend class="text-xs">Contact Details</legend>
                          <div class="col-span-12 sm:col-span-3">
                            <FormLabel  htmlFor="modal-form-3"> Landline Number </FormLabel>
                            <FormInput  v-model="formClient.telNo" type="text"
                            placeholder="If applicable"/>
                          </div>
                          <div class="col-span-12 sm:col-span-3">
                            <FormLabel  htmlFor="modal-form-3"> Mobile Number </FormLabel>
                            <FormInput  v-model="formClient.mobileNo" type="text"
                            placeholder="If applicable"/>
                          </div>
                          <div class="col-span-12 sm:col-span-3">
                            <FormLabel  htmlFor="modal-form-3"> Fax Number </FormLabel>
                            <FormInput  v-model="formClient.faxNo" type="text"
                            placeholder="If applicable"/>
                          </div>
                          <div class="col-span-12 sm:col-span-3">
                            <FormLabel  htmlFor="modal-form-3"> Email Address </FormLabel>
                            <FormInput  v-model="formClient.email" type="text"
                            placeholder="If applicable"/>
                          </div>
                        </fieldset>
                  </fieldset>
                </div>
              </Dialog.Description>
              <Dialog.Footer>
                  <Button type="button" variant="outline-secondary" @click="
                              () => {
                                setAddModal(false);
                              }
                            " class="w-auto mr-1">
                            <Lucide icon="XSquare" class="w-4 h-4 mr-2" />
                      Cancel
                  </Button>
                  <Button type="submit" variant="primary" elevated class="w-auto">
                    <Lucide icon="Save" class="w-4 h-4 mr-2" />{{buttonTitle}}
                  </Button>
              </Dialog.Footer>
            </form>
        </Dialog.Panel>
      </Dialog>
      <!-- END: Modal Content -->
      <Menu class="ml-auto sm:ml-0">
        <Menu.Button :as="Button" class="px-2 font-normal !box">
          <span class="flex items-center justify-center w-5 h-5">
            <Lucide icon="Plus" class="w-4 h-4" />
          </span>
        </Menu.Button>
        <Menu.Items class="w-40">
          <Menu.Item>
            <Lucide icon="FilePlus" class="w-4 h-4 mr-2" /> New Category
          </Menu.Item>
          <Menu.Item>
            <Lucide icon="UserPlus" class="w-4 h-4 mr-2" /> New Group
          </Menu.Item>
        </Menu.Items>
      </Menu>
    </div>
  </div>
  <!-- BEGIN: HTML Table Data -->
  <div class="p-5 mt-5 intro-y box">
    <div class="overflow-x-auto scrollbar-hidden">
      <div id="tabulator" ref="tableClient" class="mt-5"></div>
      <div v-if="loadingIcon===true"
        class="flex flex-col items-center justify-end col-span-6 sm:col-span-3 xl:col-span-2"
      >
          <LoadingIcon icon="grid" class="w-8 h-8" />
      <div class="mt-2 text-xs text-center">Loading Data...</div>
    </div>
    </div>
  </div>
  <!-- END: HTML Table Data -->
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
</style>