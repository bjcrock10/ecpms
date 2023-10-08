<script lang="ts">
export default {
  inheritAttrs: false,
};
</script>

<script setup lang="ts">
import Lucide from "../../base-components/Lucide";
import { Menu, Dialog } from "../../base-components/Headless";
import {ref, onMounted, inject, watch, provide } from "vue";
import ProductDataService from "../../services/ProductDataService";
import ResponseData from "../../types/response";
import { FormSwitch, FormInput, FormSelect, InputGroup, FormLabel, FormTextarea} from "../../base-components/Form";
import TomSelect from "../../base-components/TomSelect";
import Button from "../../base-components/Button";
import { useProduct } from "../../types/product.d";
import { tabulatorFunc } from "../../types/tabulator.d";
import Notification from "../../base-components/Notification";
import { NotificationElement } from "../../base-components/Notification";
import Toastify from "toastify-js";
import { createIcons, icons } from "lucide";
import { useRouter } from "vue-router"; 
import LoadingIcon from "../../base-components/LoadingIcon";

const {formProduct, columnData} = useProduct();
const {initTabulator, reInitOnResizeWindow, 
filter, onFilter, 
onExportCsv, onExportHtml, 
onExportJson, onExportXlsx, 
onPrint, onResetFilter, tabulator, loadingIcon} = tabulatorFunc();

interface Product {
    business?: any;
}
const props = defineProps<Product>();
const tableClient = ref<HTMLDivElement>();
const addModal = ref(false);
const message = ref("");
const messageDetail = ref("");
const sendButtonRef = ref(null);
const selectProduct = ref(["1"]);
const selectCertification = ref(["1"]);
const selectUom = ref(["1"]);
const buttonTitle = ref("");
const onSubmit = async () =>{
    formProduct.productName = selectProduct.value.toString();
    formProduct.certification = selectCertification.value.toString();
    formProduct.uom = selectUom.value.toString();
    if(formProduct.id === "0"){
      ProductDataService.create(formProduct).then((response: ResponseData)=>{
        successNotification.value.showToast();
        addModal.value = false;
        messageDetail.value = "You successfully added new data...";
        tabulator.value?.addData(response.data);
      }).catch((e: Error)=>{
        console.log(e.message)
      }).finally(()=>{
        selectProduct.value = (["1"]);
        selectCertification.value = (["1"]);
        selectUom.value = (["1"]);
        formProduct.brandName = ""
        formProduct.size = ""
        formProduct.productionCapacity = ""
      })
    }
    else{
      ProductDataService.update(formProduct.id,formProduct).then((response: ResponseData)=>{
        successNotification.value.showToast();
        addModal.value = false;
        messageDetail.value = "You successfully updated new data...";
        dataTable();
      }).catch((e: Error)=>{
        console.log(e.message)
      }).finally(()=>{
        selectProduct.value = (["1"]);
        selectCertification.value = (["1"]);
        selectUom.value = (["1"]);
        formProduct.brandName = ""
        formProduct.size = ""
        formProduct.productionCapacity = ""
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
const dataTable = () =>{
  initTabulator(columnData.value, ProductDataService, tableClient,props.business,true);
  reInitOnResizeWindow();
  tabulator.value?.on("rowClick",(e, cell)=>{
    formProduct.id = cell.getData().id
    selectProduct.value = ([cell.getData().productName])
    formProduct.certification = cell.getData().certification
    selectCertification.value = ([cell.getData().certification])
    selectUom.value = ([cell.getData().uom])
    formProduct.productionCapacity = cell.getData().productionCapacity
    formProduct.size = cell.getData().size
    formProduct.brandName = cell.getData().brandName
    addModal.value = true
    buttonTitle.value = "Update"
  })
};
onMounted(() => {
    dataTable();
    formProduct.business = props.business;
});
</script>

<template>
    <div class="flex w-full mt-4 sm:w-auto sm:mt-0">
        <Button class="mr-2 shadow-md" as="a" href="#" variant="primary" @click="(event: MouseEvent) => {
            event.preventDefault();
            setAddModal(true);
          }" v-if="formProduct.business!=='0'">
          Add New Product
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
          <Dialog.Panel>
              <Dialog.Title>
                  <h2 class="mr-auto text-base font-medium">
                     Adding Product
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
                          <div class="col-span-12 md:col-span-6">
                            <FormLabel htmlFor="modal-form-3">Product Name</FormLabel>
                            <TomSelect
                              v-model="selectProduct"
                              :options="{
                                placeholder: 'Select item below. If others please specify.',
                                persist: false,
                                createOnBlur: true,
                                create: true,
                                maxItems:1
                              }"
                              class="w-full" multiple required
                            >
                              <option value="Virgin Coconut Oil">Virgin Coconut Oil</option>
                              <option value="Cooking Oil">Cooking Oil</option>
                              <option value="Coconut Water Concentrate">Coconut Water Concentrate</option>
                              <option value="Bahalina">Bahalina</option>
                              <option value="Vinegar">Vinegar</option>
                              <option value="Coconut sweetener (sugar)">Coconut sweetener (sugar)</option>
                              <option value="Coconut-based Pastries and Delicacies">Coconut-based Pastries and Delicacies</option>
                              <option value="Charcoal Briquettes">Charcoal Briquettes</option>
                              <option value="Coco Fiber/Coco Coir">Coco Fiber/Coco Coir</option>
                              <option value="Coco Peat">Coco Peat</option>
                              <option value="Coconut Handicrafts">Coconut Handicrafts</option>
                              <option value="Oil Products">Oil Products (e.g. Liniment Oil, Ointment, Massage oil etc.)</option>
                              <option value="Supplements">Supplements</option>
                              <option value="Skincare Products">Skincare Products (e.g. Lotion)</option>
                              <option value="Hair Care Products">Hair Care Products (e.g. Shampoo)</option>
                              <option value="Body Care Products">Body Care Products (e.g. Soap)</option>
                              <option :value="formProduct.productType">{{formProduct.productType}}</option>
                            </TomSelect>
                          </div>
                          <div class="col-span-12 md:col-span-6">
                            <FormLabel htmlFor="modal-form-3">UOM</FormLabel>
                            <TomSelect
                              v-model="selectUom"
                              :options="{
                                placeholder: 'Select item below. If others please specify.',
                                persist: false,
                                createOnBlur: true,
                                create: true,
                                maxItems:1
                              }"
                              class="w-full" multiple required
                            >
                              <option value="Milliliter">Milliliter</option>
                              <option value="Liter">Liter</option>
                              <option value="Gallon">Gallon</option>
                              <option value="Piece/s">Piece/s</option>
                              <option value="Kilo/s">Kilo/s</option>
                              <option value="Lot/s">Lot</option>
                              <option value="Box/es">Box</option>
                              <option value="Pack/s">Pack/s</option>
                              <option :value="formProduct.uom">{{formProduct.uom}}</option>
                            </TomSelect>
                          </div>
                          <div class="col-span-12 sm:col-span-6">
                            <FormLabel htmlFor="modal-form-3">Size</FormLabel>
                            <FormInput v-model="formProduct.size" 
                              type="number" placeholder="" required/>
                          </div>
                          <div class="col-span-12 sm:col-span-6">
                            <FormLabel htmlFor="modal-form-3">Production Capacity per Month</FormLabel>
                            <FormInput v-model="formProduct.productionCapacity" 
                              type="text" placeholder="" required/>
                          </div>
                          <div class="col-span-12 sm:col-span-6">
                            <FormLabel htmlFor="modal-form-3">Brand Name</FormLabel>
                            <FormInput v-model="formProduct.brandName" 
                              type="text" placeholder="" required/>
                          </div>
                          <div class="col-span-12 md:col-span-6">
                            <FormLabel htmlFor="modal-form-3">Product Certification</FormLabel>
                            <TomSelect
                              v-model="selectCertification"
                              :options="{
                                placeholder: 'Select item below. If others please specify.',
                              }"
                              class="w-full" multiple
                            >
                              <option value="FDA-CPR">FDA-CPR</option>
                              <option value="HALAL">HALAL</option>
                              <option :value="formProduct.certification">{{formProduct.certification}}</option>
                            </TomSelect>
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
                <option value="productName">Product</option>
                <option value="brandName">Brand Name</option>
                <option value="certification">Certification</option>
                <option value="size">Size</option>
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
