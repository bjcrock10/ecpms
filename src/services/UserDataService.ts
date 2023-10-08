import http from '../http-common';

class UserDataService {
    getAll(): Promise<any> {
      return http.get("/user/");
    }

    getLimit(limit: any): Promise<any> {
      return http.get("/user/");
    }
  
    get(id: any): Promise<any> {
      return http.get(`/user/${id}/`);
    }
  
    create(data: any): Promise<any> {
      return http.post("/user/", data);
    }
  
    update(id: any, data: any): Promise<any> {
      return http.put(`/user/${id}/`, data);
    }

    patch(id: any,data: any): Promise<any> {
      return http.patch(`/user/${id}/`, data);
    }
  
    delete(id: any): Promise<any> {
      return http.delete(`/user/${id}/`);
    }
  
    deleteAll(): Promise<any> {
      return http.delete(`/user/`);
    }
  
    findByTitle(title: string): Promise<any> {
      return http.get(`/user/?title=${title}`);
    }

    logIn(username: string, password: string): Promise<any> {
      return http.get(`/user/?username=${username}&password=${password}`); 
    }
  }
  
  export default new UserDataService();