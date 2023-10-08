import http from '../http-common';

class TravelOrderDetailService {
    getAll(): Promise<any> {
      return http.get("/traveldetail/");
    }

    getLimit(limit: any): Promise<any> {
      return http.get("/traveldetail/");
    }
  
    get(id: any): Promise<any> {
      return http.get(`/traveldetail/?id=${id}`);
    }

    getByBusiness(id: any): Promise<any> {
        return http.get(`/traveldetail/?id=${id}`);
    }
  
    create(data: any): Promise<any> {
      return http.post("/traveldetail/", data);
    }
  
    update(id: any, data: any): Promise<any> {
      return http.put(`/traveldetail/${id}/`, data);
    }

    patch(id: any,data: any): Promise<any> {
      return http.patch(`/traveldetail/${id}/`, data);
    }
  
    delete(id: any): Promise<any> {
      return http.delete(`/traveldetail/${id}/`);
    }
  
    deleteAll(): Promise<any> {
      return http.delete(`/traveldetail/`);
    }

    getTODetailByToId(id: any): Promise<any> {
      return http.get(`/traveldetail/?toid=${id}/`);
    }
  }
  
  export default new TravelOrderDetailService();