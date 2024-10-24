<script lang="ts" setup>
</script>

<template>
  <div>
    <el-footer style="padding: 20px 0; position: relative;">
      <el-divider />
      
      <!-- Footer Layout -->
      <div style="max-width: 1200px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; padding: 0 24px;">
        
        <!-- Text zentriert -->
        <div style="text-align: center; flex: 1;">
          <a href="https://strapi.io" target="_blank">Powered by <strong>Strapi</strong></a>
          <p>© 2024 - Punks for Autism e.V.</p>
        </div>
        
      </div>

      <!-- Logo horizontal zentriert unter dem Footer-Inhalt -->
      <div style="text-align: center; margin-top: 10px;">
        <img src="https://irp-cdn.multiscreensite.com/ff9270bb/dms3rep/multi/IMG_0112.GIF" alt="Logo" style="width: 100px;" />
      </div>
    </el-footer>
  </div>
</template>

<style>
el-footer {
  position: relative;
}
</style>
