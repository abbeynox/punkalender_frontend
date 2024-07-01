<template>
  <div :class="['form-container', { 'swipe-up': loginSuccess }]">
    <h1>Login</h1>
    <el-form
      ref="loginFormRef"
      :model="loginForm"
      label-width="auto"
      label-position="top"
      class="demo-loginForm"
      size="large"
      status-icon
    >
      <el-form-item label="Benutzername" prop="identifier">
        <el-input ref="identifier" v-model="loginForm.identifier" />
      </el-form-item>

      <el-form-item label="Passwort" prop="password">
        <el-input
          type="password"
          autocomplete="off"
          v-model="loginForm.password"
          @keyup.enter="submitLoginForm"
        />
      </el-form-item>

      <el-button type="primary" :loading="loading" @click="submitLoginForm">
        <template #loading>
          <div class="custom-loading">
            <svg class="circular" viewBox="-10, -10, 50, 50">
              <path
                class="path"
                d="
                    M 30 15
                    L 28 17
                    M 25.61 25.61
                    A 15 15, 0, 0, 1, 15 30
                    A 15 15, 0, 1, 1, 27.99 7.5
                    L 15 15
                  "
                style="stroke-width: 4px; fill: rgba(0, 0, 0, 0)"
              />
            </svg>
          </div>
        </template>
        Login
      </el-button>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { login, LoginPayload } from "../api/login";
import { useAuthStore } from "../stores/auth";
import { ElMessage } from "element-plus";
import type { FormInstance } from "element-plus";

interface LoginForm {
  identifier: string;
  password: string;
}

const router = useRouter();
const authStore = useAuthStore();
const loginFormRef = ref<FormInstance>();
const loginForm = reactive<LoginForm>({
  identifier: "",
  password: "",
});
const loading = ref(false);
const loginSuccess = ref(false);

const submitLoginForm = async () => {
  loading.value = true;
  try {
    const payload: LoginPayload = {
      identifier: loginForm.identifier,
      password: loginForm.password,
    };
    const { jwt, user } = await login(payload);
    authStore.login(jwt, user);
    loginSuccess.value = true;
    setTimeout(() => {
      router.push({ name: "Home" });
    }, 400); // Reduzierte Wartezeit für schnelles Ausblenden
  } catch (error: any) {
    console.error("Login failed:", error.message);
    ElMessage.error("Benutzername oder Passwort ist falsch!");
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.form-container {
  width: 100%;
  padding: 0 15px;
  box-sizing: border-box;
  transition:
    transform 0.4s ease-in-out,
    opacity 0.4s ease-in-out; /* Schnellere und geschmeidigere Animation */
}

.form-container.swipe-up {
  transform: translateY(-100%);
  opacity: 0; /* Form smooth ausblenden */
}

.custom-loading {
  display: flex;
  align-items: center;
  justify-content: center;
}

.circular {
  animation: rotate 2s linear infinite;
}

.path {
  stroke: #409eff;
  stroke-dasharray: 1, 200;
  stroke-dashoffset: 0;
  animation: dash 1.5s ease-in-out infinite;
}

@keyframes rotate {
  100% {
    transform: rotate(360deg);
  }
}

@keyframes dash {
  0% {
    stroke-dasharray: 1, 200;
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dasharray: 89, 200;
    stroke-dashoffset: -35px;
  }
  100% {
    stroke-dasharray: 89, 200;
    stroke-dashoffset: -124px;
  }
}
</style>
