import { ref, reactive } from 'vue';
import { TabulatorFull as Tabulator } from "tabulator-tables";
import { FormInput, FormSelect } from "../../base-components/Form";
import * as xlsx from "xlsx";
import { createIcons, icons } from "lucide";
import ResponseData from './response';

export function tabulatorFunc(){
    const setFilter = (value: typeof filter) => {
        Object.assign(filter, value);
      };
      const tabulator = ref<Tabulator>();
      const filter = reactive({
        field: "name",
        type: "like",
        value: "",
      });
      const resp = ref([])
      const loadingIcon = ref(true)
      const initTabulator = (columnData:any, dataService:any, tableRef:any, byId:any="0",byBusiness=false,status: any='', office: any='') => {
        tabulator.value = new Tabulator(tableRef.value, {
            data: [],
            progressiveRender: true, //enable progressive rendering
            progressiveRenderSize:10, //sets the number of rows to render per block (default = 20)
            progressiveRenderMargin:50,
            paginationMode: "local",
            filterMode: "local",
            sortMode: "local",
            printAsHtml: true,
            printStyled: true,
            pagination: true,
            paginationSize: 10,
            paginationSizeSelector: [10, 20, 30, 40],
            layout: "fitColumns",
            responsiveLayout: "collapse",
            placeholder: "No matching records found",
            columns: columnData
        });
        if(byBusiness===true){
          if(byId==="0"){
            byId="-1"
          }
        }
        if(byId==="0" && status===""){
          if (tableRef.value) {
            dataService.getLimit(500)
            .then((response: ResponseData) => {
             
              tabulator.value.setData(response.data)
            })
            .catch((e: Error)=>{
                console.log(e)
            })
            .finally(()=> {
              loadingIcon.value = false
            })
          }
        }
        else if(status===""){
          if (tableRef.value) {
            dataService.getByBusiness(byId)
            .then((response: ResponseData) => {
              tabulator.value.setData(response.data)
            })
            .catch((e: Error)=>{
                console.log(e.message)
                alert("Failed to load data due to slow internet connection."+ " " + e.message)
            }).finally(()=>{
              loadingIcon.value = false
            })
          }
        }
        if(status!==""){
          if (tableRef.value) {
            dataService.getStatus(status,office)
            .then((response: ResponseData) => {
              tabulator.value.setData(response.data)
            })
            .catch((e: Error)=>{
                console.log(e.message)
                alert("Failed to load data due to slow internet connection."+ " " + e.message)
            }).finally(()=>{
              loadingIcon.value = false
            })
          }
        }
        tabulator.value?.on("renderComplete", () => {
          createIcons({
            icons,
            attrs: {
              "stroke-width": 1.5,
            },
            nameAttr: "data-lucide",
          });
        });
        // tabulator.value?.on("rowClick",()=>{
        //   alert("bang")
        // })
      };

      const initTabulatorByClient = (columnData:any, dataService:any, tableRef:any,id:any="0") => {
        tabulator.value = new Tabulator(tableRef.value, {
            data: [],
            progressiveRender: true, //enable progressive rendering
            progressiveRenderSize:10, //sets the number of rows to render per block (default = 20)
            progressiveRenderMargin:50,
            paginationMode: "local",
            filterMode: "local",
            sortMode: "local",
            printAsHtml: true,
            printStyled: true,
            pagination: true,
            paginationSize: 10,
            paginationSizeSelector: [10, 20, 30, 40],
            layout: "fitColumns",
            responsiveLayout: "collapse",
            placeholder: "No matching records found",
            columns: columnData
        });
        if (tableRef.value) {
          dataService.getByClient(id)
          .then((response: ResponseData) => {
           
            tabulator.value.setData(response.data)
          })
          .catch((e: Error)=>{
              console.log(e)
          })
          .finally(()=> {
            loadingIcon.value = false
          })
        }
        tabulator.value?.on("renderComplete", () => {
          createIcons({
            icons,
            attrs: {
              "stroke-width": 1.5,
            },
            nameAttr: "data-lucide",
          });
        });
        // tabulator.value?.on("rowClick",()=>{
        //   alert("bang")
        // })
      };

      const initTabulatorJsonResp = (columnData:any, dataService:any, tableRef:any, status: any, office: any='') =>{
        tabulator.value = new Tabulator(tableRef.value, {
            data: [],
            progressiveRender: true, //enable progressive rendering
            progressiveRenderSize:10, //sets the number of rows to render per block (default = 20)
            progressiveRenderMargin:50,
            paginationMode: "local",
            filterMode: "local",
            sortMode: "local",
            printAsHtml: true,
            printStyled: true,
            pagination: true,
            paginationSize: 10,
            paginationSizeSelector: [10, 20, 30, 40],
            layout: "fitColumns",
            responsiveLayout: "collapse",
            placeholder: "No matching records found",
            columns: columnData
        });
        if (tableRef.value) {
          dataService.getStatus(status, office)
          .then((response: ResponseData) => {
           
            tabulator.value.setData(response.data)
          })
          .catch((e: Error)=>{
              console.log(e)
          })
          .finally(()=> {
            loadingIcon.value = false
          })
        }
        tabulator.value?.on("renderComplete", () => {
          createIcons({
            icons,
            attrs: {
              "stroke-width": 1.5,
            },
            nameAttr: "data-lucide",
          });
        });
      };
      
      // Redraw table onresize
      const reInitOnResizeWindow = () => {
        window.addEventListener("resize", () => {
          if (tabulator.value) {
            tabulator.value.redraw();
            createIcons({
              icons,
              attrs: {
                "stroke-width": 1.5,
              },
              nameAttr: "data-lucide",
            });
          }
        });
      };
      
      // Filter function
      const onFilter = () => {
        if (tabulator.value) {
          tabulator.value.setFilter(filter.field, filter.type, filter.value);
        }
      };
      
      // On reset filter
      const onResetFilter = (defaultField:any = "name") => {
        setFilter({
          ...filter,
          field: defaultField,
          type: "like",
          value: "",
        });
        onFilter();
      };
      
      // Export
      const onExportCsv = () => {
        if (tabulator.value) {
          tabulator.value.download("csv", "data.csv");
        }
      };
      
      const onExportJson = () => {
        if (tabulator.value) {
          tabulator.value.download("json", "data.json");
        }
      };
      
      const onExportXlsx = () => {
        if (tabulator.value) {
          (window as any).XLSX = xlsx;
          tabulator.value.download("xlsx", "data.xlsx", {
            sheetName: "Data Exported",
          });
        }
      };
      
      const onExportHtml = () => {
        if (tabulator.value) {
          tabulator.value.download("html", "data.html", {
            style: true,
          });
        }
      };
      
      // Print
      const onPrint = () => {
        if (tabulator.value) {
          tabulator.value.print();
        }
      };
return{
    initTabulator,
    initTabulatorByClient,
    initTabulatorJsonResp,
    onExportCsv,
    onExportHtml,
    onExportJson,
    onExportXlsx,
    onFilter,
    onResetFilter,
    onPrint,
    reInitOnResizeWindow,
    filter,
    tabulator,
    loadingIcon
}
}