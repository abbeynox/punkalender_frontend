<template>
  <h1>Neue Band Erstellen</h1>
  <div class="form-container">
    <el-form
      ref="bandFormRef"
      :model="bandForm"
      :rules="bandRules"
      label-width="auto"
      label-position="top"
      class="demo-bandForm"
      size="large"
      status-icon
      @keyup.enter.native="focusNextField"
    >
      <el-form-item label="Bandname" prop="bandname">
        <el-input
          v-model="bandForm.bandname"
          show-word-limit
          maxlength="40"
          ref="bandname"
        />
      </el-form-item>
      <el-form-item label="herkunft" prop="country">
        <el-input v-model="bandForm.country" ref="country" />
      </el-form-item>
      <el-form-item label="Beschreibung" prop="description">
        <el-input
          v-model="bandForm.description"
          type="textarea"
          ref="description"
        />
      </el-form-item>
      <el-form-item label="Musikstile" prop="musicstyle">
        <el-checkbox-group v-model="selectedMusicStyles" ref="musicstyle">
          <el-checkbox label="Punk">Punk</el-checkbox>
          <el-checkbox label="Metal">Metal</el-checkbox>
          <el-checkbox label="Rock">Rock</el-checkbox>
          <el-checkbox label="Ska">Ska</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitBandForm(bandFormRef)"
          >Erstellen</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from "vue";
import { createBand, CreateBandPayload } from "../api/createBand";
import { ElMessage } from "element-plus";
import type { FormInstance, FormRules } from "element-plus";

interface BandForm {
  bandname: string;
  country: string;
  description: string;
  musicstyle: {
    id: number;
    Punk: boolean;
    Metal: boolean;
    Rock: boolean;
    Ska: boolean;
  };
}

const bandFormRef = ref<FormInstance>();
const bandForm = reactive<BandForm>({
  bandname: "",
  country: "",
  description: "",
  musicstyle: {
    id: 0,
    Punk: false,
    Metal: false,
    Rock: false,
    Ska: false,
  },
});

const selectedMusicStyles = ref<string[]>([]);

const bandRules = reactive<FormRules<BandForm>>({
  bandname: [
    { required: true, message: "Bitte Bandname eingeben", trigger: "blur" },
  ],
  country: [
    { required: true, message: "Bitte Land eingeben", trigger: "blur" },
  ],
  description: [
    { required: true, message: "Bitte Beschreibung eingeben", trigger: "blur" },
  ],
});

const focusNextField = (event: KeyboardEvent) => {
  const fields = ["bandname", "country", "description", "musicstyle"];
  const currentIndex = fields.indexOf(event.target["name"]);
  if (currentIndex >= 0 && currentIndex < fields.length - 1) {
    const nextField = fields[currentIndex + 1];
    bandFormRef.value?.$refs[nextField].focus();
  } else if (currentIndex === fields.length - 1) {
    submitBandForm(bandFormRef.value);
  }
};

const submitBandForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(async (valid) => {
    if (valid) {
      try {
        const musicstyle = {
          id: 0,
          Punk: selectedMusicStyles.value.includes("Punk"),
          Metal: selectedMusicStyles.value.includes("Metal"),
          Rock: selectedMusicStyles.value.includes("Rock"),
          Ska: selectedMusicStyles.value.includes("Ska"),
        };
        const payload: CreateBandPayload = {
          data: {
            bandname: bandForm.bandname,
            country: bandForm.country,
            description: bandForm.description,
            musicstyle,
            bandphoto: "", // Placeholder, adjust as needed
            linklist: [], // Placeholder, adjust as needed
            events: [], // Placeholder, adjust as needed
          },
        };
        const response = await createBand(payload);
        ElMessage({
          showClose: true,
          message: "Band erfolgreich erstellt!",
          type: "success",
        });
        formEl.resetFields();
        selectedMusicStyles.value = [];
      } catch (error) {
        ElMessage({
          showClose: true,
          message: "Fehler beim Erstellen der Band!",
          type: "error",
        });
      }
    }
  });
};
</script>

<style scoped>
.form-container {
  width: 100%;
  padding: 0 15px;
  box-sizing: border-box;
}
</style>
