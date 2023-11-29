<script lang="ts">
    export default {
        inheritAttrs: false,
    };
</script>
<script setup lang="ts">
    import Lucide from "../../base-components/Lucide";
    import { Menu, Dialog } from "../../base-components/Headless";
    import {ref, onMounted, inject, watch, provide } from "vue";
    import ResponseData from "../../types/response";
    import { FormSwitch, FormInput, FormSelect, InputGroup, FormLabel, FormTextarea} from "../../base-components/Form";
    import TomSelect from "../../base-components/TomSelect";
    import Button from "../../base-components/Button";
    import { TransitionRoot } from "@headlessui/vue";
    import { useTravelOrder } from "../../types/travelorder.d";
    import { tabulatorFunc } from "../../types/tabulator.d";
    import Notification from "../../base-components/Notification";
    import { NotificationElement } from "../../base-components/Notification";
    import Toastify from "toastify-js";
    import { createIcons, icons } from "lucide";
    import { useRouter } from "vue-router"; 
    import LoadingIcon from "../../base-components/LoadingIcon";
    import { ClassicEditor } from "../../base-components/Ckeditor";
    import TravelOrderDetailService from '../../services/TravelOrderDetail';
    import LocationDataService from "../../services/LocationDataService";
    import UserDataService from '../../services/UserDataService';
    const {columnData, formTODetail, brgySelect, addressSelect, brgyDropdown, showSearchBrgy, hideSearchBrgy, checkBa, current_date, current_time} = useTravelOrder();
    const {initTabulatorSearchTO, reInitOnResizeWindow, 
    filter, onFilter, 
    onExportCsv, onExportHtml, 
    onExportJson, onExportXlsx, 
    onPrint, onResetFilter, tabulator, loadingIcon} = tabulatorFunc();
    const onSubmit = () =>{

    }
    const employeeList = ref([])
    const selectEmployee = ref([""]);
    onMounted(async ()=>{
        UserDataService.getAll().then((response: ResponseData)=>{
            employeeList.value = response.data
        })
    })
</script>
<template>
    <form class="validate-form" @submit.prevent="onSubmit">
        <div class="grid grid-cols-12 col-span-12 gap-4 gap-y-3 p-2">
            <p class="col-span-12 sm:col-span-12 w-full p-2 bg-primary text-center text-slate-50 text-lg">
                <h2>Search TO Details</h2>
            </p>
            <div class="col-span-12 md:col-span-12">
                <FormLabel htmlFor="modal-form-3">Employee Name</FormLabel>
                <TomSelect
                    v-model="selectEmployee"
                    :options="{
                    placeholder: 'Select item below. If others please specify.',
                    }"
                    class="w-full" required>
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
                        v-model="addressSelect.addressName" required
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
                <FormLabel htmlFor="modal-form-3">Departure Month</FormLabel>
                <FormInput type="month" v-model="formTODetail.departureMonth" class="col-span-12 sm:col-span-6" required />
            </div>
        </div>
    </form>
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
</template>