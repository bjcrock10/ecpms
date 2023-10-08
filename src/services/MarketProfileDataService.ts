import http from '../http-common';

class MarketProfileDataService {
    getAll(): Promise<any> {
      return http.get("/marketprofile/");
    }
    getLimit(limit: any): Promise<any> {
      return http.get(`/marketprofile/?limit=${limit}`);
    }
    getByBusiness(id: any): Promise<any> {
        return http.get(`/marketprofile/?bid=${id}`);
      }
    get(id: any): Promise<any> {
      return http.get(`/marketprofile/?id=${id}`);
    }
  
    create(data: any): Promise<any> {
      return http.post("/marketprofile/", data);
    }
  
    update(id: any, data: any): Promise<any> {
      return http.put(`/marketprofile/${id}/`, data);
    }

    patch(id: any,data: any): Promise<any> {
      return http.patch(`/marketprofile/${id}/`, data);
    }
  
    delete(id: any): Promise<any> {
      return http.delete(`/marketprofile/${id}/`);
    }
  
    deleteAll(): Promise<any> {
      return http.delete(`/marketprofile/`);
    }
  
    findByName(name: String): Promise<any> {
      return http.get(`/marketprofile/?name=${name}`);
    }
    //-----------------------------------------------------------------------------
    getAllSourcing(): Promise<any> {
        return http.get("/materialsource/");
      }
    getByBusinessSourcing(id: any): Promise<any> {
        return http.get(`/materialsource/?bid=${id}`);
    }
    getSourcing(id: any): Promise<any> {
        return http.get(`/materialsource/?id=${id}`);
    }

    createSourcing(data: any): Promise<any> {
        return http.post("/materialsource/", data);
    }

    updateSourcing(id: any, data: any): Promise<any> {
        return http.put(`/materialsource/${id}/`, data);
    }

    patchSourcing(id: any,data: any): Promise<any> {
        return http.patch(`/materialsource/${id}/`, data);
    }

    deleteSourcing(id: any): Promise<any> {
        return http.delete(`/materialsource/${id}/`);
    }
  }
  
  export default new MarketProfileDataService();