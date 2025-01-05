import axios from "axios";
import { EventSchema } from "../schema/event";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

type RegisterParams = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: number; 
};

const apiService = {
  login: async (email: string, password: string, role: number) => {
    const response = await axios.post(`${API_URL}/users/login`, { email, password, role });
    return response.data.loggedUser;
  },
  register: async (email: string, password: string, firstName: string, lastName: string, role?: number ) => {
   
    const response = await axios.post(`${API_URL}/users/register`, {
      email,
      password,
      firstName,
      lastName,
      role: role ? role : 2
    });
    return response.data;
  },

  deleteUser: async (token: string, userId: number) => {

    const response = await axios.delete(`${API_URL}/admin/${userId}/delete`, {
      headers: { Authorization: `Bearer ${token}`},
  })
    return response.data
      },
  createEvent: async (eventData: EventSchema, token: string) => {
    const response = await axios.post(`${API_URL}/events/create`, eventData, {
      headers: { Authorization: `Bearer ${token}` },
    });
 

    return response.data;
  },
  getEvents: async (token?:string, page?:string, limit?:string, ) => {
    
    let response;
    if(token){
   
      response = await axios.get(`${API_URL}/events/read`,{
    
        headers: { Authorization: `Bearer ${token}` },
      });

      return response.data;
    }
    response  = await axios.get(`${API_URL}/events/read?page=${page}&limit=${limit}&sortBy=date&sortOrder=ASC`)
  
    return response.data
  },

  getSignedUpEvents: async ( token: string, eventId?:number) => {
  
    const response = await axios.get(`${API_URL}/events/${eventId}/list`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.data;
  },

  getEvent: async (eventId: number) => {
const response = await axios.get(`${API_URL}/events/${eventId}/event`)

return response.data
  },
  deleteEvent: async (token: string, eventId: number) => {
    const response = await axios.delete(`${API_URL}/events/${eventId}/delete`, {
      headers: { Authorization: `Bearer ${token}` }
  })
    
    return response.data
      },
googleAuth: async () => {

  window.location.href = `${API_URL}/auth/google`;
},
googleCalendar: async (eventId: number, redirectUri:string) => {
  window.location.href = `${API_URL}/events/auth/google/calender?event=${eventId}&redirecturi=${redirectUri}`;
},

  signUpForEvent: async (eventId: number, token: string, flag: boolean) => {
    const response = await axios.post(`${API_URL}/events/${eventId}/signup`, {flag: flag}, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },
  
  loginAdmin: async (email: string, password: string) => {
    const response = await axios.post(`${API_URL}/admin/login`, { email, password });
    return response.data;
  },
  registerAdmin: async ({ email, password, firstName, lastName, role }: RegisterParams, token: string) => {
    const response = await axios.post(`${API_URL}/admin/register`, {
      email,
      password,
      firstName,
      lastName,
      role,
    }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },
  listUsers: async (token: string, role?: number ) => {
    let response;
  role? response =  response = await axios.get(`${API_URL}/admin/${role}/list`, {
    headers: { Authorization: `Bearer ${token}` },
  }): 
     response = await axios.get(`${API_URL}/admin/list`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.data;
  },
  updateAdmin: async (adminId: number, adminData: any, token: string) => {
    const response = await axios.put(`${API_URL}/admin/${adminId}/update`, adminData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

   superAdminRegister :async (
    { email, password, firstName, lastName, role }: RegisterParams, 
    token: string
  ): Promise<any> => {
    try {
      const response = await axios.post(
        `${API_URL}/super-admin/register`,
        {
          email,
          password,
          firstName,
          lastName,
          role,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error: any) {
  
      throw error.response?.data || error.message; 
    }
  },
  
  superAdminLogin: async (email: string, password: string) => {
    const response = await axios.post(`${API_URL}/super-admin/login`, { email, password });
    return response.data.loggedSuperAdmin;
  },
  superAdminList: async (role: number, token: string) => {
    const response = await axios.get(`${API_URL}/super-admin/${role}/list`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },
  superAdminDelete: async (token: string,id: number,) => {
    const response = await axios.delete(`${API_URL}/super-admin/${id}/delete`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },
  getAllUsers: async (token: string) => {
    const response = await axios.get(`${API_URL}/super-admin/list`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },
};

export default apiService;
