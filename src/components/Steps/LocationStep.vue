<template>
  <div>
    <h3>Verfügbare Orte</h3>
    <el-select
      v-model="selectedLocationId"
      filterable
      allow-create
      default-first-option
      placeholder="Ort wählen"
      @change="handleLocationSelection"
    >
      <el-option
        v-for="location in locations"
        :key="location.id"
        :label="location.attributes.name"
        :value="location.id"
      />
    </el-select>

    <div v-if="isNewLocation">
      <el-form
        :model="newLocation"
        ref="newLocationFormRef"
        label-width="auto"
        label-position="top"
      >
        <el-form-item label="Name" prop="name">
          <el-input v-model="newLocation.attributes.name" />
        </el-form-item>
        <el-form-item label="Beschreibung" prop="description">
          <el-input
            v-model="newLocation.attributes.description"
            type="textarea"
          />
        </el-form-item>
        <el-form-item label="Strasse" prop="Adresse.street">
          <el-input v-model="newLocation.attributes.Adresse.street" />
        </el-form-item>
        <el-form-item label="PLZ" prop="Adresse.plz">
          <el-input v-model="newLocation.attributes.Adresse.plz" />
        </el-form-item>
        <el-form-item label="Stadt" prop="Adresse.city">
          <el-input v-model="newLocation.attributes.Adresse.city" />
        </el-form-item>
        <el-form-item label="Email" prop="email">
          <el-input v-model="newLocation.attributes.email" />
        </el-form-item>
      </el-form>
    </div>

    <el-button type="primary" @click="saveLocation">Speichern</el-button>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, defineEmits } from "vue";
import { ElMessage } from "element-plus";
import { fetchLocations } from "~/api/locations";
import { createLocation } from "~/api/createLocation";
import { Location } from "~/types/Location";

const emit = defineEmits(["updateLocation"]);

const selectedLocationId = ref<number | null>(null);
const locations = ref<Location[]>([]);
const isNewLocation = ref(false);
const newLocation = ref<Location>({
  id: 0,
  attributes: {
    name: "",
    description: "",
    Adresse: {
      street: "",
      city: "",
      plz: 0,
    },
    email: "",
  },
});

const saveLocation = async () => {
  // Code zum Speichern des neuen Ortes
  try {
    const response = await createLocation(newLocation.value);
    locations.value.push(response.data);
    selectedLocationId.value = response.data.id;
    isNewLocation.value = false;
    ElMessage.success("Ort erfolgreich erstellt!");
  } catch (error) {
    ElMessage.error("Fehler beim Erstellen des Ortes.");
    console.error("Error creating location:", error);
  }
};

const handleLocationSelection = (selectedLocationId: number) => {
  const selectedLocationObject = locations.value.find(
    (location) => location.id === selectedLocationId
  );
  emit("updateLocation", selectedLocationObject);
};

onMounted(async () => {
  try {
    const response = await fetchLocations();
    locations.value = response.data;
  } catch (error) {
    console.error("Error fetching locations:", error);
  }
});
</script>

<style scoped>
.upload-demo {
  /* Styles für Upload-Demo */
}
</style>
