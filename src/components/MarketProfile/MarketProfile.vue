<script lang="ts">
export default {
  inheritAttrs: false,
};
</script>

<script setup lang="ts">
import _ from "lodash";
import Lucide from "../../base-components/Lucide";
import fakerData from "../../utils/faker";
import { Menu, Dialog } from "../../base-components/Headless";
import {ref, onMounted, inject, watch, provide } from "vue";
import MarketProfileDataService from "../../services/MarketProfileDataService";
import LocationDataService from "../../services/LocationDataService";
import ResponseData from "../../types/response";
import { FormSwitch, FormInput, FormSelect, InputGroup, FormLabel, FormTextarea} from "../../base-components/Form";
import TomSelect from "../../base-components/TomSelect";
import Button from "../../base-components/Button";
import { TransitionRoot } from "@headlessui/vue";
import { useMarketProfile } from "../../types/marketprofile.d";
import { tabulatorFunc } from "../../types/tabulator.d";
import Notification from "../../base-components/Notification";
import { NotificationElement } from "../../base-components/Notification";
import Toastify from "toastify-js";
import { createIcons, icons } from "lucide";
import { useRouter } from "vue-router"; 
import ProductDataService from '../../services/ProductDataService';
import { options } from "dropzone";
import LoadingIcon from "../../base-components/LoadingIcon";
import Table from "../../base-components/Table";
import { Disclosure } from "../../base-components/Headless";

const {formMarketProfile, columnData, country, formMaterialSource} = useMarketProfile();
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
const selectProduct = ref();
const selectCountry = ref(["1"]);
const buttonTitle = ref("Save");
const brgyDropdown = ref(false);
const rounded = ref(false);
const showSearchBrgy = () => {
    brgyDropdown.value = true;
};
const hideSearchBrgy = () => {
    brgyDropdown.value = false;
};
const onSubmit = async () =>{
    formMarketProfile.country = selectCountry.value.toString();
    if(formMarketProfile.id === "0"){
      MarketProfileDataService.create(formMarketProfile).then((response: ResponseData)=>{
        successNotification.value.showToast();
        addModal.value = false;
        messageDetail.value = "You successfully added new data...";
      }).catch((e: Error)=>{
        console.log(e.message)
      }).finally(()=>{
        selectProduct.value = (["1"]);
        selectCountry.value = (["1"]);
        formMarketProfile.product = "";
        formMarketProfile.size = "";
        formMarketProfile.productionCapacity = "";
        formMarketProfile.id="0";
        selectCountry.value = (["1"]);
      })
    }
    else{
      MarketProfileDataService.update(formMarketProfile.id,formMarketProfile).then((response: ResponseData)=>{
        successNotification.value.showToast();
        addModal.value = false;
        messageDetail.value = "You successfully updated new data...";
        
      }).catch((e: Error)=>{
        console.log(e.message)
      }).finally(()=>{
        selectProduct.value = (["1"]);
        selectCountry.value = (["1"]);
        formMarketProfile.product = "";
        formMarketProfile.size = "";
        formMarketProfile.productionCapacity = "";
        formMarketProfile.id="0";
        selectCountry.value = (["1"]);
      })
    }
    dataTable();
};
const loadMaterialSources = (id: any) => {
    MarketProfileDataService.getByBusinessSourcing(id).then((response: ResponseData)=>{
        sourcesList.value = response.data
    })
}
const loadProducts = (id: any) => {
    ProductDataService.getByBusiness(props.business).then((response: ResponseData)=>{
        dataProduct.value = response.data
    })
}
const onAddSources = async () => {
  formMaterialSource.business = props.business
  MarketProfileDataService.createSourcing(formMaterialSource).then((response: ResponseData)=>{
    loadMaterialSources(props.business)
    formMaterialSource.location = ""
    formMaterialSource.volume = ""
  }).catch((e:Error)=>{
    console.log(e.message)
  })
}
const removeSources = async (id: any) =>{
    MarketProfileDataService.deleteSourcing(id).then((response: ResponseData)=>{
        loadMaterialSources(props.business)
    }).catch((e:Error)=>{
        console.log(e.message)
    })
}
const deleteMarket = (id: any) =>{
    if(confirm('are you sure?')){
        MarketProfileDataService.delete(id).then((response: ResponseData)=>{
            message.value = "Successfully Deleted!!!"
            messageDetail.value = "The item selected was permanently deleted from the record."
            successNotification.value.showToast();
            addModal.value = false;
            dataTable();    
        })
    }
}
const setAddModal = (value: boolean) => {
    addModal.value = value;
    selectProduct.value = (1);
    selectCountry.value = (["1"]);
    formMarketProfile.product = "";
    formMarketProfile.size = "";
    formMarketProfile.productionCapacity = "";
    formMarketProfile.id="0";
    selectCountry.value = (["1"]);
    formMarketProfile.brandName = '';
    formMarketProfile.marketType = '';
    formMarketProfile.address = '';
    formMarketProfile.volume = '';
    formMarketProfile.exportStarted = '';
    buttonTitle.value = "Save"
};
const successNotification = ref();
const domesticDisabled = ref(false);
const exportDisabled = ref(false);
provide("bind[successNotification]", (el: any) => {
  // Binding
  successNotification.value = el;
  });
const dataTable = () =>{
  initTabulator(columnData.value, MarketProfileDataService, tableClient,props.business,true);
  reInitOnResizeWindow();
  tabulator.value?.on("rowClick",(e, cell)=>{
    formMarketProfile.id = cell.getData().id
    formMarketProfile.productName = cell.getData().productName.toString()
    formMarketProfile.certification = cell.getData().certification
    formMarketProfile.productionCapacity = cell.getData().productionCapacity
    formMarketProfile.size = cell.getData().size
    formMarketProfile.brandName = cell.getData().brandName
    formMarketProfile.marketType = cell.getData().marketType
    formMarketProfile.address = cell.getData().address
    formMarketProfile.volume = cell.getData().volume
    formMarketProfile.exportStarted = cell.getData().exportStarted
    addModal.value = true
    buttonTitle.value = "Update"
    if(cell.getData().marketType === "Domestic"){
        selectCountry.value =(['Philippines']);
        exportDisabled.value = true;
        domesticDisabled.value = false;
        formMarketProfile.exportStarted = ''
    }else{
        formMarketProfile.address = "Philippines"
        domesticDisabled.value = true;
        exportDisabled.value = false;
        selectCountry.value = ([cell.getData().country])
    }
  })
};
const dataProduct = ref([]);
const brgySelect = ref([]);
watch(selectProduct.value, (selectProduct, prevAddProjectModal) => {
    dataProduct.value.forEach(element => {
        if(element['productName'] === selectProduct)
        {
            formMarketProfile.productName = element['productName']
            formMarketProfile.product = element['id']
            formMarketProfile.productType =element['productType']
            formMarketProfile.productionCapacity = element['productionCapacity']
            formMarketProfile.uom = element['uom']
            formMarketProfile.size= element['size']
            formMarketProfile.business = element['business']
            formMarketProfile.brandName = element['brandName']
            formMarketProfile.certification = element['certification']
            return;
        }
        
    });
})
watch(
  () => (formMarketProfile.productName),(select, prevToe) => {
    dataProduct.value.forEach(element => {
        if(element['productName'] === select)
        {
            formMarketProfile.productName = element['productName']
            formMarketProfile.product = element['id']
            formMarketProfile.productType =element['productType']
            formMarketProfile.productionCapacity = element['productionCapacity']
            formMarketProfile.uom = element['uom']
            formMarketProfile.size= element['size']
            formMarketProfile.business = element['business']
            formMarketProfile.brandName = element['brandName']
            formMarketProfile.certification = element['certification']
            return;
        }
        
    });
}
)
watch(
  () => (formMarketProfile.marketType),(select, prevToe) => {
    if(select === "Domestic"){
        selectCountry.value =(['Philippines']);
        exportDisabled.value = true;
        domesticDisabled.value = false;
        formMarketProfile.exportStarted = ''
    }else{
        formMarketProfile.address = "Philippines"
        domesticDisabled.value = true;
        exportDisabled.value = false;
    }
    
  }
)
watch(
  () => (formMaterialSource.location), async(address, prevToe) => {
    if(address.length>4){
        LocationDataService.getBarangayVal(address).then((response: ResponseData)=>{
        brgySelect.value = response.data
        }).catch((e: Error)=>{
          console.log(brgySelect.value)
        })
      }
    }
);
const checkBa = (item: any) => {
      formMaterialSource.location = item.address
    }
const sourcesList = ref([]);
onMounted(() => {
    dataTable();
    formMarketProfile.business = props.business;
    loadProducts(props.business);
    loadMaterialSources(props.business);
    selectProduct.value = (["0"])
});
</script>

<template>
    <div class="flex w-full mt-4 sm:w-auto sm:mt-0">
        <Button class="mr-2 shadow-md" as="a" href="#" variant="primary" @click="(event: MouseEvent) => {
            event.preventDefault();
            setAddModal(true);
            loadProducts(formMarketProfile.business);
            loadMaterialSources(formMarketProfile.business);
            }" v-if="formMarketProfile.business!=='0'">
            Add Market Profile
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
                        Adding Market Profile
                    </h2>
                    <button type="button" variant="outline-secondary" @click="
                            () => {
                                setAddModal(false);
                            }
                            " class="w-auto mr-1">
                            <Lucide icon="XSquare" class="w-4 h-4 mr-2" />
                    </button>
                </Dialog.Title>
                <form  @submit.prevent="onSubmit">
                <Dialog.Description class="text-xs w-full h-full">
                    <div class="grid grid-cols-12 col-span-12 gap-4 gap-y-3 p-2">
                            <div class="col-span-12 md:col-span-6">
                            <FormLabel htmlFor="modal-form-3">Product Name</FormLabel>
                            <FormSelect  v-model="formMarketProfile.productName" required>
                                <option v-for="item in dataProduct" :value="item['productName']" :key="item['id']">{{item['productName']}}</option>
                            </FormSelect>
                            <!-- <TomSelect
                                v-model="selectProduct"
                                    :options="{
                                    placeholder: 'Select item below.',
                                    persist: false,
                                    createOnBlur: true,
                                    create: true,
                                    maxItems:1
                                }"
                                class="w-full">
                                <option v-for="item in dataProduct" :value="item['productName']" :key="item['id']">{{item['productName']}}</option>
                                <option :value="formMarketProfile.productName">{{formMarketProfile.productName}}</option>
                            </TomSelect> -->
                            </div>
                            <div class="col-span-12 sm:col-span-6">
                            <FormLabel  htmlFor="modal-form-1"> Type of Market </FormLabel>
                            <FormSelect  v-model="formMarketProfile.marketType" required>
                                <option value="Domestic">Domestic</option>
                                <option value="Export">Export</option>
                            </FormSelect>
                            </div>
                            <div class="col-span-12 sm:col-span-8">
                            <FormLabel htmlFor="modal-form-3">Address</FormLabel>
                            <FormInput v-model="formMarketProfile.address" 
                                type="text" placeholder="" required :disabled="domesticDisabled"/>
                            </div>
                            <div class="col-span-12 md:col-span-4">
                            <FormLabel htmlFor="modal-form-3">Country</FormLabel>
                            <TomSelect
                                v-model="selectCountry"
                                :options="{
                                placeholder: 'Select item below. If others please specify.',
                                }"
                                class="w-full" multiple :disabled="exportDisabled"
                            >
                                <option v-for="item in country"
                                :key="item.code" :value="item.name">{{item.name}}</option>
                                <option :value="formMarketProfile.country">{{formMarketProfile.country}}</option>
                            </TomSelect>
                            </div>
                            <div class="col-span-12 sm:col-span-6">
                            <FormLabel htmlFor="modal-form-3">Volume</FormLabel>
                            <FormInput v-model="formMarketProfile.volume" 
                                type="text" placeholder="" required />
                            </div>
                            <div class="col-span-12 sm:col-span-6">
                            <FormLabel htmlFor="modal-form-3">Export Started</FormLabel>
                            <FormInput v-model="formMarketProfile.exportStarted" 
                                type="number" placeholder="" required :disabled="exportDisabled"/>
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
                    <span class="ml-3"></span>
                    <Button type="submit" variant="primary" elevated class="w-auto" v-if="formMarketProfile.business!=='0'">
                        <Lucide icon="Save" class="w-4 h-4 mr-2" />{{buttonTitle}}
                    </Button>
                    <span class="ml-3"></span>
                    <Button type="button" variant="warning" elevated class="w-auto p-2" v-if="formMarketProfile.id!=='0'" @click="deleteMarket(formMarketProfile.id)">
                        <Lucide icon="Trash2" class="w-4 h-4 mr-2" />Remove
                    </Button>
                </Dialog.Footer>
                </form>
            </Dialog.Panel>
        </Dialog>
        <!-- END: Modal Content -->
        </div>
    <!-- BEGIN: HTML Table Data -->
    <div class="p-5 mt-5 intro-y">
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
                    <option value="productName">Product</option>
                    <option value="country">Country</option>
                    <option value="brandName">Brand Name</option>
                    <option value="certification">Certification</option>
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
    <Disclosure.Group variant="boxed" class="col-span-12 intro-y box lg:col-span-5">
        <Disclosure>
            <Disclosure.Button>
                Raw Material Sources
            </Disclosure.Button>
            <Disclosure.Panel class="leading-relaxed text-slate-600 dark:text-slate-500 sm:overflow-x-auto sm:scrollbar-hidden sm:overflow-scroll">
                <form class="validate-form p-2" @submit.prevent="onAddSources">
                    <div class="col-span-12 md:col-span-12">
                      <Table sm striped>
                        <Table.Thead>
                          <Table.Tr>
                            <Table.Th class="whitespace-nowrap w-auto sm:w-96 min-w-min"> LOCATION: (Brgy/ City / Province / Region) </Table.Th>
                            <Table.Th class="whitespace-nowrap w-auto sm:w-96 min-w-min"> Volume </Table.Th>
                            <Table.Th class="whitespace-nowrap w-auto sm:w-96 min-w-min"> Raw Mats </Table.Th>
                            <Table.Th class="whitespace-nowrap w-auto sm:w-96 min-w-min"> Contact Person </Table.Th>
                            <Table.Th class="w-1"></Table.Th>
                          </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                          <Table.Tr v-for="item in sourcesList" :key="item['id']" :value="item['id']" class="-p-10">
                            <Table.Td>{{item['location']}} </Table.Td>
                            <Table.Td>{{item['volume']}}</Table.Td>
                            <Table.Td>{{item['rawMaterial']}}</Table.Td>
                            <Table.Td>{{item['contactPerson']}}</Table.Td>
                            <Table.Td>
                              <Button type="button" variant="danger" class="mb-2 mr-1" @click="removeSources(item['id'])">
                                <Lucide icon="Trash2" class="w-4 h-4" />
                              </Button>
                            </Table.Td>
                          </Table.Tr>
                          <Table.Tr>
                              <Table.Td>
                                <FormInput form-input-size="sm" :rounded="rounded" v-model="formMaterialSource.id" 
                                type="text" placeholder="" class="col-span-12 md:col-span-12 hidden" required/>
                                <!-- <FormLabel  htmlFor="modal-form-1"> Name </FormLabel> -->
                                <!-- BEGIN: Search -->
                                <div class="col-span-12 md:col-span-12">
                                    <div class="col-span-12 md:col-span-12">
                                        <FormInput form-input-size="sm"
                                            type="text"
                                            placeholder="Search Barangay..."
                                            @focus="showSearchBrgy"
                                            @blur="hideSearchBrgy"
                                            v-model="formMaterialSource.location"
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
                              </Table.Td>
                              <Table.Td>
                                <FormInput form-input-size="sm" :rounded="rounded" v-model="formMaterialSource.volume" 
                                type="text" placeholder="Volume" class="col-span-12 md:col-span-4" required/>
                              </Table.Td>
                              <Table.Td>
                                <FormInput form-input-size="sm" :rounded="rounded" v-model="formMaterialSource.rawMaterial" 
                                type="text" placeholder="Raw Materials" class="col-span-12 md:col-span-4" required/>
                              </Table.Td>
                              <Table.Td>
                                <FormInput form-input-size="sm" :rounded="rounded" v-model="formMaterialSource.contactPerson" 
                                type="text" placeholder="Contact Person" class="col-span-12 md:col-span-4" required/>
                              </Table.Td>
                              <Table.Td>
                                <Button type="submit" variant="primary" class="mb-2 mr-1" v-if="formMarketProfile.business!=='0'">
                                  <Lucide icon="Plus" class="w-5 h-5" />
                                </Button>
                              </Table.Td>
                            </Table.Tr>
                          </Table.Tbody>
                        </Table>
                      </div>
                  </form>
            </Disclosure.Panel>
        </Disclosure>
    </Disclosure.Group>
  <!-- End of Social Media Section -->
</template>
