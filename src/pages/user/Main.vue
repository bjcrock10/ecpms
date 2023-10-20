<script setup lang="ts">
import Lucide from "../../base-components/Lucide";
import { Menu, Dialog } from "../../base-components/Headless";
import Button from "../../base-components/Button";
import { onMounted, ref, reactive, watch, provide } from "vue";
import { FormInput, FormSelect, InputGroup, FormLabel, FormTextarea, FormSwitch} from "../../base-components/Form";
import Tippy from "../../base-components/Tippy";
import TomSelect from "../../base-components/TomSelect";
import UserDataService from '../../services/UserDataService';
import ResponseData from "../../types/response.d";
import { useUser } from "../../types/user.d";
import { tabulatorFunc } from "../../types/tabulator.d";
import Notification from "../../base-components/Notification";
import { NotificationElement } from "../../base-components/Notification";
import Toastify from "toastify-js";
import { createIcons, icons } from "lucide";
import { useRouter } from "vue-router";

const router = useRouter();
const {formUsers, errorMessage, isError, columnData, addModal, rounded} = useUser();
const successNotification = ref();
provide("bind[successNotification]", (el: any) => {
  // Binding
  successNotification.value = el;
  });
const message = ref("Successfully Save!");
const messageDetail = ref ();
const buttonTitle = ref("Submit")
const buttonIcon = ref("Save")
const setAddModal = (value: boolean) => {
  addModal.value = value;
};
const select = ref("1");
const sendButtonRef = ref(null);
const {initTabulator, reInitOnResizeWindow, 
filter, onFilter, 
onExportCsv, onExportHtml, 
onExportJson, onExportXlsx, 
onPrint, onResetFilter, tabulator} = tabulatorFunc();
const tableRef = ref<HTMLDivElement>();

const onSubmit = async () => {
  if(formUsers.id==="0"){
    formUsers.username = formUsers.email
    UserDataService.create(formUsers).then((response: ResponseData)=>{
      successNotification.value.showToast();
      addModal.value = false
      messageDetail.value = "You successfully created an account for "+response.data.email
      // initTabulator(columnData.value, UserDataService);
    }).catch((e : Error)=>{
      console.log(e);
    })
  }
  else{
    formUsers.username = formUsers.email
    UserDataService.update(formUsers.id,formUsers).then((response: ResponseData)=>{
      successNotification.value.showToast();
      addModal.value = false
      messageDetail.value = "You successfully updated the information for "+response.data.email
      // initTabulator(columnData.value, UserDataService);
    }).catch((e: Error)=>{
      console.log(e);
    })
  }
};
watch(addModal,(addModal, oldAdm)=> {
  if(addModal === false){
    formUsers.id = "0";
  }else if(formUsers.id!=="0"){
    buttonTitle.value = "Update"
    buttonIcon.value = "Edit"
  }
});
const frmModal = ref([]);

const deleteUser = (id: any) => {
  UserDataService.delete(id).then((resp: ResponseData)=>{
    successNotification.value.showToast();
      addModal.value = false
      messageDetail.value = "You successfully deleted an account for "+resp.data.email
  })
}

onMounted(async () => {
  initTabulator(columnData.value, UserDataService, tableRef);
  if(sessionStorage.getItem('userId') === null){
      router.push({ path:'/login'})
      sessionStorage.clear()
    }
  if(sessionStorage.getItem("privileges")==="0"){
    successNotification.value.showToast();
    message.value = "Redirecting...."
    messageDetail.value = "You don't have access to this page. Redirecting you the landing page."
    router.push({path: "/dashboard"});
  }
});
</script>

<template>
  <div class="flex flex-col items-center mt-8 intro-y sm:flex-row">
    <h2 class="mr-auto text-lg font-medium">User Management</h2>
    <div class="flex w-full mt-4 sm:w-auto sm:mt-0">
      <Button class="mr-2 shadow-md" as="a" href="#" variant="primary" @click="(event: MouseEvent) => {
          event.preventDefault();
          setAddModal(true);
        }">
        Add New User/s
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
                    User Management
                </h2>
                <!-- <Button variant="outline-secondary" class="hidden sm:flex">
                    <Lucide icon="Cross" class="w-4 h-4 mr-2" />
                </Button> -->
            </Dialog.Title>
            <form  class="validate-form" @submit.prevent="onSubmit">
            <Dialog.Description class="text-xs">
                <div class="grid grid-cols-12 col-span-12 gap-4 gap-y-3 p-2">
                <!-- <fieldset class="grid grid-cols-12 col-span-12 gap-4 gap-y-3 
                    border border-solid border-gray-300 p-2">
                    <legend class="text-sm font-bold">Personal Information</legend> -->
                    <div class="col-span-12 sm:col-span-4">
                        <FormLabel  htmlFor="modal-form-1"> Last Name </FormLabel>
                        <FormInput form-input-size="sm" :rounded="rounded" 
                          v-model="formUsers.lname" type="text" placeholder="" required/>
                    </div>
                    <div class="col-span-12 sm:col-span-4">
                        <FormLabel htmlFor="modal-form-2"> First Name </FormLabel>
                        <FormInput form-input-size="sm" :rounded="rounded" 
                          v-model="formUsers.fname" type="text" placeholder="" required/>
                    </div>
                    <div class="col-span-12 sm:col-span-2">
                      <FormLabel htmlFor="modal-form-3"> Middle Initial </FormLabel>
                      <FormInput form-input-size="sm" :rounded="rounded" v-model="formUsers.mname" 
                        type="text" placeholder="" />
                    </div>
                    <div class="col-span-12 sm:col-span-2">
                      <FormLabel htmlFor="modal-form-3"> Suffix </FormLabel>
                      <FormInput form-input-size="sm" :rounded="rounded" v-model="formUsers.suffix" type="text" placeholder="Sr/Jr/III" />
                  </div>
                  <div class="col-span-12 sm:col-span-4">
                      <FormLabel htmlFor="modal-form-3"> Gender </FormLabel>
                      <FormSelect form-select-size="sm" v-model="formUsers.gender" required>
                        <option value="Female">Female</option>
                        <option value="Male">Male</option>
                        <option value="Other">Other</option>
                      </FormSelect>
                  </div>
                  <div class="col-span-12 sm:col-span-4">
                    <FormLabel  htmlFor="modal-form-1"> Birthdate </FormLabel>
                    <FormInput form-input-size="sm" :rounded="rounded" v-model="formUsers.bDate" type="date" placeholder=""  required/>
                  </div>
                  <div class="col-span-12 sm:col-span-4">
                    <FormLabel  htmlFor="modal-form-1"> Job Position </FormLabel>
                    <FormInput form-input-size="sm" :rounded="rounded" v-model="formUsers.jobs" type="text" placeholder="" required/>
                  </div>
                  <div class="col-span-12 sm:col-span-4">
                    <FormLabel  htmlFor="modal-form-1"> Office </FormLabel>
                    <FormSelect form-select-size="sm" v-model="formUsers.office" required>
                      <option value="BPO">BPO</option>
                      <option value="CPO">CPO</option>
                      <option value="NOPO">NOPO</option>
                      <option value="SPO">SPO</option>
                      <option value="RO">RO</option>
                    </FormSelect>
                  </div>
                  <div class="col-span-12 sm:col-span-4">
                    <FormLabel  htmlFor="modal-form-1"> Division </FormLabel>
                    <FormInput form-input-size="sm" :rounded="rounded" v-model="formUsers.division" type="text" placeholder="" required/>
                  </div>
                  <!-- <fieldset class="grid grid-cols-12 col-span-12 gap-4 gap-y-3 border border-solid border-gray-300 p-3">
                    <legend class="text-xs">Addresses</legend> -->
                    <div class="col-span-12 sm:col-span-12">
                      <FormLabel  htmlFor="modal-form-1"> Current Address </FormLabel>
                      <FormInput form-input-size="sm" v-model="formUsers.currentAddress" type="text"
                      placeholder="Home Number, Street Name, Barangay, City/Municipality, Province" required/>
                    </div>
                    <div class="col-span-12 sm:col-span-12">
                      <FormLabel  htmlFor="modal-form-1"> Home Address </FormLabel>
                      <FormInput form-input-size="sm" v-model="formUsers.homeAddress" type="text"
                      placeholder="Home Number, Street Name, Barangay, City/Municipality, Province" required/>
                    </div>
                  <!-- </fieldset>
                </fieldset> -->
                </div>
                <hr class="mt-2"/>
                <div class="grid grid-cols-12 col-span-12 gap-4 gap-y-3 p-2">
                <!-- <fieldset class="grid grid-cols-12 col-span-12 gap-4 gap-y-3 border border-solid border-gray-300 p-3">
                  <legend class="text-sm font-bold">Account Information</legend> -->
                  <div class="col-span-12 sm:col-span-4">
                    <FormLabel  htmlFor="modal-form-3"> Email </FormLabel>
                    <FormInput form-input-size="sm" v-model="formUsers.email" type="email"
                    placeholder="" required/>
                  </div>
                  <div class="col-span-12 sm:col-span-4">
                    <FormLabel  htmlFor="modal-form-1"> Password </FormLabel>
                    <FormInput form-input-size="sm" v-model="formUsers.password" type="password"
                    placeholder="" required/>
                  </div>
                  <div class="col-span-12 sm:col-span-2">
                    <FormLabel htmlFor="modal-form-3"> Account Status </FormLabel>
                      <FormSelect form-select-size="sm" v-model="formUsers.recStat" required>
                        <option value="0">Active</option>
                        <option value="1">InActive</option>
                      </FormSelect>
                  </div>
                  <div class="col-span-12 sm:col-span-2">
                    <FormLabel htmlFor="modal-form-3"> Privilege </FormLabel>
                      <FormSelect form-select-size="sm" v-model="formUsers.privileges" required>
                        <option value="0">User</option>
                        <option value="1">Administrator</option>
                      </FormSelect>
                  </div>
                <!-- </fieldset> -->
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
                <Button type="submit" variant="primary" elevated class=" w-auto">
                  <Lucide icon="Save" class="w-4 h-4 mr-2" />{{buttonTitle}}
                </Button>
                <Button type="button" variant="outline-secondary" @click="
                            () => {
                              deleteUser(formUsers.id);
                            }
                          " class="w-auto mr-1">
                          <Lucide icon="XSquare" class="w-4 h-4 mr-2" />
                    Delete User
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
            <option value="jobs">Jobs</option>
            <option value="email">Email</option>
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
            @click="onResetFilter"
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
      <div id="tabulator" ref="tableRef" class="mt-5"></div>
    </div>
  </div>
  <!-- END: HTML Table Data -->
</template>
