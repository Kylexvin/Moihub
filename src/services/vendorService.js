// src/services/vendorService.js
import axios from 'axios';
import { eshopService } from './eshopService';
import { foodService } from './foodService';

const API_URL = 'https://moihub.onrender.com/api';

export const getCategories = async () => {
  try {
    const response = await axios.get(`${API_URL}/eshop/vendor/dropdown`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: error.message };
  }
};

export const checkVendorStatus = async () => {
  try {
    // Try eshop first
    try {
      const response = await eshopService.checkStatus();
      if (response.isEshopVendor) {
        return {
          isVendor: true,
          vendorType: 'eshop',
          status: response.status,
          shopName: response.shop?.shopName,
          slug: response.shop?.slug,
          subscriptionEndDate: response.subscriptionEndDate,
          isApproved: response.isApproved
        };
      }
    } catch (e) {
      // Not eshop, try food
    }

    // Try food vendor
    try {
      const response = await foodService.checkStatus();
      // Food returns: { isVendor: true, isApproved: true, shopName: "Test", ... }
      if (response.isVendor) {
        return {
          isVendor: true,
          vendorType: 'food',
          status: response.status || (response.isApproved ? 'approved' : 'pending'),
          shopName: response.shopName,
          slug: response.slug || response.shopName?.toLowerCase().replace(/\s+/g, '-'),
          subscriptionEndDate: response.subscriptionEndDate,
          isApproved: response.isApproved,
          phone: response.phone,
          location: response.location
        };
      }
    } catch (foodError) {
      // Not a food vendor
      console.log('Food status check failed:', foodError);
    }

    return { isVendor: false, status: 'none' };
  } catch (error) {
    console.error('Error checking vendor status:', error);
    return { isVendor: false, status: 'none' };
  }
};

export const applyForVendor = async (formData) => {
  try {
    const vendorType = formData.get('vendorType');
    
    if (vendorType === 'eshop') {
      const data = {
        shopName: formData.get('shopName'),
        category: formData.get('category'),
        description: formData.get('description'),
        address: formData.get('address'),
        phoneNumber: formData.get('phoneNumber')
      };
      return await eshopService.applyForVendor(data);
    } else {
      const data = {
        shopName: formData.get('shopName'),
        phone: formData.get('phone'),
        location: formData.get('location')
      };
      return await foodService.registerVendor(data);
    }
  } catch (error) {
    throw error.response?.data || { message: error.message };
  }
};

export { eshopService, foodService };