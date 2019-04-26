import axios from "axios";

class Api {
  constructor(basePath) {
    this.basePath = basePath;
    this.req = axios.create({
      baseURL: basePath
    });
  }

  async getCompany(companyName) {
    return this.req.get(`/company/${companyName}`).then(res => res.data);
  }

  async getCompanies() {
    return this.req.get(`/companies`).then(res => res.data);
  }

  async getWorkEntries(companyName) {
    return this.req
      .get(`/company/${companyName}/workEntries`)
      .then(res => res.data);
  }
}

export default async ({ Vue }) => {
  Vue.prototype.$api = new Api("http://localhost:3001");
};