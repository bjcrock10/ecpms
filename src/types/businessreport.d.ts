import { ref, reactive} from "vue"
import { stringToHTML } from "../utils/helper";
export function useBusinessReport(){
    const businessData = ref([]);
    const slicer = {
        "reportFilters": [
            {
                "uniqueName": "dateProvidedTo.Month"
            }
        ],
        "rows": [
            {
                "uniqueName": "businessName"
            },
            {
                "uniqueName": "organization"
            },
            {
                "uniqueName": "productName"
            }
        ],
        "columns": [
            {
                "uniqueName": "Measures"
            }
        ],
        "measures": [
            {
                "uniqueName": "amountLoan",
                "aggregation": "sum"
            },
            {
                "uniqueName": "investmentGen",
                "aggregation": "sum"
            },
            {
                "uniqueName": "jobsGen",
                "aggregation": "sum"
            }
        ]
    }
    const slicerBusinessAssistance = {
        "reportFilters": [
            {
                "uniqueName": "dateProvidedTo.Month"
            },
            {
                "uniqueName": "assistingStaff"
            }
        ],
        "rows": [
            {
                "uniqueName": "businessName"
            },
            {
                "uniqueName": "fullName"
            }
        ],
        "columns": [
            {
                "uniqueName": "Measures"
            },
            {
                "uniqueName": "assistanceType"
            }
        ],
        "measures": [
            {
                "uniqueName": "Total Assistance Provided",
                "formula": "count(\"assistanceTitle\") ",
                "caption": "Sum of Total Assistance Provided"
            },
            {
                "uniqueName": "assistanceTypeCount",
                "formula": "count(\"assistanceTitle\") ",
                "caption": "Sum of assistanceTypeCount",
                "active": false
            }
        ],
    }
    const slicerClientAssistance = {
        "reportFilters": [
            {
                "uniqueName": "dateProvidedTo.Month"
            }
        ],
        "rows": [
            {
                "uniqueName": "fullName"
            },
            {
                "uniqueName": "msmeProgram"
            }
        ],
        "columns": [
            {
                "uniqueName": "Measures"
            }
        ],
        "measures": [
            {
                "uniqueName": "amountLoan",
                "aggregation": "sum"
            },
            {
                "uniqueName": "investmentGen",
                "aggregation": "sum"
            },
            {
                "uniqueName": "jobsGen",
                "aggregation": "sum"
            }
        ],
    }
    return{
        slicer,
        slicerBusinessAssistance,
        slicerClientAssistance,
        businessData,
    } 
}
