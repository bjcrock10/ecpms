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
  import { FormLabel, FormSelect, FormInput, FormSwitch } from "../../base-components/Form";
  import { assign } from 'lodash';

  const {slicer, businessData, slicerBusinessAssistance, slicerClientAssistance, slicerTO} = useBusinessReport();
  const componentKey = ref(0)
  const tomData = ref("")
  const month = ref("")
  const office = ref("")
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
      // let offc = office.value
      ReportDataService.getAllBusinessAssistance(month.value,office.value).then((response: ResponseData)=>{
        businessData.value = response.data
      }).catch((e:Error)=>{
        console.log(e.message);
      }).finally(()=>{
        slicerData.value = slicerBusinessAssistance 
        forceRerender();
      })
    }
    else if(tomData.value.toString()==="3"){
      ReportDataService.getAllClientAssistance(month.value,office.value).then((response: ResponseData)=>{
        businessData.value = response.data
      }).catch((e:Error)=>{
        console.log(e.message);
      }).finally(()=>{
        slicerData.value = slicerClientAssistance 
        forceRerender();
      })
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
  
  <div class="grid grid-cols-12 gap-5 mt-5 intro-y">
    <div class="col-span-12 intro-y lg:col-span-12">
      <iframe title="ECPMS_2024_SQL_Localhost" class="w-full" height="1060" src="https://app.powerbi.com/view?r=eyJrIjoiNjNiOWRmYTktZjFkMi00YmEzLTk0NzgtM2MxZDYxM2VlYWJlIiwidCI6IjNlYzExNDExLTJhNzEtNGExMi1hYzgwLWZiZjkzNTUzZjkxOCIsImMiOjEwfQ%3D%3D" frameborder="0" allowFullScreen="true"></iframe>
    </div>
    <!-- <div class="col-span-12 intro-y lg:col-span-4">
        <form class="validate-form" @submit.prevent="assignQuery">
          <div class="grid grid-cols-12 gap-5 mt-5 intro-y">
              <div class="col-span-12  sm:col-span-12">
                  <FormLabel htmlFor="modal-form-3"> Month and Year (Date Encoded) </FormLabel>
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
      </div> -->
  </div>
</template>