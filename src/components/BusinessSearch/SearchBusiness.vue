<script setup lang="ts">
import _ from "lodash";
import Button from "../../base-components/Button";
import { FormSwitch, FormInput, FormSelect, InputGroup, FormLabel, FormTextarea} from "../../base-components/Form";
import Lucide from "../../base-components/Lucide";
import { useBusiness } from "../../types/business.d";
import { useRouter } from "vue-router";
import { onMounted, ref, reactive, watch, provide, toRefs} from "vue";
import BusinessDataService from "../../services/BuisinessDataService";
import { tabulatorFunc } from "../../types/tabulator.d";

const router = useRouter();
const {columnData, formBusiness} = useBusiness();
const tableClient = ref<HTMLDivElement>();
const {initTabulatorSearchClientName, reInitOnResizeWindow, tabulator, loadingIcon} = tabulatorFunc();

interface Business {
    businessName?: any;
}
const props = defineProps<Business>();

const dataTable = (businessName: any) =>{
  initTabulatorSearchClientName(columnData.value, BusinessDataService, tableClient, businessName);
  reInitOnResizeWindow();
  tabulator.value?.on("rowClick",(e, cell)=>{
    const id = cell.getData().clientId
    router.push({path:`/client/${id}`, params:{id}})
  })
};
const onSubmit = () => {
    dataTable(formBusiness.businessName);
}
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
</template>