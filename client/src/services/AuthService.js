import userApi from "../http";

export default class AuthService {
  static async login(username, password) {
    return userApi.post("/login", { username, password });
  }

  static async registration(username, password) {
    return userApi.post("/registration", { username, password });
  }

  static async logout() {
    return userApi.post("/logout");
  }
}
