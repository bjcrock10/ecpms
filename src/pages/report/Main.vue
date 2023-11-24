<script setup lang="ts">
  import Pivot from "../../components/Pivot/Pivot.vue";
  import "webdatarocks/webdatarocks.css";
  import Lucide from "../../base-components/Lucide";
  import Button from "../../base-components/Button";
  import ReportDataService from '../../services/ReportDataService';
  import ResponseData from "../../types/response.d";
  import { useBusinessReport } from "../../types/businessreport.d"; 
  import { onMounted, ref, reactive } from 'vue';
  import TomSelect from "../../base-components/TomSelect";
  import { FormLabel, FormSelect, FormInput } from "../../base-components/Form";
import { assign } from 'lodash';

  const {slicer, businessData, slicerBusinessAssistance, slicerClientAssistance, slicerTO} = useBusinessReport();
  const componentKey = ref(0)
  const tomData = ref("")
  const month = ref()
  const office = ref()
  const slicerData = ref({})
  const forceRerender = () => {
    setTimeout(()=>{
      componentKey.value += 1;

    },500)
  }
  const assignQuery = () => {
    if(tomData.value.toString()==="1"){
      ReportDataService.getAllBusinessReport().then((response: ResponseData)=>{
        businessData.value = response.data
      })
      slicerData.value = slicer
    }
    else if(tomData.value.toString()==="2"){
      ReportDataService.getAllBusinessAssistance(month,office).then((response: ResponseData)=>{
        businessData.value = response.data
      })
      slicerData.value = slicerBusinessAssistance
    }
    else if(tomData.value.toString()==="3"){
      ReportDataService.getAllClientAssistance(month,office).then((response: ResponseData)=>{
        businessData.value = response.data
      })
      slicerData.value = slicerClientAssistance
    }
    else if(tomData.value.toString()==="4"){
      ReportDataService.getAllToReport().then((response: ResponseData)=>{
        businessData.value = response.data
      })
      slicerData.value = slicerTO
    }
    forceRerender();
  }
  onMounted(async()=>{
    ReportDataService.getAllBusinessReport().then((response: ResponseData)=>{
        businessData.value = response.data
      })
      slicerData.value = slicer
  })
</script>

<template>
  <!-- <div class="grid grid-cols-12 col-span-12 gap-4 gap-y-3 p-2">
    <div class="col-span-12 sm:col-span-8">
      <div class="items-center mt-2 sm:flex sm:mr-4 xl:mt-0">
    
          <FormLabel htmlFor="modal-form-3"> Middle Initial </FormLabel>
          <FormInput form-input-size="sm" 
            type="text" placeholder=""  class="col-span-12 sm:col-span-3"/>
      </div>
      <div class="items-center mt-2 sm:flex sm:mr-4 xl:mt-0">
        <label class="flex-none w-12 mr-2 xl:w-auto xl:flex-initial">
          Office
        </label>
        <FormSelect  v-model="tomData" class="col-span-12 sm:col-span-3" required>
          <option value="BPO">Bohol Provincial Office</option>
          <option value="CPO">Cebu Provincial Office</option>
          <option value="NOPO">Negros Oriental Provincial Office</option>
          <option value="SPO">Siquijor Provincial Office</option>
          <option value="RO">Regional Office</option>
      </FormSelect>
      </div>
      <FormSelect  v-model="tomData" class="col-span-12 sm:col-span-3" @change="assignQuery()" required>
        <option value="1">Business Complete Data</option>
        <option value="2">Business and Assistance Data</option>
        <option value="3">Client and Assistance Data</option>
        <option value="4">Travel Order</option>
      </FormSelect>
      
    </div>
    <div class="col-span-12 sm:col-span-4">
      <Button icon="Monitor" class="mr-2 shadow-md" as="a" href="#" variant="primary" @click="(event: MouseEvent) => {
        event.preventDefault();
        forceRerender();
      }">
      Generate Report 
      <Lucide
        icon="Monitor"
        class="w-[28px] h-[28px] text-warning"
      />
      </Button>
    </div>
  </div> -->
  <div class="grid grid-cols-12 gap-5 mt-5 intro-y">
      <div class="col-span-12 intro-y lg:col-span-4">
        <form class="validate-form" @submit.prevent="assignQuery">
          <div class="grid grid-cols-12 gap-5 mt-5 intro-y">
              <div class="col-span-12  sm:col-span-12">
                  <FormLabel htmlFor="modal-form-3"> Month and Year </FormLabel>
                  <FormInput type="month" v-model="month" class="col-span-12 sm:col-span-6" required />
              </div>
              <div class="col-span-12 sm:col-span-12">
                  <FormLabel htmlFor="modal-form-3"> Office </FormLabel>
                  <FormSelect v-model="office">
                    <option value="BPO">Bohol Provincial Office</option>
                    <option value="CPO">Cebu Provincial Office</option>
                    <option value="NOPO">Negros Oriental Provincial Office</option>
                    <option value="SPO">Siquijor Provincial Office</option>
                    <option value="RO">Regional Office</option>
                  </FormSelect>
              </div>
              <div class="col-span-12 sm:col-span-12">
                  <FormLabel htmlFor="modal-form-3"> Report Type </FormLabel>
                  <FormSelect v-model="tomData">
                    <option value="1">Business Complete Data</option>
                    <option value="2">Business and Assistance Data</option>
                    <option value="3">Client and Assistance Data</option>
                    <option value="4">Travel Order</option>
                  </FormSelect>
              </div>
              <div class="col-span-12 sm:col-span-6">
                  <Button type="submit" name="save" title="Save" class="mr-2 shadow-md" variant="primary">GENERATE REPORT<Lucide icon="Save"></Lucide></Button>
              </div>
          </div>
        </form>
      </div>
      <div class="col-span-12 intro-y lg:col-span-8">
        <div class="grid grid-cols-12 gap-5 mt-5 intro-y">
          <div class="col-span-12">
            <Pivot toolbar :jsonData="businessData" :slicer="slicerData" :key="componentKey"/>
          </div>
          
        </div>
      </div>
  </div>
</template>