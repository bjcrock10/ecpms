import http from '../http-common';

class CodeBook {
    getAll(): Promise<any> {
      return http.get("/codebook/");
    }
    getType(idtype: any): Promise<any> {
      return http.get(`/codebook/?idtype=${idtype}`);
    }
  
    get(id: any): Promise<any> {
      return http.get(`/codebook/?id=${id}`);
    }
  
    create(data: any): Promise<any> {
      return http.post("/codebook/", data);
    }
  
    update(id: any, data: any): Promise<any> {
      return http.put(`/codebook/${id}/`, data);
    }

    patch(id: any,data: any): Promise<any> {
      return http.patch(`/codebook/${id}/`, data);
    }
  
    delete(id: any): Promise<any> {
      return http.delete(`/codebook/${id}/`);
    }
  
  }
  
  export default new CodeBook();