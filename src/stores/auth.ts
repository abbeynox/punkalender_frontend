import { defineStore } from "pinia";
import axios from "axios";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    jwt: localStorage.getItem("jwt") || "",
    user: JSON.parse(localStorage.getItem("user") || "{}"),
  }),
  actions: {
    login(jwt: string, user: any) {
      this.jwt = jwt;
      this.user = user;
      localStorage.setItem("jwt", jwt);
      localStorage.setItem("user", JSON.stringify(user));
    },
    logout() {
      this.jwt = "";
      this.user = {};
      localStorage.removeItem("jwt");
      localStorage.removeItem("user");
    },
    async validateToken() {
      if (!this.jwt) return false;
      try {
        const response = await axios.get("/api/validate-token", {
          headers: {
            Authorization: `Bearer ${this.jwt}`,
          },
        });
        return response.data.valid;
      } catch (error) {
        this.logout();
        return false;
      }
    },
  },
  getters: {
    isAuthenticated: (state) => !!state.jwt,
  },
});
