<script setup lang="ts">
import Lucide from "../../base-components/Lucide";
import { Menu, Dialog, Tab } from "../../base-components/Headless";
import Button from "../../base-components/Button";
import { onMounted, ref, reactive, watch, provide, toRefs} from "vue";
import BNRSDataService from "../../services/BNRSDataService";
import ResponseData from "../../types/response.d";
import { useClient } from "../../types/client.d";
import { tabulatorFunc } from "../../types/tabulator.d";
import { useRouter } from "vue-router";
import LoadingIcon from "../../base-components/LoadingIcon";

const router = useRouter();
const {formClient, errorMessage, isError, columnData, addModal, rounded,  brgyDropdown,
        lnameDropdown, showSearchBrgy, hideSearchBrgy, showSearchLname, hideSearchLname, 
        message, messageDetail, buttonTitle, buttonIcon, setAddModal, select, brgy, sendButtonRef, ncfrs, tenurial,
        accreditation, organization, disNcfrs, disTenurial, disAccreditation, disOrganization, brgySelect, citySelect,
        clientList, addressSelect, checkBa, aNcfrs, dTenurial, dOrganization, dAccreditation, brgyId, formOrganization, 
        setAddModalSearch,addModalSearch,orgList, selectOrganization} = useClient();
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

onMounted(async () => {
  initTabulator(columnData.value, BNRSDataService, tableClient);
  reInitOnResizeWindow();
  tabulator.value?.on("rowClick",(e, cell)=>{
    const id = cell.getData().id
  })
  if(sessionStorage.getItem('userId') === null){
      router.push({ path:'/login'})
      sessionStorage.clear()
    }
});
</script>
<template>
  <div class="flex flex-col items-center mt-8 intro-y sm:flex-row">
    <h2 class="mr-auto text-lg font-medium">BNRS Data</h2>
    <div class="flex w-full mt-4 sm:w-auto sm:mt-0">
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
</style>