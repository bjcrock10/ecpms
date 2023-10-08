import { ref, reactive} from "vue"
import { stringToHTML } from "../utils/helper";
import AssistanceDataService from '../services/AssistanceDataService';
import ResponseData from "./response";
export function useAssistance(){
    const date = new Date();
    const current_date = date.getFullYear()+"-"+(date.getMonth()+1)+"-"+ date.getDate();
    const formAssistance = reactive({
        'id':'0',
        'business':'',
        'client':'',
        'assistanceType':'',
        'subTypeAssistance':'',
        'title':'',
        'venue':'',
        'assistanceRemarks':'',
        'msmeProgram':'',
        'msmeProgramAvail':'',
        'dateAvailment':'',
        'referTo':'',
        'jobsGen':'',
        'investmentGen':'',
        'domesticSalesGen':'',
        'exportSalesGen':'',
        'amountLoan':'',
        'edtLevel':'',
        'digitalLevel':'',
        'dateProvidedFrom':'',
        'dateProvidedTo':'',
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
            title: "Assistance Level(EDT)",
            minWidth: 200,
            field: "edtLevel",
            hozAlign: "center",
            headerHozAlign: "center",
            vertAlign: "middle",
            print: false,
            download: false
        },
        {
            title: "Type of Assistance",
            minWidth: 200,
            responsive: 0,
            field: "assistanceType",
            hozAlign: "center",
            headerHozAlign: "center",
            vertAlign: "middle",
            print: false,
            download: false
        },
        {
            title: "Sub-type",
            minWidth: 200,
            field: "subTypeAssistance",
            hozAlign: "center",
            headerHozAlign: "center",
            vertAlign: "middle",
            print: false,
            download: false
        },
        {
            title: "Title",
            minWidth: 200,
            field: "title",
            hozAlign: "center",
            headerHozAlign: "center",
            vertAlign: "middle",
            print: false,
            download: false
        },
        {
            title: "Date of Assistance",
            minWidth: 200,
            field: "dateProvidedFrom",
            hozAlign: "center",
            headerHozAlign: "center",
            print: false,
            download: false,
            formatter(cell) {
                return `<div>
                    <div class="font-medium whitespace-nowrap">
                        ${cell.getData().dateProvidedFrom} - 
                        ${cell.getData().dateProvidedTo}
                    </div>
                    </div>`;
                },
        },
        {
            title: "Assisting Officer",
            minWidth: 200,
            field: "encodedByName",
            hozAlign: "center",
            headerHozAlign: "center",
            vertAlign: "middle",
            print: false,
            download: false
        },
        // For print format
        {
            title: "Assistance Level(EDT)",
            minWidth: 100,
            maxWidth: 100,
            field: "edtLevel",
            hozAlign: "center",
            headerHozAlign: "center",
            vertAlign: "middle",
            visible: false,
            print: true,
            download: true,
        },
        {
            title: "Type of Assistance",
            minWidth: 200,
            responsive: 0,
            field: "assistanceType",
            hozAlign: "center",
            headerHozAlign: "center",
            vertAlign: "middle",
            visible: false,
            print: true,
            download: true,
        },
        {
            title: "Sub-type",
            minWidth: 200,
            field: "subTypeAssistance",
            hozAlign: "center",
            headerHozAlign: "center",
            vertAlign: "middle",
            visible: false,
            print: true,
            download: true,
        },
        {
            title: "Title",
            minWidth: 200,
            field: "title",
            hozAlign: "center",
            headerHozAlign: "center",
            vertAlign: "middle",
            visible: false,
            print: true,
            download: true,
        },
        {
            title: "Date of Assistance",
            minWidth: 200,
            field: "dateProvidedFrom",
            hozAlign: "center",
            headerHozAlign: "center",
            visible: false,
            print: true,
            download: true,
            formatter(cell) {
                return `<div>
                    <div class="font-medium whitespace-nowrap">
                        ${cell.getData().dateProvidedFrom} - 
                        ${cell.getData().dateProvidedTo}
                    </div>
                    </div>`;
                },
        },
        {
            title: "Assisting Officer",
            minWidth: 200,
            field: "encodedByName",
            hozAlign: "center",
            headerHozAlign: "center",
            vertAlign: "middle",
            visible: false,
            print: true,
            download: true,
        }
    ])
    return {
        formAssistance,
        columnData
    }
}