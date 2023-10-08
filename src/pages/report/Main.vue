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
  import { FormLabel, FormSelect } from "../../base-components/Form";
import { assign } from 'lodash';

  const {slicer, businessData, slicerBusinessAssistance, slicerClientAssistance} = useBusinessReport();
  const componentKey = ref(0)
  const tomData = ref("")
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
      ReportDataService.getAllBusinessAssistance().then((response: ResponseData)=>{
        businessData.value = response.data
      })
      slicerData.value = slicerBusinessAssistance
    }
    else if(tomData.value.toString()==="3"){
      ReportDataService.getAllClientAssistance().then((response: ResponseData)=>{
        businessData.value = response.data
      })
      slicerData.value = slicerClientAssistance
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
  <div class="grid grid-cols-12 col-span-12 gap-4 gap-y-3 p-2">
    <div class="col-span-12 sm:col-span-8">
      <FormSelect  v-model="tomData" class="col-span-12 sm:col-span-3" @change="assignQuery()" required>
        <option value="1">Business Complete Data</option>
        <option value="2">Business and Assistance Data</option>
        <option value="3">Client and Assistance Data</option>
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
  </div>
  <Pivot toolbar :jsonData="businessData" :slicer="slicerData" :key="componentKey"/>
  
</template>