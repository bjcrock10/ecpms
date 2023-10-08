import http from '../http-common';

class AssistanceDataService {
    getAll(): Promise<any> {
      return http.get("/ticket/");
    }
    getLimit(limit: any): Promise<any> {
      return http.get(`/ticket/?limit=${limit}`);
    }
    getByBusiness(id: any): Promise<any> {
        return http.get(`/ticket/?bid=${id}`);
    }
    getByClient(id: any): Promise<any> {
        return http.get(`/ticket/?cid=${id}`);
    }
    get(id: any): Promise<any> {
      return http.get(`/ticket/?id=${id}`);
    }
  
    create(data: any): Promise<any> {
      return http.post("/ticket/", data);
    }
  
    update(id: any, data: any): Promise<any> {
      return http.put(`/ticket/${id}/`, data);
    }

    patch(id: any,data: any): Promise<any> {
      return http.patch(`/ticket/${id}/`, data);
    }
  
    delete(id: any): Promise<any> {
      return http.delete(`/ticket/${id}/`);
    }
  
    deleteAll(): Promise<any> {
      return http.delete(`/ticket/`);
    }
  
    findByName(name: String): Promise<any> {
      return http.get(`/ticket/?name=${name}`);
    }
    count(): Promise<any>{
      return http.get(`/ticket/?count=1`)
    }
    //------------------------------------------------
    getAllMsmeProgram(): Promise<any> {
        return http.get("/msmeprogram/");
    }
    getAllTypeOfAssistance(): Promise<any> {
        return http.get("/typeofassistance/");
    }
    getTypeOfAssistance(id: any): Promise<any>{
      return http.get(`/typeofassistance/?id=${id}`);
    }
    getAllSubtypeAssistance(id: any): Promise<any> {
        return http.get(`/subtypassistance/?id=${id}`);
    }
  }
  
  export default new AssistanceDataService();