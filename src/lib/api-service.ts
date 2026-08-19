/**
 * API Service layer for backend communication.
 * This is structured to be "backend ready" - you can replace the 
 * mock implementations with real fetch/axios calls once your server is live.
 */

export const apiService = {
  // Profile Related
  getProfile: async () => {
    await new Promise(resolve => setTimeout(resolve, 800)); // Simulate network lag
    return {
      name: "Kumar Neupane",
      email: "neupanekumar99@gmail.com",
      phone: "+977-98XXXXXXXX",
      avatar: "https://ui-avatars.com/api/?name=Kumar+Neupane&background=16A34A&color=fff&bold=true",
      memberSince: "Jan 2024",
      isPro: true
    };
  },

  updateProfile: async (data: any) => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    return { status: "success", data };
  },

  updateAvatar: async (file: File) => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    // In a real app, you'd upload this to a server/S3 and get back a URL
    return { success: true, url: URL.createObjectURL(file) };
  },

  // Address Related
  getAddresses: async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return [
      { id: 1, type: "Home", name: "Kumar Neupane", address: "Koteshwor-32", city: "Kathmandu", phone: "98XXXXXXXX", isDefault: true },
    ];
  },

  saveAddress: async (address: any) => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    return { success: true, data: { ...address, id: address.id || Math.floor(Math.random() * 1000) } };
  },

  deleteAddress: async (id: number) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { status: "success", id };
  }
};
