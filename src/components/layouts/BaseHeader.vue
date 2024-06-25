<script lang="ts" setup>
import { toggleDark } from "~/composables";
</script>

<template>
  <el-menu class="el-menu-demo" mode="horizontal">
    <router-link style="text-decoration: none" to="/"
      ><el-menu-item index="1"
        >Pun<b>kalender</b
        ><el-tag class="ml-2" type="success">v0.1</el-tag></el-menu-item
      ></router-link
    >
    <router-link style="text-decoration: none" to="/create/event"
      ><el-menu-item index="2">Neu erstellen</el-menu-item></router-link
    >I
    <router-link style="text-decoration: none" to="/about"
      ><el-menu-item index="3">Über</el-menu-item></router-link
    >
    <el-menu-item h="full" @click="toggleDark()">
      <button
        class="border-none w-full bg-transparent cursor-pointer"
        style="height: var(--ep-menu-item-height)"
      >
        <i inline-flex i="dark:ep-moon ep-sunny" />
      </button>
    </el-menu-item>
  </el-menu>
</template>
