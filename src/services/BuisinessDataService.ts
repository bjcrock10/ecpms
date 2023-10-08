import http from '../http-common';

class BusinessDataService {
    getAll(): Promise<any> {
      return http.get("/business/");
    }
    getLimit(limit: any): Promise<any> {
      return http.get(`/business/?limit=${limit}`);
    }
  
    get(id: any): Promise<any> {
      return http.get(`/business/?id=${id}`);
    }
  
    create(data: any): Promise<any> {
      return http.post("/business/", data);
    }
  
    update(id: any, data: any): Promise<any> {
      return http.put(`/business/${id}/`, data);
    }

    patch(id: any,data: any): Promise<any> {
      return http.patch(`/business/${id}/`, data);
    }
  
    delete(id: any): Promise<any> {
      return http.delete(`/business/${id}/`);
    }
  
    deleteAll(): Promise<any> {
      return http.delete(`/business/`);
    }
  
    findByName(name: String): Promise<any> {
      return http.get(`/business/?name=${name}`);
    }
    
    count(): Promise<any>{
      return http.get(`/business/?count=1`)
    }
    //Social Media Platform-------------------------------------------
    getAllSocial(): Promise<any> {
      return http.get('/socialmedia/')
    }
    getSocial(id: any): Promise<any> {
      return http.get(`/socialmedia/?id=${id}`);
    }
    getSocialByBusiness(id: any): Promise<any> {
      return http.get(`/socialmedia/?bid=${id}`);
    }
    createSocial(data: any): Promise<any> {
      return http.post("/socialmedia/", data);
    }
  
    updateSocial(id: any, data: any): Promise<any> {
      return http.put(`/socialmedia/${id}/`, data);
    }

    patchSocial(id: any,data: any): Promise<any> {
      return http.patch(`/socialmedia/${id}/`, data);
    }
  
    deleteSocial(id: any): Promise<any> {
      return http.delete(`/socialmedia/${id}/`);
    }
    countSocial(): Promise<any>{
      return http.get(`/socialmedia/?count=1`)
    }
    countSocialFiltered(title: any): Promise<any> {
      return http.get(`socialmedia/?cfiltered=${title}`)
    }
    //Ecommerce Platform-------------------------------------------
    getAllEcommerce(): Promise<any> {
      return http.get('/ecommerce/')
    }
    getEcommerce(id: any): Promise<any> {
      return http.get(`/ecommerce/?id=${id}`);
    }
    createEcommerce(data: any): Promise<any> {
      return http.post("/ecommerce/", data);
    }
    getEcommerceByBusiness(id: any): Promise<any> {
      return http.get(`/ecommerce/?bid=${id}`);
    }
    updateEcommerce(id: any, data: any): Promise<any> {
      return http.put(`/ecommerce/${id}/`, data);
    }

    patchEcommerce(id: any,data: any): Promise<any> {
      return http.patch(`/ecommerce/${id}/`, data);
    }
  
    deleteEcommerce(id: any): Promise<any> {
      return http.delete(`/ecommerce/${id}/`);
    }
    countEcommerce(): Promise<any>{
      return http.get(`/ecommerce/?count=1`)
    }
    countEcommerceFiltered(title: any): Promise<any> {
      return http.get(`ecommerce/?cfiltered=${title}`)
    }
    //Business Owner-------------------------------------------
    getAllOwner(): Promise<any> {
      return http.get('/businessowner/')
    }
    getOwnerByBusiness(id: any): Promise<any> {
      return http.get(`/businessowner/?bid=${id}`);
    }
    getOwner(id: any): Promise<any> {
      return http.get(`/businessowner/?id=${id}`);
    }
    createOwner(data: any): Promise<any> {
      return http.post("/businessowner/", data);
    }
  
    updateOwner(id: any, data: any): Promise<any> {
      return http.put(`/businessowner/${id}/`, data);
    }

    patchOwner(id: any,data: any): Promise<any> {
      return http.patch(`/businessowner/${id}/`, data);
    }
  
    deleteOwner(id: any): Promise<any> {
      return http.delete(`/businessowner/${id}/`);
    }
    //Market Plan-------------------------------------------
    getAllMarketPlan(): Promise<any> {
      return http.get('/marketplan/')
    }
    getMarketPlanByBusiness(id: any): Promise<any> {
      return http.get(`/marketplan/?bid=${id}`);
    }
    getMarketPlan(id: any): Promise<any> {
      return http.get(`/marketplan/?id=${id}`);
    }
    createMarketPlan(data: any): Promise<any> {
      return http.post("/marketplan/", data);
    }
  
    updateMarketPlan(id: any, data: any): Promise<any> {
      return http.put(`/marketplan/${id}/`, data);
    }

    patchMarketPlan(id: any,data: any): Promise<any> {
      return http.patch(`/marketplan/${id}/`, data);
    }
  
    deleteMarketPlan(id: any): Promise<any> {
      return http.delete(`/marketplan/${id}/`);
    }
    //Market Training-------------------------------------------
    getAllMarketTraining(): Promise<any> {
      return http.get('/markettraining/')
    }
    getMarketTrainingByBusiness(id: any): Promise<any> {
      return http.get(`/markettraining/?bid=${id}`);
    }
    getMarketTraining(id: any): Promise<any> {
      return http.get(`/markettraining/?id=${id}`);
    }
    createMarketTraining(data: any): Promise<any> {
      return http.post("/markettraining/", data);
    }
  
    updateMarketTraining(id: any, data: any): Promise<any> {
      return http.put(`/markettraining/${id}/`, data);
    }

    patchMarketTraining(id: any,data: any): Promise<any> {
      return http.patch(`/markettraining/${id}/`, data);
    }
  
    deleteMarketTraining(id: any): Promise<any> {
      return http.delete(`/markettraining/${id}/`);
    }
    
  }
  
  export default new BusinessDataService();