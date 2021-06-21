import Logger from './logger';
import axios from 'axios';

const LOG = new Logger('axios.js');

const api = axios.create();

api.interceptors.request.use(
  (request) => {
    LOG.info(`Sending API Request to ${request.url}`);
    return request;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
