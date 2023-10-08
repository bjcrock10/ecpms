import { ref, reactive} from "vue"
import { stringToHTML } from "../utils/helper";
export function useUser(){
    interface Response {
      name?: string;
      jobs?: string;
      email?: string;
      status?: string;
    }
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
        title: "No",
        minWidth: 200,
        field: "id",
        hozAlign: "center",
        headerHozAlign: "center",
        vertAlign: "middle",
        print: false,
        download: false
        },
      {
      title: "Name",
      minWidth: 200,
      responsive: 0,
      field: "name",
      vertAlign: "middle",
      print: false,
      download: false,
      mutator: (value, data) => data.lname + ', ' + data.fname,
      },
      {
      title: "Jobs",
      minWidth: 200,
      field: "jobs",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: false,
      download: false,
      formatter(cell) {
          return `<div>
              <div class="font-medium whitespace-nowrap">${cell.getData().jobs}</div>
              
          </div>`;
      },
      },
      {
      title: "Email",
      minWidth: 200,
      field: "email",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: false,
      download: false,
      formatter(cell) {
          return `<div>
              <div class="font-medium whitespace-nowrap">${cell.getData().email}</div>
              <div class="text-slate-500 text-xs whitespace-nowrap"><label>Password: </label>${
                cell.getData().password
              }</div>
          </div>`;
      }
      },
      {
      title: "STATUS",
      minWidth: 200,
      field: "status",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: false,
      download: false,
      formatter(cell) {
          const response: Response = cell.getData();
          return `<div class="flex items-center lg:justify-center ${
          response.recStat===0 ? "text-success" : "text-danger"
          }">
              <i data-lucide="check-square" class="w-4 h-4 mr-2"></i> ${
              response.recStat===0 ? "Active" : "Inactive"
              }
          </div>`;
      },
      },
      {
      title: "ACTIONS",
      minWidth: 200,
      field: "actions",
      responsive: 1,
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: false,
      download: false,
      formatter(cell) {
          const a =
          stringToHTML(`<div class="flex items-center lg:justify-center">
                  <a class="flex items-center mr-3" href="javascript:;">
                    <i data-lucide="check-square" class="w-4 h-4 mr-1"></i> Edit
                  </a>
                </div>`);
          a.addEventListener("click", function () {
            addModal.value = true
            formUsers.id = cell.getData().id
            formUsers.lname = cell.getData().lname
            formUsers.fname = cell.getData().fname
            formUsers.mname = cell.getData().mname
            formUsers.suffix = cell.getData().suffix
            formUsers.homeAddress = cell.getData().homeAddress
            formUsers.currentAddress = cell.getData().currentAddress
            formUsers.province = cell.getData().province
            formUsers.zipcode = cell.getData().zipcode
            formUsers.gender = cell.getData().gender
            formUsers.bDate = cell.getData().bDate
            formUsers.companyId = cell.getData().companyId
            formUsers.jobs = cell.getData().jobs
            formUsers.office = cell.getData().office
            formUsers.division = cell.getData().division
            formUsers.uMid = cell.getData().uMid
            formUsers.privileges = cell.getData().privileges
            formUsers.email = cell.getData().email
            formUsers.username = cell.getData().username
            formUsers.password = cell.getData().password
            formUsers.recStat = cell.getData().recStat
          });
          return a;
      },
      },

      // For print format
      {
        title: "No.",
        field: "id",
        visible: false,
        print: true,
        download: true,
        },
      {
      title: "Name",
      field: "name",
      visible: false,
      print: true,
      download: true,
      },
      {
      title: "Jobs",
      field: "jobs",
      visible: false,
      print: true,
      download: true,
      },
      {
      title: "Email",
      field: "email",
      visible: false,
      print: true,
      download: true,
      formatter(cell) {
          return `<div>
              <div class="font-medium whitespace-nowrap">${cell.getData().email}</div>
              <div class="text-slate-500 text-xs whitespace-nowrap"><label>Password: </label>${
                cell.getData().password
              }</div>
          </div>`;
      }
      },
      {
      title: "STATUS",
      field: "status",
      visible: false,
      print: true,
      download: true,
      formatterPrint(cell) {
          return cell.getData().recStat===0? "Active" : "Inactive";
      },
      },
  ])

    const formUsers = reactive({
        'id' : '0',
        'fname': '',
        'lname': '',
        'mname': '',
        'suffix': '',
        'gender': '',
        'homeAddress': '',
        'currentAddress':'',
        'province':'',
        'zipcode':'0',
        'bDate': '',
        'companyId':'',
        'jobs': '',
        'office': '',
        'division': '',
        'uMid': '0',
        'privileges': sessionStorage.getItem('privileges'),
        'email':'',
        'username':'',
        'password':'',
        'recStat':'1',
    });
    const addModal = ref(false);
    const rounded = ref(false);
    const errorMessage = ref();
    const isError = ref(false);
    return {
        columnData,
        formUsers,
        addModal,
        errorMessage,
        isError,
        rounded
    }
}

// export default interface User {
//     id : null;
//     fname: string;
//     lname: string;
//     mname: string;
//     suffix: string;
//     gender: string;
//     homeAddress: string;
//     currentAddress:string;
//     province:string;
//     zipcode:string;
//     bDate: string;
//     companyId:string;
//     jobs: string;
//     office: string;
//     division: string;
//     uMid: string;
//     privileges: string;
//     email:string;
//     username:string;
//     password:string;
//     recStat: number;
//   }