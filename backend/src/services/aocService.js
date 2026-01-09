const axios = require('axios');
require('dotenv').config();

const AOC_BASE_URL = process.env.AOC_PORTAL_BASE_URL;

const getClient = (apiKey) => {
  return axios.create({
    baseURL: AOC_BASE_URL,
    headers: {
      'apikey': apiKey,
      'Content-Type': 'application/json'
    }
  });
};

const getTemplates = async (apiKey) => {
  try {
    const client = getClient(apiKey);
    const response = await client.post('/v1/whatsapp/waTemplateList', {});
    return response.data;
  } catch (error) {
    console.error('Error fetching templates:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      headers: error.response?.headers,
      message: error.message
    });
    throw error;
  }
};

const createTemplate = async (apiKey, templateData) => {
  try {
    const client = getClient(apiKey);
    const response = await client.post('/v1/whatsapp/createWaTemplate', templateData);
    return response.data;
  } catch (error) {
    console.error('Error creating template:', error.response?.data || error.message);
    throw error;
  }
};

const sendMessage = async (apiKey, messageData) => {
  try {
    const client = getClient(apiKey);
    const response = await client.post('/v1/whatsapp', messageData);
    return response.data;
  } catch (error) {
    console.error('Error sending message:', error.response?.data || error.message);
    throw error;
  }
};

module.exports = {
  getTemplates,
  createTemplate,
  sendMessage
};
