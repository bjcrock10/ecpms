import http from '../http-common';

class ProductDataService {
    getAll(): Promise<any> {
      return http.get("/product/");
    }
    getLimit(limit: any): Promise<any> {
      return http.get(`/product/?limit=${limit}`);
    }
    getByBusiness(id: any): Promise<any> {
        return http.get(`/product/?bid=${id}`);
      }
    get(id: any): Promise<any> {
      return http.get(`/product/?id=${id}`);
    }
  
    create(data: any): Promise<any> {
      return http.post("/product/", data);
    }
  
    update(id: any, data: any): Promise<any> {
      return http.put(`/product/${id}/`, data);
    }

    patch(id: any,data: any): Promise<any> {
      return http.patch(`/product/${id}/`, data);
    }
  
    delete(id: any): Promise<any> {
      return http.delete(`/product/${id}/`);
    }
  
    deleteAll(): Promise<any> {
      return http.delete(`/product/`);
    }
  
    findByName(name: String): Promise<any> {
      return http.get(`/product/?name=${name}`);
    }

    count(): Promise<any> {
      return http.get(`/product/?count=1`)
    }
  }
  
  export default new ProductDataService();