<script setup lang="ts">
import Lucide from "../../base-components/Lucide";
import { Menu, Dialog } from "../../base-components/Headless";
import Button from "../../base-components/Button";
import { onMounted, ref, reactive, watch, provide, toRefs} from "vue";
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

const router = useRouter();
const {formClient, errorMessage, isError, columnData, addModal, rounded,  brgyDropdown,
        lnameDropdown, showSearchBrgy, hideSearchBrgy, showSearchLname, hideSearchLname, 
        message, messageDetail, buttonTitle, buttonIcon, setAddModal, select, brgy, sendButtonRef, ncfrs, tenurial,
        accreditation, organization, disNcfrs, disTenurial, disAccreditation, disOrganization, brgySelect, citySelect,
        clientList, addressSelect, checkBa, aNcfrs, dTenurial, dOrganization, dAccreditation, brgyId, formOrganization, orgList, selectOrganization} = useClient();
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

const onSubmit = () => {
  brgyId.value = addressSelect.addressName.split(", ")
  formClient.barangay = brgyId.value[0]
  formClient.lgu = brgyId.value[1]
  formClient.province = brgyId.value[2]
  formClient.lname.toUpperCase();
  formClient.fname.toUpperCase();
  formClient.mname.toUpperCase();
  formClient.fullName = formClient.lname.toUpperCase() + ", " + formClient.fname.toUpperCase() + " " + formClient.mname.toUpperCase();
  formClient.address.toUpperCase();
  formClient.barangay.toUpperCase();
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
  ClientDataService.create(formClient).then((response: ResponseData)=>{
      successNotification.value.showToast();
      addModal.value = false
      messageDetail.value = "You successfully created client profile redirecting you to the profile page..."
      router.push({path:`/client/${response.data.id}`})
    }).catch((e : Error)=>{
      message.value = "Error occurred!!!"
      messageDetail.value = e.message.toString()
    })
};
watch(addModal,(addModal, oldAdm)=> {
  if(addModal === false){
    formClient.id = "0";
  }else if(formClient.id!=="0"){
    buttonTitle.value = "Update"
    buttonIcon.value = "Edit"
  }
});
watch(
  () => (addressSelect.addressName), async(address, prevToe) => {
    if(address.length>2){
        LocationDataService.getBarangayVal(address).then((response: ResponseData)=>{
        brgySelect.value = response.data
        }).catch((e: Error)=>{
          console.log(citySelect.value)
        })
      }
    }
)
watch(
  () => (formClient.fname), async(lname, prevToe) => {
    if(lname.length>=2){
        lname = formClient.lname + ", " + lname
        ClientDataService.findByLname(lname).then((response: ResponseData)=>{
          clientList.value = response.data
        }).catch((e: Error)=>{
          console.log(clientList.value)
        })
      }
    }
)
const showSearchLnamewithParam = async () => {
  lnameDropdown.value = true
  // ClientDataService.findByLname(formClient.lname+", "+formClient.fname+" "+formClient.mname)
  //   .then((response: ResponseData)=>{
  //       clientList.value = response.data
  //     }).catch((e: Error)=>{
  //       console.log(clientList.value)
  //     })
}
const priorityIndustry = ref([])
onMounted(async () => {
  initTabulator(columnData.value, ClientDataService, tableClient);
  reInitOnResizeWindow();
  OrganizationDataService.getAll().then((response: ResponseData)=>{
    orgList.value = response.data
  })
  tabulator.value?.on("rowClick",(e, cell)=>{
    const id = cell.getData().id
    router.push({path:`/client/${id}`, params:{id}})
  })
  if(sessionStorage.getItem('userId') === null){
      router.push({ path:'/login'})
      sessionStorage.clear()
    }
  CodeBook.getType(11).then((resp: ResponseData)=>{
    priorityIndustry.value = resp.data
  })
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
                          <FormLabel htmlFor="modal-form-3"> Prefix </FormLabel>
                          <FormSelect  v-model="formClient.prefix" class="col-span-12 sm:col-span-2" @change="aNcfrs" required>
                            <option value="Mr.">Mr.</option>
                            <option value="Ms.">Ms.</option>
                            <option value="Mrs.">Mrs.</option>
                          </FormSelect>
                        </div>
                        <div class="col-span-12 sm:col-span-4">
                          <FormLabel htmlFor="modal-form-2"> Last Name </FormLabel>
                          <FormInput  :rounded="rounded" 
                            v-model="formClient.lname" type="text" placeholder=""
                             required/>
                        </div>
                        <div class="col-span-12 sm:col-span-3">
                            <FormLabel  htmlFor="modal-form-1"> First Name </FormLabel>
                            <FormInput  :rounded="rounded" 
                              v-model="formClient.fname" type="text" placeholder="" @focus="showSearchLnamewithParam"
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
                            </TransitionRoot>
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
                        <div class="col-span-12 sm:col-span-2">
                            <FormLabel htmlFor="modal-form-3"> Sex </FormLabel>
                            <FormSelect  v-model="formClient.gender" required>
                              <option value="FEMALE">Female</option>
                              <option value="MALE">Male</option>
                              <option value="Other">Other</option>
                            </FormSelect>
                        </div>
                        <div class="col-span-12 sm:col-span-2">
                          <FormLabel htmlFor="modal-form-3"> Civil Status </FormLabel>
                          <FormSelect  v-model="formClient.civilStatus" required>
                            <option value="Single">Single</option>
                            <option value="Married">Married</option>
                            <option value="Widowed">Widowed</option>
                            <option value="Legally Separated">Legally Separated</option>
                          </FormSelect>
                        </div>
                        <div class="col-span-12 sm:col-span-2">
                          <FormLabel htmlFor="modal-form-3"> Social Classification </FormLabel>
                          <FormSelect  v-model="formClient.socialClassification" required>
                            <option value="Abled">Abled</option>
                            <option value="Indigenous Person">Indigenous Person</option>
                            <option value="Differently-Abled (PWD)">Differently-Abled (PWD)</option>
                            <option value="Senior Citizen">Senior Citizen</option>
                          </FormSelect>
                        </div>
                        <div class="col-span-12 sm:col-span-2">
                          <FormLabel  htmlFor="modal-form-1"> Age </FormLabel>
                          <FormSelect  v-model="formClient.age" required>
                            <option value="18 - 35 years old">18 - 35 years old</option>
                            <option value="above 35 – below 60 years old">above 35 – below 60 years old</option>
                            <option value="60 years old and  above">60 years old and  above</option>
                          </FormSelect>
                        </div>
                        <div class="col-span-12 sm:col-span-4">
                          <FormLabel  htmlFor="modal-form-1"> Job Position </FormLabel>
                          <FormInput  :rounded="rounded" v-model="formClient.designation" type="text" placeholder=""/>
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
                        <div class="col-span-12 md:col-span-4">
                          <FormLabel htmlFor="modal-form-3"> Are you an Investor </FormLabel>
                          <FormSelect form-select-size="sm"  v-model="formClient.investor" required>
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
                          <div class="col-span-12 sm:col-span-6">
                            <FormLabel  htmlFor="modal-form-1"> House No./Street Name</FormLabel>
                            <FormInput  v-model="formClient.address" type="text"
                            placeholder="House/Building No. / Room & Floor No./ Building Name" required/>
                          </div>
                          <div class="col-span-12 sm:col-span-3">
                            <FormLabel  htmlFor="modal-form-3"> Longitude </FormLabel>
                            <FormInput  v-model="formClient.longitude" type="text"
                            placeholder="If applicable"/>
                          </div>
                          <div class="col-span-12 sm:col-span-3">
                            <FormLabel  htmlFor="modal-form-3"> Latitude </FormLabel>
                            <FormInput  v-model="formClient.latitude" type="text"
                            placeholder="If applicable"/>
                          </div>
                          <!-- BEGIN: Search -->
                          <div class="col-span-12 sm:col-span-12">
                            <div class="col-span-12 sm:col-span-3">
                              <FormLabel  htmlFor="modal-form-1"> Barangay / Municipality or City / Region  </FormLabel>
                              <FormInput
                                type="text"
                                placeholder="Search Barangay..."
                                @focus="showSearchBrgy"
                                @blur="hideSearchBrgy"
                                v-model="addressSelect.addressName"
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
                                    <button href="" type="button" class="w-full mb-5 flex items-center hover:bg-slate-400" v-for="item in brgySelect" :key="item.id" :value="item.id" @click="checkBa(item)">
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
                          <!-- END: Search -->
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
                            <FormInput  v-model="formClient.email" type="email"
                            placeholder="If applicable"/>
                          </div>
                        </fieldset>
                        <!-- <fieldset class="grid grid-cols-12 col-span-12 gap-4 gap-y-3 
                      border border-solid border-gray-300 p-2" >
                      <legend class="text-sm font-bold">CFIDP</legend>
                      <div class="col-span-12 sm:col-span-4">
                        <FormLabel  htmlFor="modal-form-1"> Classification </FormLabel>
                        <FormSelect v-model="formClient.classification" required>
                          <option value="Individual Farmer">Individual Farmer</option>
                          <option value="Association/Cooperative">Association/Cooperative</option>
                          <option value="MSME">MSME</option>
                        </FormSelect>
                      </div>
                      <div class="col-span-12 sm:col-span-4">
                          <FormLabel  htmlFor="modal-form-1"> Are you NCFRS-Registered? </FormLabel>
                          <InputGroup class="grid grid-cols-12">
                            <FormSelect  v-model="ncfrs" class="col-span-12 sm:col-span-2" @change="aNcfrs" required>
                              <option value="Yes">Yes</option>
                              <option value="No">No</option>
                              <option value="Not Sure">Not Sure</option>
                            </FormSelect>
                            <FormInput  :rounded="rounded" v-model="formClient.farmerId" 
                                type="text" placeholder="Farmer's ID" class="col-span-12 sm:col-span-10" :disabled="disNcfrs" required/>
                          </InputGroup>
                      </div>
                      <div class="col-span-12 sm:col-span-4">
                        <FormLabel  htmlFor="modal-form-1"> Tenurial Status </FormLabel>
                        <InputGroup class="grid grid-cols-12">
                          <FormSelect  v-model="tenurial" class="col-span-12 sm:col-span-2" @change="dTenurial" required>
                            <option value="Owner">Owner</option>
                            <option value="Owner-Tiller">Owner-Tiller</option>
                            <option value="Grower">Grower</option>
                            <option value="Tenant">Tenant</option>
                            <option value="Tenant-Worker">Tenant-Worker</option>
                            <option value="Worker-Laborer">Worker-Laborer</option>
                            <option value="Others">Others</option>
                          </FormSelect>
                          <FormInput  :rounded="rounded" v-model="formClient.tenurialStatus" 
                              type="text" placeholder="Please Specify......" class="col-span-12 sm:col-span-10" :disabled="disTenurial" required/>
                        </InputGroup>
                      </div>
                      <div class="col-span-12 sm:col-span-8">
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
                      <div class="col-span-12 sm:col-span-4">
                        <FormLabel  htmlFor="modal-form-1"> Is your organization accredited/registered? </FormLabel>
                        <InputGroup class="grid grid-cols-12">
                          <FormSelect  v-model="accreditation" class="col-span-12 sm:col-span-3" @change="dAccreditation" required>
                            <option value="PCA">PCA-</option>
                            <option value="CDA">CDA-</option>
                            <option value="SEC">SEC-</option>
                            <option value="No">No</option>
                          </FormSelect>
                          <FormInput  :rounded="rounded" v-model="formClient.accreditation" 
                              type="text" placeholder="Accreditation/Registration Number..." class="col-span-12 sm:col-span-9" :disabled="disAccreditation" required/>
                        </InputGroup>
                      </div>
                    </fieldset> -->
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
    <div class="flex flex-col sm:flex-row sm:items-end xl:items-start">
      <form
        id="tabulator-html-filter-form"
        class="xl:flex sm:mr-auto"
        @submit="
          (e) => {
            e.preventDefault();
            onFilter();
          }
        "
      >
        <div class="items-center sm:flex sm:mr-4 sm:w-auto">
          <label class="flex-none w-12 mr-2 xl:w-auto xl:flex-initial">
            Field
          </label>
          <FormSelect
            id="tabulator-html-filter-field"
            v-model="filter.field"
            class="w-full mt-2 2xl:w-full sm:mt-0 sm:w-auto"
          >
            <option value="id">No.</option>
            <option value="name">Name</option>
            <option value="farmerId">Farmers Id</option>
            <option value="province">Province</option>
          </FormSelect>
        </div>
        <div class="items-center mt-2 sm:flex sm:mr-4 xl:mt-0">
          <label class="flex-none w-12 mr-2 xl:w-auto xl:flex-initial">
            Type
          </label>
          <FormSelect
            id="tabulator-html-filter-type"
            v-model="filter.type"
            class="w-full mt-2 sm:mt-0 sm:w-auto"
          >
            <option value="like">like</option>
            <option value="=">=</option>
            <option value="<">&lt;</option>
            <option value="<=">&lt;=</option>
            <option value=">">&gt;</option>
            <option value=">=">&gt;=</option>
            <option value="!=">!=</option>
          </FormSelect>
        </div>
        <div class="items-center mt-2 sm:flex sm:mr-4 xl:mt-0">
          <label class="flex-none w-12 mr-2 xl:w-auto xl:flex-initial">
            Value
          </label>
          <FormInput
            id="tabulator-html-filter-value"
            v-model="filter.value"
            type="text"
            class="mt-2 sm:w-40 2xl:w-full sm:mt-0"
            placeholder="Search..."
          />
        </div>
        <div class="mt-2 xl:mt-0">
          <Button
            id="tabulator-html-filter-go"
            variant="primary"
            type="button"
            class="w-full sm:w-16"
            @click="onFilter"
          >
            Go
          </Button>
          <Button
            id="tabulator-html-filter-reset"
            variant="secondary"
            type="button"
            class="w-full mt-2 sm:w-16 sm:mt-0 sm:ml-1"
            @click="onResetFilter('name')"
          >
            Reset
          </Button>
        </div>
      </form>
      <div class="flex mt-5 sm:mt-0">
        <Button
          id="tabulator-print"
          variant="outline-secondary"
          class="w-1/2 mr-2 sm:w-auto"
          @click="onPrint"
        >
          <Lucide icon="Printer" class="w-4 h-4 mr-2" /> Print
        </Button>
        <Menu class="w-1/2 sm:w-auto">
          <Menu.Button
            :as="Button"
            variant="outline-secondary"
            class="w-full sm:w-auto"
          >
            <Lucide icon="FileText" class="w-4 h-4 mr-2" /> Export
            <Lucide icon="ChevronDown" class="w-4 h-4 ml-auto sm:ml-2" />
          </Menu.Button>
          <Menu.Items class="w-40">
            <Menu.Item @click="onExportCsv">
              <Lucide icon="FileText" class="w-4 h-4 mr-2" /> Export CSV
            </Menu.Item>
            <Menu.Item @click="onExportJson">
              <Lucide icon="FileText" class="w-4 h-4 mr-2" /> Export JSON
            </Menu.Item>
            <Menu.Item @click="onExportXlsx">
              <Lucide icon="FileText" class="w-4 h-4 mr-2" /> Export XLSX
            </Menu.Item>
            <Menu.Item @click="onExportHtml">
              <Lucide icon="FileText" class="w-4 h-4 mr-2" /> Export HTML
            </Menu.Item>
          </Menu.Items>
        </Menu>
      </div>
    </div>
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
</style>