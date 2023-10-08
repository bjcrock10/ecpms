import http from '../http-common';

class ClientDataService {
    getAll(): Promise<any> {
      return http.get("/client/");
    }
    getLimit(limit: any): Promise<any> {
      return http.get(`/client/?limit=${limit}`);
    }
  
    get(id: any): Promise<any> {
      return http.get(`/client/?id=${id}`);
    }
  
    create(data: any): Promise<any> {
      return http.post("/client/", data);
    }
  
    update(id: any, data: any): Promise<any> {
      return http.put(`/client/${id}/`, data);
    }

    patch(id: any,data: any): Promise<any> {
      return http.patch(`/client/${id}/`, data);
    }
  
    delete(id: any): Promise<any> {
      return http.delete(`/client/${id}/`);
    }
  
    deleteAll(): Promise<any> {
      return http.delete(`/client/`);
    }
  
    findByLname(lname: String): Promise<any> {
      return http.get(`/client/?lname=${lname}`);
    }

    count(): Promise<any> {
      return http.get(`/client/?count=1`)
    }
  }
  
  export default new ClientDataService();