import http from '../http-common';

class ReportDataService {
    getAllBusinessReport(): Promise<any> {
      return http.get("/businessreport/?id=1");
    }

    getAllBusinessAssistance(id:any,month:any, userid: any): Promise<any> {
        return http.get(`/businessassistance/?id=${id}&month=${month}&userid=${userid}`);
    }

    getAllClientAssistance(id:any,month:any,userid: any): Promise<any> {
        return http.get(`/clientassistance/?id=${id}&month=${month}&userid=${userid}`);
    }
    getAllToReport(): Promise<any> {
      return http.get("/traveldetail/?rpt=1");
    }
  }
  
  export default new ReportDataService();