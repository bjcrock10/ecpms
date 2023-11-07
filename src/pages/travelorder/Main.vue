<script setup lang="ts">
import Lucide from "../../base-components/Lucide";
import LoadingIcon from "../../base-components/LoadingIcon";
import { tabulatorFunc } from "../../types/tabulator.d";
import { Menu, Dialog, Tab } from "../../base-components/Headless";
import Button from "../../base-components/Button";
import { FormInput, FormSelect, InputGroup, FormLabel, FormTextarea, FormSwitch} from "../../base-components/Form";
import { onMounted, ref, reactive, watch, provide, toRefs} from "vue";
import Notification from "../../base-components/Notification";
import Tippy from "../../base-components/Tippy";
import { useRouter } from "vue-router";
import TravelOrderService from '../../services/TravelOrder';
import { useTravelOrder } from "../../types/travelorder.d";
import ResponseData from '../../types/response';

const message = ref("");
const messageDetail = ref("");
const router = useRouter();
const tableTO = ref<HTMLDivElement>();
const {columnDataTO} = useTravelOrder();
const {initTabulator, initTabulatorJsonResp, reInitOnResizeWindow,
onExportCsv, onExportHtml, 
onExportJson, onExportXlsx, 
onPrint, tabulator, loadingIcon} = tabulatorFunc();
const setFilter = (value: typeof filter) => {
        Object.assign(filter, value);
      };
const filter = reactive({
  field: "toNo",
  type: "like",
  value: "",
});
// Filter function
const onFilter = () => {
  if (tabulator.value) {
    tabulator.value.setFilter(filter.field, filter.type, filter.value);
  }
};

// On reset filter
const onResetFilter = (defaultField:any = "toNo") => {
  setFilter({
    ...filter,
    field: defaultField,
    type: "like",
    value: "",
  });
  onFilter();
};
const buttonTitle = ref("Submit")

const loadData = (id:any) =>{
  let status = ""
  if(id==="1"){
    status = 'For Approval'
  }
  else if(id==="2"){
    status = 'Printed'
  }
  else if(id==="3"){
    status = 'Approved'
  }
  else if(id==="4"){
    status = 'Disapproved'
  }
  else if(id==="5"){
    status = 'Completed'
  }
  initTabulator(columnDataTO.value, TravelOrderService, tableTO,'0',false,status);
  reInitOnResizeWindow();
  tabulator.value?.on("rowClick",(e, cell)=>{
    router.push({path: `/toprofile/${cell.getData().id}`})
  })
};
onMounted(async ()=>{
  loadData('1');
    if(sessionStorage.getItem('userId') === null){
      router.push({ path:'/login'})
      sessionStorage.clear()
    }
})
</script>

<template>
    <div class="flex flex-col items-center mt-8 intro-y sm:flex-row">
        <h2 class="mr-auto text-lg font-medium">Travel Order Master List</h2>
        <div class="flex w-full mt-4 sm:w-auto sm:mt-0">
          <Button class="mr-2 shadow-md" as="a" href="#" variant="primary" @click="router.push({path: '/toprofile/0'})">
            Create New Travel Order
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
                <option value="purpose">Purpose</option>
                <option value="toNo">TO No.</option>
                <option value="id">No.</option>
                <option value="office">Office</option>
                <option value="status">Status</option>
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
                @click="onResetFilter('toNo')"
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
        <Tab.Group>
          <Tab.List variant="link-tabs"
                    class="flex-col justify-center text-center sm:flex-row lg:justify-start p-5">
              <Tab :fullWidth="false">
                  <Tab.Button class="flex items-center py-4 cursor-pointer" @click="loadData('1')">
                      For Approval
                  </Tab.Button>
              </Tab>
              <Tab :fullWidth="false">
                  <Tab.Button class="flex items-center py-4 cursor-pointer"  @click="loadData('2')">
                      Printed
                  </Tab.Button>
              </Tab>
              <Tab :fullWidth="false">
                  <Tab.Button class="flex items-center py-4 cursor-pointer"  @click="loadData('3')">
                      Approved
                  </Tab.Button>
              </Tab>
              <Tab :fullWidth="false">
                  <Tab.Button class="flex items-center py-4 cursor-pointer"  @click="loadData('4')">
                      Disapproved
                  </Tab.Button>
              </Tab>
              <Tab :fullWidth="false">
                  <Tab.Button class="flex items-center py-4 cursor-pointer"  @click="loadData('5')">
                      Completed
                  </Tab.Button>
              </Tab>
          </Tab.List>
          <!-- <Tab.Panels class="mt-5">
              <Tab.Panel class="leading-relaxed"> -->
          <div class="overflow-x-auto scrollbar-hidden leading-relaxed">
            <div id="tabulator" ref="tableTO" class="mt-5"></div>
                <div v-if="loadingIcon===true"
                  class="flex flex-col items-center justify-end col-span-6 sm:col-span-3 xl:col-span-2"
                >
                    <LoadingIcon icon="grid" class="w-8 h-8" />
                <div class="mt-2 text-xs text-center">Loading Data...</div>
              </div>
          </div>
              <!-- </Tab.Panel>
          </Tab.Panels> -->
        </Tab.Group>
        
      </div>  
</template>
