<script lang="ts">
export default {
  inheritAttrs: false,
};
</script>

<script setup lang="ts">
import Lucide from "../../base-components/Lucide";
import { Menu, Dialog } from "../../base-components/Headless";
import {ref, onMounted, inject, watch, provide } from "vue";
import AssistanceDataService from "../../services/AssistanceDataService";
import ResponseData from "../../types/response";
import { FormSwitch, FormInput, FormSelect, InputGroup, FormLabel, FormTextarea} from "../../base-components/Form";
import TomSelect from "../../base-components/TomSelect";
import Button from "../../base-components/Button";
import { TransitionRoot } from "@headlessui/vue";
import { useAssistance } from "../../types/assistance.d";
import { tabulatorFunc } from "../../types/tabulator.d";
import Notification from "../../base-components/Notification";
import { NotificationElement } from "../../base-components/Notification";
import Toastify from "toastify-js";
import { createIcons, icons } from "lucide";
import { useRouter } from "vue-router"; 
import LoadingIcon from "../../base-components/LoadingIcon";
import { ClassicEditor } from "../../base-components/Ckeditor";

const {formAssistance, columnData} = useAssistance();
const {initTabulator, reInitOnResizeWindow, 
filter, onFilter, 
onExportCsv, onExportHtml, 
onExportJson, onExportXlsx, 
onPrint, onResetFilter, tabulator, loadingIcon} = tabulatorFunc();

interface Client {
    clientId?: any;
    business?: any;
}
const props = defineProps<Client>();
const tableClient = ref<HTMLDivElement>();
const addModal = ref(false);
const message = ref("");
const messageDetail = ref("");
const sendButtonRef = ref(null);
const selectAssistance = ref([""]);
const selectSubType = ref([""]);
const selectMsmeProgram = ref(["0"]);
const selectReferTo = ref(["1"]);
const buttonTitle = ref("Save");
const msmeProgram = ref([])
const assistanceType = ref([])
const subTypeAssistance = ref([])
const resetFields = () =>{
    selectAssistance.value = (["0"]);
    selectSubType.value = (["0"]);
    selectMsmeProgram.value = (["0"]);
    selectReferTo.value = (["0"]);
    formAssistance.title = ""
    formAssistance.jobsGen = ""
    formAssistance.amountLoan = ""
    formAssistance.assistanceRemarks = ""
    formAssistance.edtLevel = ""
    formAssistance.digitalLevel = ""
    formAssistance.investmentGen = ""
    formAssistance.domesticSalesGen = ""
    formAssistance.exportSalesGen = ""
    formAssistance.dateProvidedFrom = ""
    formAssistance.dateProvidedTo = ""
}
const onSubmit = async () =>{
    formAssistance.assistanceType = selectAssistance.value.toString();
    formAssistance.subTypeAssistance = selectSubType.value.toString();
    formAssistance.msmeProgram = selectMsmeProgram.value.toString();
    formAssistance.referTo = selectReferTo.value.toString();
    if(formAssistance.id === "0"){
    AssistanceDataService.create(formAssistance).then((response: ResponseData)=>{
        successNotification.value.showToast();
        addModal.value = false;
        messageDetail.value = "You successfully added new data...";
        // tabulator.value?.addData(response.data);
        dataTable();
      }).catch((e: Error)=>{
        console.log(e.message)
      }).finally(()=>{
        resetFields();
      })
    }
    else{
    AssistanceDataService.update(formAssistance.id,formAssistance).then((response: ResponseData)=>{
        successNotification.value.showToast();
        addModal.value = false;
        messageDetail.value = "You successfully updated new data...";
        dataTable();
      }).catch((e: Error)=>{
        console.log(e.message)
      }).finally(()=>{
        resetFields();
      })
    }
};
const setAddModal = (value: boolean) => {
  addModal.value = value;
};
const successNotification = ref();
provide("bind[successNotification]", (el: any) => {
  // Binding
  successNotification.value = el;
  });
  
watch(selectAssistance, (assistanceTitle, prevAddProjectModal) => {
  loadAssistanceSubType(assistanceTitle);
})
const loadAssistanceSubType = (assistanceTitle: any) => {
  let assistanceID = "0"
  assistanceType.value.forEach(element => {
    if(element['title']===assistanceTitle){
        assistanceID = element['id']
        return;
    }
  });
  AssistanceDataService.getAllSubtypeAssistance(assistanceID).then((response: ResponseData)=>{
      subTypeAssistance.value = response.data
  })
}
const dataTable = () =>{
  initTabulator(columnData.value, AssistanceDataService, tableClient,props.business,true);
  reInitOnResizeWindow();
  tabulator.value?.on("rowClick",(e, cell)=>{
    formAssistance.id = cell.getData().id
    selectAssistance.value = ([cell.getData().assistanceType])
    loadAssistanceSubType(cell.getData().assistanceType)
    selectMsmeProgram.value = cell.getData().msmeProgram
    selectSubType.value = ([cell.getData().subTypeAssistance])
    selectReferTo.value = ([cell.getData().referTo])
    formAssistance.assistanceRemarks = cell.getData().assistanceRemarks
    formAssistance.dateAvailment = cell.getData().dateAvailment
    formAssistance.edtLevel = cell.getData().edtLevel
    formAssistance.digitalLevel = cell.getData().digitalLevel
    formAssistance.jobsGen = cell.getData().jobsGen
    formAssistance.investmentGen = cell.getData().investmentGen
    formAssistance.domesticSalesGen = cell.getData().domesticSalesGen
    formAssistance.exportSalesGen = cell.getData().exportSalesGen
    formAssistance.amountLoan = cell.getData().amountLoan
    formAssistance.dateProvidedFrom = cell.getData().dateProvidedFrom
    formAssistance.dateProvidedTo = cell.getData().dateProvidedTo
    formAssistance.assistanceRemarks = cell.getData().assistanceRemarks
    formAssistance.title = cell.getData().title
    addModal.value = true
    buttonTitle.value = "Update"
  })
};
onMounted(async () => {
    dataTable();
    formAssistance.business = props.business;
    formAssistance.client = props.clientId;
    AssistanceDataService.getAllMsmeProgram().then((response: ResponseData)=>{
        msmeProgram.value = response.data
    }).catch((e: Error)=>{
        console.log(e.message)
    })
    AssistanceDataService.getAllTypeOfAssistance().then((response: ResponseData)=>{
        assistanceType.value = response.data
    }).catch((e: Error)=>{
        console.log(e.message)
    })
});
</script>

<template>
    <div class="flex w-full mt-4 sm:w-auto sm:mt-0">
        <Button class="mr-2 shadow-md" as="a" href="#" variant="primary" @click="(event: MouseEvent) => {
            event.preventDefault();
            setAddModal(true);
          }" v-if="props.business!=='0'">
          Add New Assistance
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
        <!-- BEGIN: Modal Content -->
        <Dialog size="xl" :open="addModal" @close="
                        () => {
                          setAddModal(false);
                        }
                      " :initialFocus="sendButtonRef">
          <Dialog.Panel class="z-40 top-0 left-0 w-full h-full outline-none overflow-x-hidden overflow-y-auto">
              <Dialog.Title>
                  <h2 class="mr-auto text-base font-medium">
                     Adding Assistance
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
                <Dialog.Description class="text-xs w-full h-full">
                  <div class="grid grid-cols-12 col-span-12 gap-4 gap-y-3 p-2">
                    <p class="col-span-12 sm:col-span-12 w-full p-2 bg-primary text-center text-slate-50 text-lg">
                        <h2>Client Assistance Monitoring</h2>
                    </p>
                    <div class="col-span-12 md:col-span-6">
                        <FormLabel htmlFor="modal-form-3">MSME Programs</FormLabel>
                        <TomSelect
                          v-model="selectMsmeProgram"
                          :options="{
                            placeholder: 'Select item below. If others please specify.',
                          }"
                          class="w-full" multiple
                        >
                          <option v-for="item in msmeProgram" :value="item['title']" :key="item['id']">{{item['title']}}</option>
                          <!-- <option :value="formAssistance.msmeProgram">{{formAssistance.msmeProgram}}</option> -->
                        </TomSelect>
                      </div>
                      <div class="col-span-12 sm:col-span-6">
                        <FormLabel htmlFor="modal-form-3">Date of Availment / Enrolled</FormLabel>
                        <FormInput v-model="formAssistance.dateAvailment" 
                          type="date" placeholder="" required/>
                      </div>
                      <div class="col-span-12 md:col-span-6">
                            <FormLabel  htmlFor="modal-form-1">Assistance Level (EDT)</FormLabel>
                            <FormSelect form-select-size="sm"  v-model="formAssistance.edtLevel" class="col-span-12 md:col-span-3">
                                <option value="Level 0 – Potential Entrepreneurs">Level 0 – Potential Entrepreneurs-</option>
                                <option value="Level 1 – Nurturing Startup">Level 1 – Nurturing Startup</option>
                                <option value="Level 1.1 (Unregistered)">Level 1.1 (Unregistered)</option>
                                <option value="Level 1.2 (Partially Registered)">Level 1.2 (Partially Registered)</option>
                                <option value="Level 2 – Growing Entrepreneurs">Level 2 – Growing Entrepreneurs</option>
                                <option value="Level 3 – Expanding Enterprises">Level 3 – Expanding Enterprises</option>
                                <option value="Level 4 – Sustaining Enterprises">Level 4 – Sustaining Enterprises</option>
                            </FormSelect>
                        </div>
                        <div class="col-span-12 md:col-span-6">
                            <FormLabel  htmlFor="modal-form-1">Level of Digitalization</FormLabel>
                            <FormSelect form-select-size="sm"  v-model="formAssistance.digitalLevel" class="col-span-12 md:col-span-3">
                                <option value="Level 0 – No use of Digital Tools">Level 0 – No use of Digital Tools</option>
                                <option value="Level 1 – Basic. MSMEs that use Basic Digital Tools for Business">Level 1 – Basic. MSMEs that use Basic Digital Tools for Business</option>
                                <option value="Level 2 – Intermediate. MSMEs that have an Online Presence">Level 2 – Intermediate. MSMEs that have an Online Presence</option>
                                <option value="Level 3 – Advanced. Use of Advanced Digital Tools">Level 3 – Advanced. Use of Advanced Digital Tools</option>
                            </FormSelect>
                        </div>
                    <div class="col-span-12 md:col-span-6">
                        <FormLabel htmlFor="modal-form-3">Assistance Type</FormLabel>
                        <TomSelect
                            v-model="selectAssistance"
                            :options="{
                            placeholder: 'Select item below. If others please specify.',
                            }"
                            class="w-full" required
                        >
                            <option v-for="item in assistanceType" :value="item['title']" :key="item['id']">{{item['title']}}</option>
                            <option :value="formAssistance.assistanceType">{{formAssistance.assistanceType}}</option>
                        </TomSelect>
                    </div>
                    <div class="col-span-12 md:col-span-6">
                        <FormLabel htmlFor="modal-form-3">Sub-type</FormLabel>
                        <TomSelect
                            v-model="selectSubType"
                            :options="{
                            placeholder: 'Select item below. If others please specify.',
                            persist: false,
                            createOnBlur: true,
                            create: true,
                            maxItems:1
                            }"
                            class="w-full" multiple required
                        >
                           <option v-for="item in subTypeAssistance" :value="item['title']" :key="item['id']">{{item['title']}}</option>
                           <option :value="formAssistance.subTypeAssistance">{{formAssistance.subTypeAssistance}}</option>
                        </TomSelect>
                    </div>
                    <div class="col-span-12 sm:col-span-12">
                        <FormLabel htmlFor="modal-form-3">Title</FormLabel>
                        <FormInput v-model="formAssistance.title" 
                            type="text" placeholder="" required/>
                    </div>
                    <div class="col-span-12 sm:col-span-12">
                        <FormLabel htmlFor="modal-form-3">Remarks</FormLabel>
                        <ClassicEditor v-model="formAssistance.assistanceRemarks" />
                    </div>
                    <p class="col-span-12 sm:col-span-12 w-full p-2 bg-primary text-center text-slate-50 text-lg">
                        <h2>Bottomline</h2>
                    </p>
                    <div class="col-span-12 sm:col-span-6">
                        <FormLabel htmlFor="modal-form-3">Jobs Generated</FormLabel>
                        <FormInput v-model="formAssistance.jobsGen" 
                            type="number" placeholder="" required/>
                    </div>
                    <div class="col-span-12 sm:col-span-6">
                        <FormLabel htmlFor="modal-form-3">Investment Generated</FormLabel>
                        <FormInput v-model.number="formAssistance.investmentGen" 
                            type="number" placeholder="" required/>
                    </div>
                    <div class="col-span-12 sm:col-span-6">
                        <FormLabel htmlFor="modal-form-3">Domestic Sales Generated</FormLabel>
                        <FormInput v-model.number="formAssistance.domesticSalesGen" 
                            type="number" placeholder="" required/>
                    </div>
                    <div class="col-span-12 sm:col-span-6">
                        <FormLabel htmlFor="modal-form-3">Export Sales Generated</FormLabel>
                        <FormInput v-model.number="formAssistance.exportSalesGen" 
                            type="number" placeholder="" required/>
                    </div>
                    <div class="col-span-12 sm:col-span-6">
                        <FormLabel htmlFor="modal-form-3">Amount of Loan / Grant</FormLabel>
                        <FormInput v-model.number="formAssistance.amountLoan" 
                            type="number" placeholder="" required/>
                    </div>
                    <div class="col-span-12 md:col-span-6">
                        <FormLabel htmlFor="modal-form-3">Refer to</FormLabel>
                        <TomSelect
                            v-model="selectReferTo"
                            :options="{
                            placeholder: 'Select item below. If others please specify.',
                            persist: false,
                            createOnBlur: true,
                            create: true,
                            maxItems:1
                            }"
                            class="w-full" multiple required
                        >
                            <option value="PCA">PCA</option>
                            <option value="TESDA">TESDA</option>
                            <option value="ATI">ATI</option>
                            <option value="Negosyo Center">Negosyo Center</option>
                            <option :value="formAssistance.referTo">{{formAssistance.referTo}}</option>
                        </TomSelect>
                    </div>
                    <p class="col-span-12 sm:col-span-12 w-full p-2 bg-primary text-center text-slate-50 text-lg">
                        <h2>Date Provided</h2>
                    </p>
                    
                    <div class="col-span-12 sm:col-span-6">
                        <FormLabel htmlFor="modal-form-3">Date Provided From</FormLabel>
                        <FormInput v-model="formAssistance.dateProvidedFrom" 
                            type="date" placeholder="" required/>
                    </div>
                    <div class="col-span-12 sm:col-span-6">
                        <FormLabel htmlFor="modal-form-3">Date Provided To</FormLabel>
                        <FormInput v-model="formAssistance.dateProvidedTo" 
                            type="date" placeholder="" required/>
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
                    <Button type="submit" variant="primary" elevated class="w-auto" v-if="props.business!=='0'">
                      <Lucide icon="Save" class="w-4 h-4 mr-2" />{{buttonTitle}}
                    </Button>
                </Dialog.Footer>
              </form>
          </Dialog.Panel>
        </Dialog>
        <!-- END: Modal Content -->
      </div>
    <!-- BEGIN: HTML Table Data -->
    <div class="p-5 mt-5 intro-y sm:overf">
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
            <label class="flex flex-col w-12 mr-2 xl:w-auto xl:flex-initial">
                Field
            </label>
            <FormSelect
                id="tabulator-html-filter-field"
                v-model="filter.field"
                class="w-full mt-2 2xl:w-full sm:mt-0 sm:w-auto"
            >
                <option value="id">No.</option>
                <option value="assistanceType">Product</option>
                <option value="subTypeAssistance">Brand Name</option>
                <option value="msmeProgram">Certification</option>
                <option value="dateAvailment">Size</option>
            </FormSelect>
            </div>
            <div class="flex items-center mt-2 sm:flex sm:mr-4 xl:mt-0">
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
            <div class="flex items-center mt-2 sm:flex sm:mr-4 xl:mt-0">
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
            <div class="flex mt-2 xl:mt-0">
              <Button variant="primary" class="mb-2 mr-1" id="tabulator-html-filter-go" @click="onFilter">
                    <Lucide icon="Search" class="w-5 h-5" />
                </Button>
                <Button variant="secondary" class="mb-2 mr-1" id="tabulator-html-filter-reset" 
                    @click="onResetFilter('productName')">
                    <Lucide icon="RefreshCcw" class="w-5 h-5" />
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
        <div class="overflow-x-auto scrollbar-hidden overflow-scroll">
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
