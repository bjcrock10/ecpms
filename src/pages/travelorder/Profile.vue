<script setup lang="ts">
import Lucide from "../../base-components/Lucide";
import LoadingIcon from "../../base-components/LoadingIcon";
import { tabulatorFunc } from "../../types/tabulator.d";
import { Menu, Dialog } from "../../base-components/Headless";
import Button from "../../base-components/Button";
import { FormInput, FormSelect, InputGroup, FormLabel, FormTextarea, FormSwitch} from "../../base-components/Form";
import { onMounted, ref, reactive, watch, provide, toRefs} from "vue";
import Notification from "../../base-components/Notification";
import Tippy from "../../base-components/Tippy";
import { useRouter } from "vue-router";
import UserDataService from '../../services/UserDataService';
import ResponseData from "../../types/response.d";
import TravelOrderService from '../../services/TravelOrder';
import TravelOrderDetailService from '../../services/TravelOrderDetail';
import { useTravelOrder } from "../../types/travelorder.d";
import { ClassicEditor } from "../../base-components/Ckeditor";
import TomSelect from "../../base-components/TomSelect";
import { TransitionRoot } from "@headlessui/vue";
import LocationDataService from "../../services/LocationDataService";
import { reposition } from 'toastify-js';
import { now } from 'lodash';

const {formTO,columnData, formTODetail, brgySelect, addressSelect, brgyDropdown, showSearchBrgy, hideSearchBrgy, checkBa, current_date} = useTravelOrder();
const {initTabulator, reInitOnResizeWindow, 
filter, onFilter, 
onExportCsv, onExportHtml, 
onExportJson, onExportXlsx, 
onPrint, onResetFilter, tabulator, loadingIcon} = tabulatorFunc();
const data = ref([]);
const router = useRouter();
const tableTODetail = ref<HTMLDivElement>();
const message = ref("");
const messageDetail = ref("");
const sendButtonRef = ref(null);
const successNotification = ref();
const toId = ref(router.currentRoute.value.params.id);
provide("bind[successNotification]", (el: any) => {
  // Binding
  successNotification.value = el;
  });
const resetFields = () =>{
    formTODetail.id = ''
    formTODetail.fname = ''
    formTODetail.lname = ''
    formTODetail.mname = ''
    formTODetail.fullName = ''
    formTODetail.designation = ''
    formTODetail.departureMonth = ''
    formTODetail.arrivalMonth = ''
    formTODetail.noOfDay = ''
    formTODetail.travelExpense = ''
    formTODetail.inclusiveDate = ''
    formTODetail.address = ''
    formTODetail.barangay = ''
    formTODetail.province = ''
    formTODetail.city = ''
    formTODetail.certificateOfAppearance = ''
    addressSelect.addressName = ''
    buttonTitle.value = "Save"
}
const setAddModal = (value: boolean) => {
  addModal.value = value;
};
const addModal = ref(false);
const employeeList = ref([]);
const selectEmployee = ref([""]);
const buttonTitle = ref("Submit")
const dataTable = () =>{
  initTabulator(columnData.value, TravelOrderDetailService, tableTODetail, toId.value,true);
  reInitOnResizeWindow();
  tabulator.value?.on("rowClick",(e, cell)=>{
    formTODetail.id = cell.getData().id
    formTODetail.toNo = cell.getData().toNo
    formTODetail.toId = cell.getData().toId
    formTODetail.fname = cell.getData().fname
    formTODetail.lname = cell.getData().lname
    formTODetail.mname = cell.getData().mname
    formTODetail.fullName = cell.getData().fullName
    formTODetail.designation = cell.getData().designation
    formTODetail.departureMonth = cell.getData().departureMonth
    formTODetail.arrivalMonth = cell.getData().arrivalMonth
    formTODetail.noOfDay = cell.getData().noOfDay
    formTODetail.travelExpense = cell.getData().travelExpense
    formTODetail.inclusiveDate = cell.getData().inclusiveDate
    formTODetail.address = cell.getData().address
    formTODetail.certificateOfAppearance = cell.getData().certificateOfAppearance
    formTODetail.barangay = cell.getData().barangay
    formTODetail.province = cell.getData().province
    formTODetail.city = cell.getData().city
    addressSelect.addressName = cell.getData().address
    selectEmployee.value = [cell.getData().userId]
    addModal.value = true
    buttonTitle.value = "Update"
  })
};
const office = ref()
const onSubmit = async () => {
  if(toId.value==='0'){
    formTO.office = office.value
    TravelOrderService.create(formTO).then((response: ResponseData)=>{
      router.push({path: `/toprofile/${response.data.id}`});
      getTOInfo(response.data.id);
      successNotification.value.showToast();
      messageDetail.value = "You successfully created new TO"
      router.push({path: `/toprofile/${response.data.id}`});
      toId.value = response.data.id
    })
  }
  else{
    formTO.office = office.value;
    TravelOrderService.update(toId.value,formTO).then((response: ResponseData)=>{
      formTODetail.toId = response.data.id
      formTODetail.toNo = response.data.toNo
      successNotification.value.showToast();
      messageDetail.value = "You successfully updated TO number: " + response.data.toNo
    });
  }
}
const onSubmit1 = async () => {
  if(formTODetail.id===""){
    formTODetail.userId = selectEmployee.value.toString()
    TravelOrderDetailService.create(formTODetail).then((resp: ResponseData)=>{
      successNotification.value.showToast();
      messageDetail.value = "You successfully added Employee: " + formTODetail.fullName
      dataTable()
      addModal.value = false
    }).catch((e:Error)=>{
      successNotification.value.showToast();
      messageDetail.value = e.message
    }
    );
  }
  else{
    formTODetail.userId = selectEmployee.value.toString()
    TravelOrderDetailService.update(formTODetail.id, formTODetail).then((resp: ResponseData) => {
      successNotification.value.showToast();
      messageDetail.value = "You successfully updated Employee: " + formTODetail.fullName
      dataTable()
      addModal.value = false
    })
  }
}
watch(
  () => (addressSelect.addressName), async(address, prevToe) => {
    if(address.length>2){
        LocationDataService.getBarangayVal(address).then((response: ResponseData)=>{
        brgySelect.value = response.data
        }).catch((e: Error)=>{
          console.log(e.message)
          brgySelect.value = []
        })
      }
    else{
        brgySelect.value = []
    }
    }
)
watch(() => (selectEmployee.value), async(employee, preEmp) =>{
  UserDataService.get(employee).then((resp: ResponseData)=>{
    formTODetail.lname = resp.data.lname;
    formTODetail.fname = resp.data.fname;
    formTODetail.mname = resp.data.mname;
    formTODetail.fullName = resp.data.lname + ", " + resp.data.fname
    formTODetail.office = resp.data.office
    formTODetail.designation = resp.data.jobs
  }).catch((e: Error)=>{
    alert(e.message)
  });
})
const getTOInfo = async(toId: any) =>{
  TravelOrderService.get(toId).then((response: ResponseData)=>{
      formTO.toNo =  response.data.toNo
      formTO.toDate = response.data.toDate
      formTO.purpose = response.data.purpose
      formTO.poAttachment = response.data.poAttachment
      formTO.roAttachment = response.data.roAttachment
      formTO.status = response.data.status
      formTODetail.toId = response.data.id
      formTODetail.toNo = response.data.toNo
      formTO.dateApproved = response.data.dateApproved
  })
  if(formTO.toNo===""){
    formTO.toNo = sessionStorage.getItem('office') + '-' + current_date + "-"
  }
}
const openUrl = (url: any) =>{
  window.open(url,"blank");
}
onMounted(async ()=>{
    dataTable();
    UserDataService.getAll().then((response: ResponseData)=>{
        employeeList.value = response.data
    })
   getTOInfo(toId.value);
   office.value = sessionStorage.getItem('office');
    if(sessionStorage.getItem('userId') === null){
      router.push({ path:'/login'})
      sessionStorage.clear()
    }
})
</script>

<template>
    <div class="flex flex-col items-center mt-8 intro-y sm:flex-row">
        <div class="flex w-full mt-4 sm:w-auto sm:mt-0">
          <Button class="mr-2 shadow-md" as="a" href="#" variant="primary" @click="router.push({path: '/to'})">
            <Lucide icon="RotateCcw" class="block mx-auto mr-2"></Lucide> Back
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
            </div>
            </Notification>
        <!-- END: Notification Content -->
          <Menu class="ml-auto sm:ml-0">
            <Menu.Button :as="Button" class="px-2 font-normal !box">
              <span class="flex items-center justify-center w-5 h-5">
                <Lucide icon="Plus" class="w-4 h-4" />
              </span>
            </Menu.Button>
            <Menu.Items class="w-40">
              <Menu.Item>
                <a href="https://drive.google.com/drive/folders/1SvUGlFvJcNdBNk4P9Mu9KN8K4wmURVII?usp=drive_link" target="__blank"><Lucide icon="FilePlus" class="w-4 h-4 mr-2" /> Upload Files</a>
              </Menu.Item>
            </Menu.Items>
          </Menu>
        </div>
    </div>
      <!-- BEGIN: HTML Table Data -->
    <div class="grid grid-cols-12 gap-5 mt-5 intro-y">
        <div class="col-span-12 intro-y lg:col-span-4">
            <form class="validate-form" @submit.prevent="onSubmit">
                <div class="grid grid-cols-12 gap-5 mt-5 intro-y">
                    <div class="col-span-12 sm:col-span-12">
                        <FormLabel htmlFor="modal-form-3"> TO Number </FormLabel>
                        <FormInput type="text" v-model="formTO.toNo" class="col-span-12 sm:col-span-6" required :disabled="(office==='RO' && formTO.status==='For Approval')?false:true"/>
                    </div>
                    <div class="col-span-4 sm:col-span-12">
                        <FormLabel htmlFor="modal-form-3"> TO Date </FormLabel>
                        <FormInput type="date" v-model="formTO.toDate" class="col-span-12 sm:col-span-6" required :disabled="(formTO.status!=='For Approval')?true:false"/>
                    </div>
                    <div class="col-span-12 sm:col-span-12">
                        <FormLabel htmlFor="modal-form-3">Purpose</FormLabel>
                        <!-- <ClassicEditor v-model="formTO.purpose" /> -->
                        <FormInput type="text" v-model="formTO.purpose" class="col-span-12 sm:col-span-6" required :disabled="(formTO.status!=='For Approval')?true:false"/>
                    </div>
                    <div class="col-span-12 sm:col-span-12">
                        <FormLabel htmlFor="modal-form-3"> PO Scanned URL</FormLabel>
                        <div class="grid grid-cols-12 gap-5 mt-5 intro-y">
                          <div class="col-span-11 sm:col-span-11">
                            <FormInput type="url" v-model="formTO.poAttachment" class="col-span-12 sm:col-span-6" required :disabled="(formTO.status!=='For Approval')?true:false"/>
                          </div>
                          <div class="col-span-1 sm:col-span-1">
                            <Button type="button" class="-ml-5 bg-primary" 
                                as="poScannedView" variant="dark"
                                v-on:click="openUrl(formTO.poAttachment)" v-if="formTO.poAttachment!==''"> 
                                <Lucide icon="Eye"></Lucide>
                            </Button>
                          </div>
                        </div>
                          
                    </div>
                    <div class="col-span-12 sm:col-span-12" >
                        <FormLabel htmlFor="modal-form-3"> RO Scanned URL </FormLabel>
                        <div class="grid grid-cols-12 gap-5 mt-5 intro-y">
                          <div class="col-span-11 sm:col-span-11">
                            <FormInput type="url" v-model="formTO.roAttachment" class="col-span-12 sm:col-span-6" :disabled="(office==='RO')?false:true" :required="(formTO.status!=='For Approval')?true:false" />
                          </div>
                          <div class="col-span-1 sm:col-span-1">
                            <Button type="button" class="-ml-5 bg-primary" 
                                as="poScannedView" variant="dark"
                                v-on:click="openUrl(formTO.roAttachment)" v-if="formTO.roAttachment!==''">
                                <Lucide icon="Eye"></Lucide>
                            </Button>
                          </div>
                        </div>
                    </div>
                    <div class="col-span-12 sm:col-span-6" v-if="office==='RO'">
                        <FormLabel htmlFor="modal-form-3"> Date Approved </FormLabel>
                        <FormInput type="date" v-model="formTO.dateApproved" class="col-span-12 sm:col-span-6" />
                    </div>
                    <div class="col-span-12 sm:col-span-6" v-if="office==='RO'">
                        <FormLabel htmlFor="modal-form-3"> Status </FormLabel>
                        <FormSelect   v-model="formTO.status">
                            <option value="For Approval">For Approval</option>
                            <option value="Approved">Approved</option>
                            <option value="Disapproved">Disapproved</option>
                            <option value="Completed">Completed</option>
                        </FormSelect>
                    </div>
                    <div class="col-span-12 sm:col-span-6">
                        <Button type="submit" name="save" title="Save" class="mr-2 shadow-md" variant="primary"><Lucide icon="Save"></Lucide> {{(toId==='0')?'Save':'Update'}}</Button>
                    </div>
                </div>
            </form>
        </div>
        <div class="col-span-12 intro-y lg:col-span-8">
            <div class="grid grid-cols-12 gap-5 mt-5 intro-y">
                <div class="col-span-12">
                    <Button class="mr-2 shadow-md" as="addNew" href="#" variant="primary" @click="(event: MouseEvent) => {
                        event.preventDefault();
                        setAddModal(true);
                        resetFields();}" v-if="toId!=='0' && formTO.status==='For Approval'">
                        <Lucide icon="PlusCircle"></Lucide> Add New
                    </Button>
                </div>
                <div class="col-span-12 sm:col-span-12">
                    <div class="flex mt-5 sm:mt-0">
                        <Button
                        id="tabulator-print"
                        variant="outline-secondary"
                        class="w-1/2 mr-2 sm:w-auto" >
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
                    <div class="overflow-x-auto scrollbar-hidden overflow-scroll">
                        <div id="tabulator" ref="tableTODetail" class="mt-5"></div>
                        <div v-if="loadingIcon===true"
                            class="flex flex-col items-center justify-end col-span-6 sm:col-span-3 xl:col-span-2"
                        >
                            <LoadingIcon icon="grid" class="w-8 h-8" />
                        <div class="mt-2 text-xs text-center">Loading Data...</div>
                        </div>
                    </div>
                </div>
            </div>
            
        </div>
    </div>
    <!-- BEGIN: Modal Content -->
    <Dialog size="xl" :open="addModal" @close="
        () => {
        setAddModal(false);
        }
        " :initialFocus="sendButtonRef">
        <Dialog.Panel class="z-40 top-0 left-0 w-full h-full outline-none overflow-x-hidden overflow-y-auto">
            <Dialog.Title>
                <h2 class="mr-auto text-base font-medium">
                    -
                </h2>
                <button type="button" @click="
                        () => {
                        setAddModal(false);
                        }
                    " class="w-auto mr-1">
                    <Lucide icon="XSquare" class="w-4 h-4 mr-2" />
                    </button>
            </Dialog.Title>
        <form class="validate-form" @submit.prevent="onSubmit1">
        <Dialog.Description class="text-xs w-full h-full">
        <div class="grid grid-cols-12 col-span-12 gap-4 gap-y-3 p-2">
            <p class="col-span-12 sm:col-span-12 w-full p-2 bg-primary text-center text-slate-50 text-lg">
                <h2>Add Employee to Travel</h2>
            </p>
            <div class="col-span-12 md:col-span-12">
                <FormLabel htmlFor="modal-form-3">Employee Name</FormLabel>
                <TomSelect
                    v-model="selectEmployee"
                    :options="{
                    placeholder: 'Select item below. If others please specify.',
                    }"
                    class="w-full" required :disabled="(formTO.status!=='For Approval')?true:false"
                >
                    <option v-for="item in employeeList" :value="item['id']" :key="item['id']">{{item['lname']+', '+item['fname']}}</option>
                    <option :value="formTODetail.userId">{{formTODetail.fullName}}</option>
                </TomSelect>
            </div>
            <div class="col-span-12 md:col-span-12">
                <div class="col-span-12 sm:col-span-12">
                    <div class="col-span-12 sm:col-span-3">
                      <FormLabel  htmlFor="modal-form-1">Destination (Barangay / Municipality or City / Region)  </FormLabel>
                      <FormInput
                        type="text"
                        placeholder="Search Barangay..."
                        @focus="showSearchBrgy"
                        @blur="hideSearchBrgy"
                        v-model="addressSelect.addressName"
                        :disabled="(formTO.status!=='For Approval')?true:false"
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
            </div>
            <div class="col-span-12 md:col-span-6">
                <FormLabel htmlFor="modal-form-3">No. of Days</FormLabel>
                <FormInput type="number" v-model="formTODetail.noOfDay" class="col-span-12 sm:col-span-6" required :disabled="(formTO.status!=='For Approval')?true:false" />
            </div>
            <div class="col-span-12 md:col-span-6">
                <FormLabel htmlFor="modal-form-3">Travel Expense</FormLabel>
                <FormInput type="text" v-model="formTODetail.travelExpense" class="col-span-12 sm:col-span-6" required :disabled="(formTO.status!=='For Approval')?true:false"/>
            </div>
            <div class="col-span-12 md:col-span-6">
                <FormLabel htmlFor="modal-form-3">Departure Month</FormLabel>
                <FormInput type="month" v-model="formTODetail.departureMonth" class="col-span-12 sm:col-span-6" required :disabled="(formTO.status!=='For Approval')?true:false"/>
            </div>
            <div class="col-span-12 md:col-span-6">
                <FormLabel htmlFor="modal-form-3">Arrival Month</FormLabel>
                <FormInput type="month" v-model="formTODetail.arrivalMonth" class="col-span-12 sm:col-span-6" required :disabled="(formTO.status!=='For Approval')?true:false"/>
            </div>
            <div class="col-span-4 sm:col-span-12" v-if="formTO.status!=='For Approval'">
              <FormLabel htmlFor="modal-form-3"> CA Scanned URL</FormLabel>
              <div class="grid grid-cols-12 gap-5 mt-5 intro-y">
                <div class="col-span-11 sm:col-span-11">
                  <FormInput type="url" v-model="formTODetail.certificateOfAppearance" class="col-span-12 sm:col-span-6"  :required="(formTO.status!=='For Approval')?true:false"/>
                </div>
                <div class="col-span-1 sm:col-span-1">
                  <Button type="button" class="-ml-5 bg-primary" 
                      as="poScannedView" variant="dark"
                      v-on:click="openUrl(formTODetail.certificateOfAppearance)" v-if="formTODetail.certificateOfAppearance!==''">
                      <Lucide icon="Eye"></Lucide>
                  </Button>
                </div>
              </div>
            </div>
            <div class="col-span-12 md:col-span-12">
                <FormLabel htmlFor="modal-form-3">Inclusive Date</FormLabel>
                <ClassicEditor v-model="formTODetail.inclusiveDate" :disabled="(formTO.status!=='For Approval')?true:false"/>
            </div>

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
            <Button type="submit" variant="primary" elevated class="w-auto" >
                <Lucide icon="Save" class="w-4 h-4 mr-2" />{{ buttonTitle }}
            </Button>
        </Dialog.Footer>
        </form>
        </Dialog.Panel>
        </Dialog>
<!-- END: Modal Content -->
</template>
