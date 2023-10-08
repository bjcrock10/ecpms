<template>
    <div>Pivot</div>
</template>

<script setup lang="ts">
import WebDataRocks from "webdatarocks/webdatarocks";
import { onMounted, ref, reactive, watch, provide, toRefs} from "vue";

interface Pivot {
  afterchartdraw?: any,
  aftergriddraw?: any,
  beforegriddraw?: any,
  beforetoolbarcreated?: any,
  cellclick?: any,
  celldoubleclick?: any,
  componentFolder?: any,
  customizeCell?: any,
  customizeContextMenu?: any,
  datachanged?: any,
  dataerror?: any,
  datafilecancelled?: any,
  dataloaded?: any,
  fieldslistclose?: any,
  fieldslistopen?: any,
  filterclose?: any,
  filteropen?: any,
  fullscreen?: any,
  global?: any,
  height?: any,
  loadingdata?: any,
  loadinglocalization?: any,
  loadingolapstructure?: any,
  loadingreportfile?: any,
  localizationerror?: any,
  localizationloaded?: any,
  olapstructureerror?: any,
  olapstructureloaded?: any,
  openingreportfile?: any,
  querycomplete?: any,
  queryerror?: any,
  ready?: any,
  report?: any,
  reportchange?: any,
  reportcomplete?: any,
  reportfilecancelled?: any,
  reportfileerror?: any,
  reportfileloaded?: any,
  runningquery?: any,
  toolbar?: any,
  update?: any,
  width?: any
}

const props = defineProps<Pivot>();
const webdatarocks = ref();
const beforeUpdate = () =>{
  return false;
}
onMounted(()=>{
  webdatarocks.value = new WebDataRocks({...props,container:"this.$el"})
  beforeUpdate();
})

// export default {
//   name?: "Pivot",
//   props?: {
//     afterchartdraw?: Function,
//     aftergriddraw?: Function,
//     beforegriddraw?: Function,
//     beforetoolbarcreated?: Function,
//     cellclick?: Function,
//     celldoubleclick?: Function,
//     componentFolder?: String,
//     customizeCell?: Function,
//     customizeContextMenu?: Function,
//     datachanged?: Function,
//     dataerror?: Function,
//     datafilecancelled?: Function,
//     dataloaded?: Function,
//     fieldslistclose?: Function,
//     fieldslistopen?: Function,
//     filterclose?: Function,
//     filteropen?: Function,
//     fullscreen?: Function,
//     global?: Object,
//     height?: [String, Number],
//     loadingdata?: Function,
//     loadinglocalization?: Function,
//     loadingolapstructure?: Function,
//     loadingreportfile?: Function,
//     localizationerror?: Function,
//     localizationloaded?: Function,
//     olapstructureerror?: Function,
//     olapstructureloaded?: Function,
//     openingreportfile?: Function,
//     querycomplete?: Function,
//     queryerror?: Function,
//     ready?: Function,
//     report?: [String, Object],
//     reportchange?: Function,
//     reportcomplete?: Function,
//     reportfilecancelled?: Function,
//     reportfileerror?: Function,
//     reportfileloaded?: Function,
//     runningquery?: Function,
//     toolbar?: Boolean,
//     update?: Function,
//     width?: [Number, String]
//   },
//   mounted?: function() {
//     this.webdatarocks = new WebDataRocks({
//       ...this.$props,
//       container?: this.$el
//     });
//   },
//   beforeUpdate() {
//     return false;
//   }
// };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
@import '../../../node_modules/webdatarocks/webdatarocks.min.css';
</style>
