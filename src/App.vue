<script setup lang="ts">
import BaseFooter from './components/layouts/BaseFooter.vue';
</script>

<template>
  <el-config-provider namespace="ep">
    <BaseHeader />
    <div class="main-container">
      <router-view />
    </div>
    <BaseFooter />
  </el-config-provider>
</template>

<style>
#app {
  position: relative;
  min-height: 100vh;
  padding-bottom: 100px;
}

.main-container {
  margin-left: auto;
  margin-right: auto;
  padding-left: 24px;
  padding-right: 24px;
  max-width: 1200px;
}

footer {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 100px;
  text-align: center;
}
</style>
