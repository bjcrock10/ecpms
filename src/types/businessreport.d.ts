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
                "uniqueName": "encodedDate.Month"
            }
        ],
        "rows": [
            {
                "uniqueName": "businessName"
            },
            {
                "uniqueName": "fullName"
            },
            {
                "uniqueName": "edtLevel"
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
                "uniqueName": "encodedDate"
            }
        ],
        "rows": [
            {
                "uniqueName": "assistingStaff"
            },
            {
                "uniqueName": "staffStation"
            },
            {
                "uniqueName": "fullName"
            },
            {
                "uniqueName": "digitalLevel"
            }
        ],
        "columns": [
            {
                "uniqueName": "edtLevel"
            },
            {
                "uniqueName": "Measures"
            }
        ],
        "measures": [
            {
                "uniqueName": "edtLevel",
                "aggregation": "count",
                "availableAggregations": [
                    "count",
                    "distinctcount"
                ]
            }
        ],
    }
    const slicerTO = {
        "reportFilters": [
            {
                "uniqueName": "departureMonth.Month"
            }
        ],
        "rows": [
            {
                "uniqueName": "office"
            },
            {
                "uniqueName": "fullName"
            }
        ],
        "columns": [
            {
                "uniqueName": "Measures"
            }
        ],
        "measures": [
            {
                "uniqueName": "city",
                "aggregation": "count"
            },
        ],
    }
    return{
        slicer,
        slicerBusinessAssistance,
        slicerClientAssistance,
        slicerTO,
        businessData,
    } 
}