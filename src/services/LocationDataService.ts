import http from '../http-common';

class ClientDataService {
    getAllBrgy(): Promise<any> {
      return http.get("/barangay/");
    }
    getLimitBrgy(limit: any): Promise<any> {
      return http.get(`/barangay/?limit=${limit}`);
    }
  
    getBrgy(id: any): Promise<any> {
      return http.get(`/barangay/?id=${id}`);
    }

    getBrgyByCity(cityId: any): Promise<any> {
        return http.get(`barangay/?cityId=${cityId}`);
    }

    getAllCity(): Promise<any> {
        return http.get(`/city/`);
    }
    
    getCity(id: any): Promise<any> {
        return http.get(`/city/${id}/`);
    }

    getCityByProvince(provinceId: any): Promise<any> {
        return http.get(`/city/?provinceId=${provinceId}`);
    }

    getProvince(id: any): Promise<any> {
        return http.get(`/province/${id}/`);
    }

    getRegion(id: any): Promise<any> {
        return http.get(`/region/${id}/`);
    }

    getAllRegion(): Promise<any> {
        return http.get(`/region/`);
    }
    
    create(data: any): Promise<any> {
      return http.post("/barangay/", data);
    }
  
    update(id: any, data: any): Promise<any> {
      return http.put(`/barangay/${id}/`, data);
    }

    patch(id: any,data: any): Promise<any> {
      return http.patch(`/barangay/${id}/`, data);
    }
  
    delete(id: any): Promise<any> {
      return http.delete(`/barangay/${id}/`);
    }
  
    deleteAll(): Promise<any> {
      return http.delete(`/barangay/`);
    }
  
    findByTitle(title: String): Promise<any> {
      return http.get(`/barangay/?title=${title}`);
    }

    getBarangayVal(brgy: any): Promise<any> {
      return http.get(`/barangay/?jtb=${brgy}`);
    }
    getBarangay(): Promise<any> {
      return http.get(`/barangay/`);
    }
  }
  
  export default new ClientDataService();