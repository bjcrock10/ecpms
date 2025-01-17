import http from '../http-common';
class BNRSDataService {
    getAll(): Promise<any> {
      return http.get("/bnrs/?limit=1");
    }
}
export default new BNRSDataService();