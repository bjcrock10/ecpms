import http from '../http-common';

class ReportDataService {
    getAllBusinessReport(): Promise<any> {
      return http.get("/businessreport/?id=1");
    }

    getAllBusinessAssistance(month:any, office:any): Promise<any> {
        return http.get(`/businessassistance/?id=1&month=${month}&office=${office}`);
    }

    getAllClientAssistance(month:any,office:any): Promise<any> {
        return http.get(`/clientassistance/?id=1&month=${month}&office=${office}`);
    }
    getAllToReport(): Promise<any> {
      return http.get("/traveldetail/?rpt=1");
    }
  }
  
  export default new ReportDataService();