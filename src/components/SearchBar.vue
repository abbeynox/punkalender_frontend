<template>
  <div>
    <el-input
      v-model="searchTerm"
      style="width: 100%"
      size="large"
      placeholder="Nach Events suchen..."
      :suffix-icon="Search"
      @input="emitSearch"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref, defineEmits } from "vue";
import { Search } from "@element-plus/icons-vue";

const searchTerm = ref("");
const emit = defineEmits(["search"]);

const emitSearch = () => {
  emit("search", searchTerm.value);
};
</script>

<style scoped></style>
