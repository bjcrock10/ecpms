import http from '../http-common';

class OrganizationDataService {
    getAll(): Promise<any> {
      return http.get("/organization/");
    }
    getLimit(limit: any): Promise<any> {
      return http.get(`/organization/?limit=${limit}`);
    }
  
    get(id: any): Promise<any> {
      return http.get(`/organization/?id=${id}`);
    }
  
    create(data: any): Promise<any> {
      return http.post("/organization/", data);
    }
  
    update(id: any, data: any): Promise<any> {
      return http.put(`/organization/${id}/`, data);
    }

    patch(id: any,data: any): Promise<any> {
      return http.patch(`/organization/${id}/`, data);
    }
  
    delete(id: any): Promise<any> {
      return http.delete(`/organization/${id}/`);
    }
  
    deleteAll(): Promise<any> {
      return http.delete(`/organization/`);
    }
  
    findByTitle(title: String): Promise<any> {
      return http.get(`/organization/?title=${title}`);
    }

    count(): Promise<any> {
      return http.get(`/organization/?count=1`)
    }
  }
  
  export default new OrganizationDataService();