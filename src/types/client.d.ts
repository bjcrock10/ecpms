import { ref, reactive} from "vue"
import { stringToHTML } from "../utils/helper";
import ClientDataService from '../services/ClientDataService';
import OrganizationDataService from "../services/Organization";
import ResponseData from "./response";
export function useClient(){
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
        minWidth: 100,
        maxWidth: 100,
        field: "id",
        hozAlign: "center",
        headerHozAlign: "center",
        vertAlign: "middle",
        print: false,
        download: false
      },
      {
        title: "Farmers Id",
        minWidth: 100,
        maxWidth: 150,
        field: "farmerId",
        hozAlign: "center",
        headerHozAlign: "center",
        vertAlign: "middle",
        print: false,
        download: false,
        formatter(cell) {
            return `<div>
                <div class="font-medium whitespace-nowrap">${cell.getData().farmerId}</div>
                
            </div>`;
        },
      },
      {
      title: "Name",
      minWidth: 200,
      responsive: 0,
      field: "name",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: false,
      download: false,
      mutator: (value, data) => data.lname + ', ' + data.fname + " " + data.mname,
      },
      {
      title: "Province",
      minWidth: 200,
      field: "province",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: false,
      download: false,
      formatter(cell) {
          return `<div>
              <div class="font-medium whitespace-nowrap">${cell.getData().province}</div>
              
          </div>`;
      }
      },
      {
      title: "Address",
      minWidth: 200,
      field: "address",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: false,
      download: false,
      formatter(cell) {
        return `<div>
            <div class="font-medium whitespace-nowrap">${cell.getData().address}</div>
                <div class="text-slate-500 text-xs whitespace-nowrap"><label>LGU: </label>${
                  cell.getData().lgu
                }</div>
                <div class="text-slate-500 text-xs whitespace-nowrap"><label>Barangay: </label>${
                  cell.getData().barangay
                }</div>
            </div>`;
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
        title: "Farmers ID",
        field: "farmerId",
        visible: false,
        print: true,
        download: true,
      },
      {
        title: "First NAme",
        field: "fname",
        visible: false,
        print: true,
        download: true,
      },
      {
        title: "Middle Name",
        field: "mname",
        visible: false,
        print: true,
        download: true,
      },
      {
        title: "Last Name",
        field: "lname",
        visible: false,
        print: true,
        download: true,
      },
      {
        title: "Suffix",
        field: "suffix",
        visible: false,
        print: true,
        download: true,
      },
      {
        title: "Province",
        field: "province",
        visible: false,
        print: true,
        download: true,
      },
      {
        title: "LGU",
        field: "lgu",
        visible: false,
        print: true,
        download: true,
      },
      {
        title: "barangay",
        field: "barangay",
        visible: false,
        print: true,
        download: true,
      },
      {
        title: "address",
        field: "address",
        visible: false,
        print: true,
        download: true,
      },
      {
        title: "age/bdate",
        field: "age",
        visible: false,
        print: true,
        download: true,
      },
      {
        title: "gender",
        field: "gender",
        visible: false,
        print: true,
        download: true,
      },
      {
        title: "civilStatus",
        field: "civilStatus",
        visible: false,
        print: true,
        download: true
      },
      {
        title: "education",
        field: "education",
        visible: false,
        print: true,
        download: true
      },
  ])
  const date = new Date();
  const current_date = date.getFullYear()+"-"+(date.getMonth()+1)+"-"+ date.getDate();
    const formClient = reactive({
        'id' : '0',
        'farmerId' : '0',
        'fname': '',
        'lname': '',
        'mname': '',
        'fullName': '',
        'suffix': '',
        'province': '',
        'lgu':'',
        'barangay':'',
        'address':'',
        'age':'',
        'gender': '',
        'civilStatus':'',
        'education':'',
        'religion':'',
        'motherMaidenName':'',
        'personNotify':'',
        'socialClassification':'',
        'disability':'',
        'pwdSpecify':'',
        'ip':'',
        'ipGroup':'',
        'ipSpecify':'',
        'tenurialStatus': '',
        'farmSize':'',
        'mobileNo':'',
        'telNo':'',
        'faxNo':'',
        'email':'0',
        'yearStarted': '',
        'zipcode':'',
        'longitude':'',
        'latitude':'',
        'businessId':'0',
        'clientCode': '',
        'classification': '',
        'accreditation': '',
        'prefix': '',
        'designation': '',
        'city':'0',
        'organization':'',
        'encodedBy': sessionStorage.getItem('userId'),
        'encodedByName': sessionStorage.getItem('name'),
        'encodedDate':current_date,
        'recStat':'1',
    });
    const addModal = ref(false);
    const rounded = ref(false);
    const errorMessage = ref();
    const isError = ref(false);
    //------------------------------------------------------------------
    const brgyDropdown = ref(false);
    const lnameDropdown = ref(false);
    const showSearchBrgy = () => {
      brgyDropdown.value = true;
    };
    const hideSearchBrgy = () => {
      brgyDropdown.value = false;
    };
    const showSearchLname = () => {
      lnameDropdown.value = true;
    };
    const hideSearchLname = () => {
      lnameDropdown.value = false;
    };
    const message = ref("Successfully Save!");
    const messageDetail = ref ();
    const buttonTitle = ref("Submit");
    const buttonIcon = ref("Save");
    const setAddModal = (value: boolean) => {
      addModal.value = value;
    };
    const select = ref("1");
    const brgy = ref();
    const sendButtonRef = ref(null);
    const ncfrs = ref();
    const tenurial = ref();
    const accreditation = ref();
    const organization = ref();
    const disNcfrs = ref(true);
    const disTenurial = ref(true);
    const disAccreditation = ref(true);
    const disOrganization = ref(true);

    const brgySelect = ref();
    const citySelect = ref();
    const clientList = ref();
    const brgyId = ref();
    const addressSelect = reactive({
      'addressName':''
    })
    const checkBa = (item: any) => {
      formClient.lgu = item.cityName
      formClient.barangay = item.barangayName
      formClient.province = item.provinceName
      formClient.city = item.city
      addressSelect.addressName = item.address
    }
    const aNcfrs = () =>{
      if(ncfrs.value !== 'Yes'){
        disNcfrs.value = true
        formClient.farmerId = ncfrs.value
      }
      else{
        disNcfrs.value = false
        formClient.farmerId = ""
      }
    };
    const dTenurial = () =>{
      if(tenurial.value !== 'Others'){
        disTenurial.value = true
        formClient.tenurialStatus = tenurial.value
      }
      else{
        disTenurial.value = false
        formClient.tenurialStatus = ""
      }
    };
    const dOrganization = () =>{
      if(organization.value !== 'Yes'){
        disOrganization.value = true
        formClient.ipGroup = organization.value
      }
      else{
        disOrganization.value = false
        formClient.ipGroup = ""
      }
    };
    const dAccreditation = () =>{
      if(accreditation.value === 'No'){
        disAccreditation.value = true
        formClient.accreditation = accreditation.value
      }
      else{
        disAccreditation.value = false
        formClient.accreditation= ""
      }
    };
    const clientSubmit = ref(false)
    const updateClientInfo = async (id:any, data: any) =>{
      formOrganization.title = data.ipGroup.toUpperCase()
      OrganizationDataService.findByTitle(data.ipGroup).then((response: ResponseData)=>{
        if(response.data.length===0){
          OrganizationDataService.create(formOrganization).then((response: ResponseData)=>{
           data.id = response.data.id
          }).catch((e: Error)=>{
            console.log(e.message)
          })
        }
        else{
          data.organization = response.data[0].id
        }
      })
      ClientDataService.update(id,data).then((response: ResponseData)=>{
        clientSubmit.value = true
      }).catch((e: Error)=>{
        clientSubmit.value = false
          console.log(e.message)
      })
    }
    const patchClientInfo =async (id:any, data: any) => {
      ClientDataService.patch(id,data).then((response: ResponseData)=>{
        clientSubmit.value = true
      }).catch((e: Error)=>{
        clientSubmit.value = false
          console.log(e.message)
      })
    }
    const getClientInfo = async (id) =>{
      ClientDataService.get(id).then((response: ResponseData)=>{
        formClient.id = response.data[0].id
        formClient.farmerId = response.data[0].farmerIds
        formClient.lname = response.data[0].lname.toUpperCase()
        formClient.fname = response.data[0].fname.toUpperCase()
        formClient.mname = response.data[0].mname.toUpperCase()
        formClient.suffix = response.data[0].suffix.toUpperCase()
        formClient.province = response.data[0].province.toUpperCase()
        formClient.lgu = response.data[0].lgu.toUpperCase()
        formClient.barangay = response.data[0].barangay.toUpperCase()
        addressSelect.addressName = response.data[0].barangay.toUpperCase() + ", " +response.data[0].lgu.toUpperCase()+ ",  " + response.data[0].province.toUpperCase()
        formClient.address = response.data[0].address.toUpperCase()
        formClient.gender = response.data[0].gender
        formClient.age = response.data[0].age
        formClient.civilStatus = response.data[0].civilStatus
        formClient.tenurialStatus = response.data[0].tenurialStatus.toUpperCase()
        formClient.classification = response.data[0].classification
        formClient.telNo = response.data[0].telNo.toUpperCase()
        formClient.personNotify = response.data[0].personNotify.toUpperCase()
        formClient.socialClassification = response.data[0].socialClassification
        formClient.faxNo = response.data[0].faxNo.toUpperCase()
        formClient.pwdSpecify = response.data[0].pwdSpecify.toUpperCase()
        formClient.farmerId = response.data[0].farmerId.toUpperCase()
        formClient.ipGroup = response.data[0].ipGroup
        selectOrganization.value = [response.data[0].ipGroup]
        formClient.designation = response.data[0].designation.toUpperCase()
        formClient.tenurialStatus = response.data[0].tenurialStatus.toUpperCase()
        formClient.accreditation = response.data[0].accreditation.toUpperCase()
        formClient.mobileNo = response.data[0].mobileNo
        formClient.email = response.data[0].email
        formClient.yearStarted = response.data[0].yearStarted
        formClient.businessId = response.data[0].businessId
        formClient.clientCode = response.data[0].clientCode
        formClient.prefix = response.data[0].prefix.toUpperCase()
        formClient.zipcode = response.data[0].zipcode
        formClient.designation = response.data[0].designation.toUpperCase()
        formClient.recStat = response.data[0].recStat
      }).catch((e: Error)=>{
          console.log(e.message)
      })
      OrganizationDataService.getAll().then((response: ResponseData)=>{
        orgList.value = response.data
      })
    }
    const formOrganization = reactive({
      title : '',
      recStat : '0'
    });
    const selectOrganization = ref(["0"]);
    const orgList = ref([]);
    return {
        columnData,
        formClient,
        addModal,
        errorMessage,
        isError,
        rounded,
        brgyDropdown,
        lnameDropdown, showSearchBrgy, hideSearchBrgy, showSearchLname, hideSearchLname, 
        message, messageDetail, buttonTitle, buttonIcon, setAddModal, select, brgy, sendButtonRef, ncfrs, tenurial,
        accreditation, organization, disNcfrs, disTenurial, disAccreditation, disOrganization, brgySelect, citySelect,
        clientList, addressSelect, checkBa, aNcfrs, dTenurial, dOrganization, dAccreditation, getClientInfo, 
        updateClientInfo, clientSubmit, patchClientInfo, brgyId, formOrganization, selectOrganization, orgList
    }
}