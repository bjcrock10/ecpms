<script setup lang="ts">
import _, { get } from "lodash";
import Button from "../../base-components/Button";
import { FormSwitch, FormInput, FormSelect, InputGroup, FormLabel, FormTextarea} from "../../base-components/Form";
import { Menu, Tab, Dialog } from "../../base-components/Headless";
import Lucide from "../../base-components/Lucide";
import { useBusiness } from "../../types/business.d";
import { useRouter } from "vue-router";
import { onMounted, ref, reactive, watch, provide, toRefs} from "vue";
import BusinessDataService from "../../services/BuisinessDataService";
import { tabulatorFunc } from "../../types/tabulator.d";
import BusinessInfoOnly from "../Business/BusinessInfoOnly.vue";
import ResponseData from "../../types/response";

const router = useRouter();
const {columnData, formBusiness} = useBusiness();
const tableClient = ref<HTMLDivElement>();
const {initTabulatorSearchClientName, reInitOnResizeWindow, tabulator, loadingIcon} = tabulatorFunc();

interface BusinessSearch {
    businessName?: any;
}
const props = defineProps<BusinessSearch>();
const businessId = ref()
const clientId = ref ()
const dataTable = (businessName: any) =>{
  initTabulatorSearchClientName(columnData.value, BusinessDataService, tableClient, businessName);
  reInitOnResizeWindow();
  tabulator.value?.on("rowClick",(e, cell)=>{
    // const id = cell.getData().clientId
    // router.push({path:`/client/${id}`, params:{id}})
    businessId.value = cell.getData().id
    addModal.value = true
    getClientId(businessId.value)
  })
};
const addModal = ref(false)
const onSubmit = () => {
    dataTable(formBusiness.businessName);
}
const setAddModal = (value: boolean) => {
      addModal.value = value;
};
const getClientId = (businessId:any) => {
    BusinessDataService.getId(businessId).then((resp:ResponseData)=>{
        clientId.value = resp.data.clientId
    })
}
const sendButtonRef = ref(null);
onMounted(() => {
    dataTable(props.businessName);
})
</script>
<template>
    <form class="validate-form" @submit.prevent="onSubmit">
        <div class="grid grid-cols-12 col-span-12 gap-4 gap-y-3 p-2">
            <p class="col-span-12 sm:col-span-12 w-full p-2 bg-primary text-center text-slate-50 text-lg">
                <h2>Search Buisness Name</h2>
            </p>
            <div class="col-span-12 md:col-span-12">
                <FormLabel htmlFor="modal-form-3">Business Name</FormLabel>
                <FormInput type="text" v-model="formBusiness.businessName" class="col-span-12 sm:col-span-6" placeholder="BUSINESS NAME" required />
            </div>
            <Button type="submit" variant="primary" elevated class="w-auto bg-primary">
                <Lucide icon="Search" class="w-4 h-4 mr-2" />Search
            </Button>
        </div>
    </form>
    <!-- BEGIN: HTML Table Data -->
    <div class="p-5 mt-5 intro-y sm:overf">
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
    <Dialog size="2xl" :open="addModal" @close="
                      () => {
                        setAddModal(false);
                      }
                    " :initialFocus="sendButtonRef"
                    :draggable="true">
        <Dialog.Panel class="z-40 top-0 left-0 w-full h-full outline-none overflow-x-hidden overflow-y-auto">
            <Dialog.Title>
                <h2 class="mr-auto text-base font-medium">
                    Business Profile 
                </h2>
                <Button type="submit" variant="primary" elevated class="w-auto bg-primary" @click="()=>{
                    router.push({path:`/client/${clientId}`})
                }">
                    <Lucide icon="Search" class="w-4 h-4 mr-2" />View Client Info
                </Button>
                <button type="button" variant="outline-secondary" @click="
                          () => {
                            setAddModal(false);
                          }
                        " class="w-auto mr-1">
                        <Lucide icon="XSquare" class=" w-10 h-10 mr-2" />
                </button>
            </Dialog.Title>
            <Dialog.Description class="text-xs">
                <BusinessInfoOnly :business="businessId"/>
            </Dialog.Description>
        </Dialog.Panel>
    </Dialog>
    
</template>