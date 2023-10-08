import http from '../http-common';

class TravelOrderService {
    getAll(): Promise<any> {
      return http.get("/travelorder/");
    }

    getLimit1(limit: any): Promise<any> {
      return http.get("/travelorder/");
    }
  
    getLimit(limit: any): Promise<any> {
      return http.get(`/travelorder/`);
    }

    get(id: any): Promise<any> {
      return http.get(`/travelorder/${id}/`);
    }

    getByBusiness(id: any): Promise<any> {
      return http.get(`/travelorder/${id}/`);
    }

    create(data: any): Promise<any> {
      return http.post("/travelorder/", data);
    }
  
    update(id: any, data: any): Promise<any> {
      return http.put(`/travelorder/${id}/`, data);
    }

    patch(id: any,data: any): Promise<any> {
      return http.patch(`/travelorder/${id}/`, data);
    }
  
    delete(id: any): Promise<any> {
      return http.delete(`/travelorder/${id}/`);
    }
  
    deleteAll(): Promise<any> {
      return http.delete(`/travelorder/`);
    }
  }
  
  export default new TravelOrderService();