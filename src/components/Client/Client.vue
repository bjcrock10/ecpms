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
    import { useClient } from "../../types/client.d";
    import { tabulatorFunc } from "../../types/tabulator.d";
    import Notification from "../../base-components/Notification";
    import { NotificationElement } from "../../base-components/Notification";
    import Toastify from "toastify-js";
    import { createIcons, icons } from "lucide";
    import { useRouter } from "vue-router"; 
    import LoadingIcon from "../../base-components/LoadingIcon";
    import { ClassicEditor } from "../../base-components/Ckeditor";
    import ClientDataService from '../../services/ClientDataService';

    const router = useRouter();
    const {columnData, formClient} = useClient();
    const {initTabulatorSearchClientName, reInitOnResizeWindow, 
    filter, onFilter, 
    onExportCsv, onExportHtml, 
    onExportJson, onExportXlsx, 
    onPrint, onResetFilter, tabulator, loadingIcon} = tabulatorFunc();

    interface ClientName {
        clientName?: any;
    }
    const props = defineProps<ClientName>(); 
    const onSubmit = () =>{
        initTabulatorSearchClientName(columnData.value, ClientDataService, tableClient, formClient.fullName);
        reInitOnResizeWindow();
        tabulator.value?.on("rowClick",(e, cell)=>{
            const id = cell.getData().id
            router.push({path:`/client/${id}`, params:{id}})
        })
    }
    const clinetList = ref([])
    const tableClient = ref<HTMLDivElement>();
    const successNotification = ref();
    provide("bind[successNotification]", (el: any) => {
    // Binding
    successNotification.value = el;
    });
    onMounted(async ()=>{
        initTabulatorSearchClientName(columnData.value, ClientDataService, tableClient, "Cabasisi");
        reInitOnResizeWindow();
        tabulator.value?.on("rowClick",(e, cell)=>{
            const id = cell.getData().id
            router.push({path:`/client/${id}`, params:{id}})
        })
    })
</script>
<template>
    <form class="validate-form" @submit.prevent="onSubmit">
        <div class="grid grid-cols-12 col-span-12 gap-4 gap-y-3 p-2">
            <p class="col-span-12 sm:col-span-12 w-full p-2 bg-primary text-center text-slate-50 text-lg">
                <h2>Search Client</h2>
            </p>
            <div class="col-span-12 md:col-span-12">
                <FormLabel htmlFor="modal-form-3">Client Full Name</FormLabel>
                <FormInput type="text" v-model="formClient.fullName" class="col-span-12 sm:col-span-6" placeholder="LAST NAME, FIRST NAME MIDDLE NAME" required />
            </div>
            <Button type="submit" variant="primary" elevated class="w-auto bg-primary">
                <Lucide icon="Search" class="w-4 h-4 mr-2" />Search
            </Button>
        </div>
    </form>
    <!-- BEGIN: HTML Table Data -->
    <div class="p-5 mt-5 intro-y sm:overf">
        <div class="flex flex-col sm:flex-row sm:items-end xl:items-start">
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