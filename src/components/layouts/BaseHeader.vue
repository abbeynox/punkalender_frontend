<script lang="ts" setup>
import { toggleDark } from "~/composables";
import { useAuthStore } from "~/stores/auth";
import { computed } from "vue";

const authStore = useAuthStore();
const isLoggedIn = computed(() => authStore.isAuthenticated);
</script>

<template>
  <el-menu class="el-menu-demo" mode="horizontal">
    <router-link style="text-decoration: none" to="/">
      <el-menu-item index="1"> Pun<b>kalender</b> </el-menu-item>
    </router-link>

    <el-sub-menu v-if="isLoggedIn" index="2">
      <template #title>Erstellen</template>
      <router-link style="text-decoration: none" to="/create/event">
        <el-menu-item index="2-1">Event</el-menu-item>
      </router-link>
      <router-link style="text-decoration: none" to="/create/band">
        <el-menu-item index="2-2">Band</el-menu-item>
      </router-link>
      <router-link style="text-decoration: none" to="/create/location">
        <el-menu-item index="2-3">Ort</el-menu-item>
      </router-link>
    </el-sub-menu>

    <router-link style="text-decoration: none" to="/about">
      <el-menu-item index="3">Über</el-menu-item>
    </router-link>
    <el-menu-item h="full" @click="toggleDark()">
      <button
        class="border-none w-full bg-transparent cursor-pointer"
        style="height: var(--ep-menu-item-height)"
      >
        <i inline-flex i="dark:ep-moon ep-sunny" />
      </button>
    </el-menu-item>
    <el-menu-item v-if="!isLoggedIn">
      <router-link style="text-decoration: none" to="/login">
        <el-button plain style="max-width: 15px">Login</el-button>
      </router-link>
    </el-menu-item>

    <el-menu-item v-if="isLoggedIn">
      <el-button plain @click="authStore.logout()" style="max-width: 15px"
        >Logout</el-button
      >
    </el-menu-item>
  </el-menu>
</template>
