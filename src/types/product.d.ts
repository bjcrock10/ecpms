import { ref, reactive} from "vue"
import { stringToHTML } from "../utils/helper";
import ProductDataService from '../services/ProductDataService';
import ResponseData from "./response";
export function useProduct(){
    const date = new Date();
    const current_date = date.getFullYear()+"-"+(date.getMonth()+1)+"-"+ date.getDate();
    const formProduct = reactive({
        'id':'0',
        'business':'',
        'businessName':'',
        'productType':'',
        'productName':'',
        'productionCapacity':'',
        'uom':'',
        'size':'',
        'width':'',
        'height':'',
        'length':'',
        'sku':'',
        'brandName':'',
        'certification':'',
        'description':'',
        'materials':'',
        'pictureURL':'',
        'encodedBy': sessionStorage.getItem('userId'),
        'encodedByName': sessionStorage.getItem('name'),
        'office':sessionStorage.getItem('office'),
        'encodedDate':current_date,
        'recStat':'1',
    });
    const columnData = ref([
        {
            title: "",
            formatter: "responsiveCollapse",
            width: 40,
            minWidth: 30,
            hozAlign: "center",
            resizable: false,
            headerSort: false,
        },
  
        // For HTML table
        {
            title: "#",
            minWidth: 50,
            maxWidth: 50,
            field: "id",
            hozAlign: "center",
            headerHozAlign: "center",
            vertAlign: "middle",
            print: false,
            download: false,
            visible: false,
        },
        {
            title: "Product",
            minWidth: 200,
            responsive: 0,
            field: "productName",
            hozAlign: "center",
            headerHozAlign: "center",
            vertAlign: "middle",
            print: false,
            download: false,
            frozen: true,
            formatter(cell) {
                return `<div>
                    <div class="font-medium whitespace-nowrap">${cell.getData().productName}</div>
                        <div class="text-slate-500 text-xs whitespace-nowrap"><label>Size: </label>${
                          cell.getData().size
                        }</div>
                        <div class="text-slate-500 text-xs whitespace-nowrap"><label>UOM: </label>${
                          cell.getData().uom
                        }</div>
                    </div>`;
                },
        },
        {
            title: "Brand Name",
            minWidth: 200,
            field: "brandName",
            hozAlign: "center",
            headerHozAlign: "center",
            vertAlign: "middle",
            print: false,
            download: false,
            formatter(cell) {
                return `<div>
                    <div class="font-medium whitespace-nowrap">${cell.getData().brandName}</div>
                        <div class="text-slate-500 text-xs whitespace-nowrap"><label>Material Used: </label>${
                          cell.getData().materials
                        }</div>
                        <div class="text-slate-500 text-xs whitespace-nowrap"><label>Description: </label>${
                          cell.getData().description
                        }</div>
                    </div>`;
                },
        },
        {
            title: "Category",
            minWidth: 200,
            field: "productType",
            hozAlign: "center",
            headerHozAlign: "center",
            vertAlign: "middle",
            print: false,
            download: false,
            formatter(cell) {
                return `<div>
                    <div class="font-medium whitespace-nowrap">${cell.getData().productType}</div>
                        <div class="text-slate-500 text-xs whitespace-nowrap"><label>SKU: </label>${
                          cell.getData().sku
                        }</div>
                        <div class="text-slate-500 text-xs whitespace-nowrap"><label>Certification: </label>${
                          cell.getData().certification
                        }</div>
                    </div>`;
                },
        },
        {
            title: "Production Capacity",
            minWidth: 200,
            field: "productionCapacity",
            hozAlign: "center",
            headerHozAlign: "center",
            vertAlign: "middle",
            print: false,
            download: false,
        },
        // For print format
        {
            title: "No",
            minWidth: 100,
            maxWidth: 100,
            field: "id",
            hozAlign: "center",
            headerHozAlign: "center",
            vertAlign: "middle",
            visible: false,
            print: true,
            download: true,
        },
        {
            title: "Product",
            minWidth: 200,
            responsive: 0,
            field: "productName",
            hozAlign: "center",
            headerHozAlign: "center",
            vertAlign: "middle",
            visible: false,
            print: true,
            download: true,
        },
        {
            title: "Size",
            minWidth: 200,
            field: "uom",
            hozAlign: "center",
            headerHozAlign: "center",
            vertAlign: "middle",
            visible: false,
            print: true,
            download: true,
        },
        {
            title: "UOM",
            minWidth: 200,
            field: "uom",
            hozAlign: "center",
            headerHozAlign: "center",
            vertAlign: "middle",
            visible: false,
            print: true,
            download: true,
        },
        {
            title: "Brand Name",
            minWidth: 200,
            field: "brandName",
            hozAlign: "center",
            headerHozAlign: "center",
            visible: false,
            print: true,
            download: true,
        },
        {
            title: "Production Capacity",
            minWidth: 200,
            field: "productionCapacity",
            hozAlign: "center",
            headerHozAlign: "center",
            vertAlign: "middle",
            visible: false,
            print: true,
            download: true,
        },
        {
            title: "Certification",
            minWidth: 200,
            field: "certification",
            hozAlign: "center",
            headerHozAlign: "center",
            vertAlign: "middle",
            visible: false,
            print: true,
            download: true,
        },
        
    ])
    return {
        formProduct,
        columnData
    }
}