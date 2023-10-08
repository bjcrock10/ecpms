import { ref, reactive} from "vue"
import { stringToHTML } from "../utils/helper";
import TravelOrderService from '../services/TravelOrderService';
import ResponseData from "./response";
export function useTravelOrder(){
    const date = new Date();
    const current_date = date.getFullYear()+"-"+(date.getMonth()+1)+"-"+ date.getDate();
    const formTO = reactive({
        'id':'0',
        'toNo':'',
        'toDate':'',
        'purpose':'',
        'office':'',
        'poAttachment':'',
        'dateApproved':'',
        'roAttachment':'',
        'status':'For Approval',
        'encodedBy': sessionStorage.getItem('userId'),
        'encodedByName': sessionStorage.getItem('name'),
        'encodedDate':current_date,
        'recStat':'1',
    });
    const formTODetail = reactive({
        'id':'',
        'toId':'0',
        'toNo':'',
        'userId':'',
        'fname':'',
        'mname':'',
        'lname':'',
        'fullName':'',
        'office':'',
        'suffix':'',
        'designation':'',
        'province':'',
        'city':'',
        'barangay':'',
        'address':'',
        'noOfDay':'',
        'certificateOfAppearance':'',
        'departureMonth':'',
        'arrivalMonth':'',
        'inclusiveDate':'',
        'travelExpense':'',
        'encodedBy': sessionStorage.getItem('userId'),
        'encodedByName': sessionStorage.getItem('name'),
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
            title: "Employee",
            minWidth: 200,
            field: "fullName",
            hozAlign: "center",
            headerHozAlign: "center",
            vertAlign: "middle",
            print: false,
            download: false,
            formatter(cell) {
                return `<div>
                    <div class="font-medium whitespace-nowrap">${cell.getData().fullName}</div>
                        <div class="text-slate-500 text-xs whitespace-nowrap"><label>Designation: </label>${
                          cell.getData().designation
                        }</div>
                        <div class="text-slate-500 text-xs whitespace-nowrap"><label>Office: </label>${
                          cell.getData().office
                        }</div>
                    </div>`;
                },
        },
        {
            title: "Inclusive Dates",
            minWidth: 200,
            field: "inclusiveDate",
            hozAlign: "center",
            headerHozAlign: "center",
            vertAlign: "middle",
            print: false,
            download: false,
            formatter(cell) {
                return `<div>
                    <div class="font-medium whitespace-nowrap">${cell.getData().inclusiveDate}</div>
                        <div class="text-slate-500 text-xs whitespace-nowrap"><label>Departure Month: </label>${
                          cell.getData().departureMonth
                        }</div>
                        <div class="text-slate-500 text-xs whitespace-nowrap"><label>Arrival Month: </label>${
                          cell.getData().arrivalMonth
                        }</div>
                    </div>`;
                },
        },
        {
            title: "Destination",
            minWidth: 200,
            field: "address",
            hozAlign: "center",
            headerHozAlign: "center",
            vertAlign: "middle",
            print: false,
            download: false,
            formatter(cell) {
                return `<div>
                    <div class="font-medium whitespace-nowrap">${cell.getData().city}</div>
                        <div class="text-slate-500 text-xs whitespace-nowrap"><label>Province: </label>${
                          cell.getData().province
                        }</div>
                        <div class="text-slate-500 text-xs whitespace-pre-wrap"><label>Address: </label>${
                          cell.getData().address
                        }</div>
                    </div>`;
                },
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
    const brgyDropdown = ref(false);
    const addressSelect = reactive({
        'addressName':''
    })
    const brgySelect = ref();
    const showSearchBrgy = () => {
        brgyDropdown.value = true;
    };
    const hideSearchBrgy = () => {
    brgyDropdown.value = false;
    };
    const checkBa = (item: any) => {
        let itemized = item.address.split(", ")
        formTODetail.province = itemized[2]
        formTODetail.city = itemized[1]
        formTODetail.barangay = item.barangayName
        formTODetail.address = item.address
        addressSelect.addressName = item.address
    }

    const columnDataTO = ref([
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
            title: "TO Number",
            minWidth: 200,
            field: "toNo",
            hozAlign: "center",
            headerHozAlign: "center",
            vertAlign: "middle",
            print: false,
            download: false,
            formatter(cell) {
                return `<div>
                    <div class="font-medium whitespace-nowrap">${cell.getData().toNo}</div>
                        <div class="text-slate-500 text-xs whitespace-nowrap"><label>TO Date: </label>${
                            cell.getData().toDate
                        }</div>
                        <div class="text-slate-500 text-xs whitespace-nowrap"><label>Office: </label>${
                            cell.getData().office
                        }</div>
                    </div>`;
                },
        },
        {
            title: "Purpose",
            minWidth: 200,
            field: "purpose",
            hozAlign: "center",
            headerHozAlign: "center",
            vertAlign: "middle",
            print: false,
            download: false,
            formatter(cell) {
                return `<div>
                    <div class="font-medium whitespace-nowrap">${cell.getData().purpose}</div>
                       
                    </div>`;
                },
        },
        {
            title: "PO Attachment",
            minWidth: 200,
            field: "poAttachment",
            hozAlign: "center",
            headerHozAlign: "center",
            vertAlign: "middle",
            print: false,
            download: false,
            formatter(cell) {
                return `<div>
                    <div class="font-medium whitespace-nowrap">${cell.getData().poAttachment}</div>
                    
                    </div>`;
                },
        },
        {
            title: "RO Attachment",
            minWidth: 200,
            field: "roAttachment",
            hozAlign: "center",
            headerHozAlign: "center",
            vertAlign: "middle",
            print: false,
            download: false,
            formatter(cell) {
                return `<div>
                    <div class="font-medium whitespace-nowrap">${cell.getData().roAttachment}</div>
                    
                    </div>`;
                },
        },
        {
            title: "Status",
            minWidth: 200,
            field: "status",
            hozAlign: "center",
            headerHozAlign: "center",
            vertAlign: "middle",
            print: false,
            download: false,
        },
        
    ])
    return {
        formTO,
        formTODetail,
        columnData,
        columnDataTO,
        addressSelect,
        brgySelect,
        showSearchBrgy,
        hideSearchBrgy,
        brgyDropdown,
        checkBa,
        current_date,
    }
}