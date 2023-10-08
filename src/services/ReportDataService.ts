import http from '../http-common';

class ReportDataService {
    getAllBusinessReport(): Promise<any> {
      return http.get("/businessreport/?id=1");
    }

    getAllBusinessAssistance(): Promise<any> {
        return http.get("/businessassistance/?id=1");
    }

    getAllClientAssistance(): Promise<any> {
        return http.get("/clientassistance/?id=1");
    }
  }
  
  export default new ReportDataService();