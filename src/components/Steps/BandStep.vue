<template>
  <div>
    <h3>Verfügbare Bands</h3>
    <el-select
      v-model="selectedBandIds"
      multiple
      filterable
      allow-create
      default-first-option
      placeholder="Wähle Bands aus oder erstelle neue"
      @change="handleBandSelection"
    >
      <el-option
        v-for="band in bands"
        :key="band.id"
        :label="band.attributes.bandname"
        :value="band.id"
      />
    </el-select>

    <div v-if="isNewBand">
      <el-form :model="newBand" ref="newBandFormRef">
        <el-form-item label="Bandname" prop="bandname">
          <el-input v-model="newBand.attributes.bandname" />
        </el-form-item>
        <el-form-item label="Country" prop="country">
          <el-input v-model="newBand.attributes.country" />
        </el-form-item>
        <el-form-item label="Musicstyle" prop="musicstyle">
          <el-input v-model="newBand.attributes.musicstyle" />
        </el-form-item>
        <el-form-item label="Description" prop="description">
          <el-input v-model="newBand.attributes.description" type="textarea" />
        </el-form-item>
        <el-form-item label="Bandphoto" prop="bandphoto">
          <el-upload
            class="upload-demo"
            drag
            action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
            multiple
          >
            <el-icon><upload-filled /></el-icon>
            <div>Drop file here or <em>click to upload</em></div>
          </el-upload>
        </el-form-item>
      </el-form>
    </div>

    <el-button type="primary" @click="saveBand">Speichern</el-button>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, defineEmits } from "vue";
import { ElMessage } from "element-plus";
import { fetchBands } from "~/api/bands";
import { createBand } from "~/api/createBand";
import { Band } from "~/types/Band";

const emit = defineEmits(["updateBands"]);

const selectedBandIds = ref<number[]>([]);
const bands = ref<Band[]>([]);
const isNewBand = ref(false);
const newBand = ref<Band>({
  id: 0,
  attributes: {
    bandname: "",
    country: "",
    musicstyle: undefined,
    description: "",
    linklist: [],
    events: [],
    bandphoto: undefined,
  },
});

const saveBand = async () => {
  // Code zum Speichern der neuen Band
  try {
    const response = await createBand(newBand.value);
    bands.value.push(response.data);
    selectedBandIds.value.push(response.data.id);
    isNewBand.value = false;
    ElMessage.success("Band erfolgreich erstellt!");
  } catch (error) {
    ElMessage.error("Fehler beim Erstellen der Band.");
    console.error("Error creating band:", error);
  }
};

const handleBandSelection = (selectedBandIds: number[]) => {
  const selectedBandObjects = bands.value.filter((band) =>
    selectedBandIds.includes(band.id)
  );
  emit("updateBands", selectedBandObjects);
};

onMounted(async () => {
  try {
    const response = await fetchBands();
    bands.value = response.data;
  } catch (error) {
    console.error("Error fetching bands:", error);
  }
});
</script>

<style scoped>
.upload-demo {
  /* Styles für Upload-Demo */
}
</style>
