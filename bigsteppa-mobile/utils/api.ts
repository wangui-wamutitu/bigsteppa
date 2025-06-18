import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = "http://192.168.100.14:3000/api";

// Helper to get auth token
const getToken = async () => {
  return await AsyncStorage.getItem("token");
};

const fetchWithAuth = async (endpoint: string, options: RequestInit = {}) => {
  const token = await getToken();

  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });  
  

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));

    const fieldErrors = errorData.fieldErrors
      ? Object.values(errorData.fieldErrors).flat()
      : [];
    const formErrors = errorData.formErrors ?? [];
    const generalError = errorData.error;

    const combinedErrors = [...fieldErrors, ...formErrors];
    const errorMessage =
      combinedErrors.length > 0
        ? combinedErrors.join("\n")
        : generalError || "Something went wrong";

    throw new Error(errorMessage);
  }

  return response.json();
};

export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await fetchWithAuth("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    })
    
    await AsyncStorage.setItem("token", response.token)    
    return response;
  },

  signup: async (email: string, username: string, password: string) => {
    const response = await  fetchWithAuth("/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, username, password }),
    });
    await AsyncStorage.setItem("token", response.token)  
    return response;
  },

  logout: async () => {
    await AsyncStorage.removeItem("token");
  },

  resetPassword: async (email: string) => {
    return fetchWithAuth("/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  },
};

export const challengeAPI = {
  getAllChallenges: async () => {
    return fetchWithAuth("/challenges");
  },

  getChallengeById: async (id: string) => {
    return fetchWithAuth(`/challenges/${id}`);
  },

  createChallenge: async (challengeData: any) => {
    return fetchWithAuth("/challenges", {
      method: "POST",
      body: JSON.stringify(challengeData),
    });
  },

  updateChallenge: async (id: string, updateData: any) => {
    return fetchWithAuth(`/challenges/${id}`, {
      method: "PATCH",
      body: JSON.stringify(updateData),
    });
  },

  deleteChallenge: async (id: string) => {
    return fetchWithAuth(`/challenges/${id}`, {
      method: "DELETE",
    });
  },

  addChallengeLog: async (challengeId: string, logData: any) => {
    return fetchWithAuth(`/challenges/${challengeId}/logs`, {
      method: "POST",
      body: JSON.stringify(logData),
    });
  },
};

export const userAPI = {
  getProfile: async () => {
    return fetchWithAuth("/users/profile");
  },

  updateProfile: async (userData: any) => {
    return fetchWithAuth("/users/profile", {
      method: "PATCH",
      body: JSON.stringify(userData),
    });
  },

  deleteAccount: async () => {
    return fetchWithAuth("/users/account", {
      method: "DELETE",
    });
  },
};
