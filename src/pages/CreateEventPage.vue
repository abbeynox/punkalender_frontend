<template>
  <h1>{{ ruleForm.name || "Neues Event" }} planen</h1>
  <div class="form-container">
    <el-form
      ref="ruleFormRef"
      :model="ruleForm"
      :rules="rules"
      label-width="auto"
      label-position="top"
      class="demo-ruleForm"
      size="large"
      status-icon
      style="width: 100%"
    >
      <!-- Form Items -->
      <el-form-item label="Name" prop="name">
        <el-input
          v-model="ruleForm.name"
          show-word-limit
          maxlength="40"
          style="width: 100%"
        />
      </el-form-item>
      <el-form-item label="Kategorie" prop="type">
        <el-segmented
          v-model="ruleForm.type"
          :options="eventTypeOptions"
          style="width: 100%"
        />
      </el-form-item>
      <el-form-item label="Beschreibung" prop="eventtext">
        <el-input
          v-model="ruleForm.eventtext"
          type="textarea"
          style="width: 100%"
        />
      </el-form-item>
      <el-form-item label="Startzeit" prop="eventstart">
        <el-date-picker
          v-model="ruleForm.eventstart"
          format="DD.MM.YYYY HH:mm"
          type="datetime"
          placeholder="Wähle ein Startzeitpunkt"
          style="width: 100%"
          :default-time="defaultTime"
          value-format="x"
        />
      </el-form-item>
      <el-form-item label="Endzeit" prop="eventend">
        <el-date-picker
          v-model="ruleForm.eventend"
          format="DD.MM.YYYY HH:mm"
          type="datetime"
          placeholder="Wähle ein Endzeitpunkt"
          style="width: 100%"
          :default-time="defaultTime"
          value-format="x"
        />
      </el-form-item>
      <el-form-item label="Bands" prop="bands">
        <el-select
          v-model="ruleForm.bands"
          multiple
          filterable
          placeholder="Wähle Bands aus"
          style="width: 100%"
        >
          <el-option
            v-for="band in bands"
            :key="band.id"
            :label="band.attributes.bandname"
            :value="band.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="Ort" prop="location">
        <el-select
          v-model="ruleForm.location"
          filterable
          placeholder="Wähle einen Ort aus"
          style="width: 100%"
        >
          <el-option
            v-for="location in locations"
            :key="location.id"
            :label="location.attributes.name"
            :value="location.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="Ticket Typ" prop="ticket.type">
        <el-segmented
          v-model="ruleForm.ticket.type"
          :options="ticketTypeOptions"
          @change="handleTicketTypeChange"
          style="width: 100%"
        />
      </el-form-item>
      <el-form-item
        v-if="ruleForm.ticket.type !== 'Kostenlos'"
        label="Ticket Link"
        prop="ticket.ticketlink"
      >
        <el-input v-model="ruleForm.ticket.ticketlink" style="width: 100%" />
      </el-form-item>
      <el-form-item
        v-if="ruleForm.ticket.type !== 'Kostenlos'"
        :label="
          ruleForm.ticket.type === 'Kollekte'
            ? 'Richtpreis (CHF)'
            : 'Eintrittspreis (CHF)'
        "
        prop="ticket.chf"
      >
        <el-input-number
          v-model="ruleForm.ticket.chf"
          :min="1"
          :max="999"
          :precision="2"
          style="width: 100%"
        />
      </el-form-item>

      <el-form-item>
        <el-button
          style="width: 100%"
          type="primary"
          @click="submitForm(ruleFormRef)"
          >Planen</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { createEvent, CreateEventPayload } from "../api/createEvent";
import { fetchBands } from "../api/bands";
import { fetchLocations } from "../api/locations";
import { ElMessage } from "element-plus";
import type { ComponentSize, FormInstance, FormRules } from "element-plus";
import type { Band } from "~/types/Band";
import type { Location } from "~/types/Location";

interface RuleForm {
  name: string;
  type: string;
  eventtext: string;
  eventstart: number;
  eventend: number;
  bands: number[];
  location: number;
  ticket: {
    id: number;
    type: string;
    ticketlink: string;
    chf: number;
  };
}

const route = useRoute();

const ruleFormRef = ref<FormInstance>();
const ruleForm = reactive<RuleForm>({
  name: "",
  type: "Concert",
  eventtext: "",
  eventstart: route.query.startDate
    ? new Date(route.query.startDate as string).getTime()
    : new Date(new Date().setHours(20, 0, 0)).getTime(), // Standardmäßig 20:00 Uhr
  eventend: 0,
  bands: [],
  location: null,
  ticket: {
    id: 0,
    type: "Kostenlos",
    ticketlink: "",
    chf: 0,
  },
});

const defaultTime = new Date(2000, 1, 1, 20, 0, 0);

const selectedMusicStyles = ref<string[]>([]);

const bands = ref<Band[]>([]);
const locations = ref<Location[]>([]);

const eventTypeOptions = [
  { label: "Konzert", value: "Concert" },
  { label: "Festival", value: "Festival" },
  { label: "Treff", value: "Treff" },
  { label: "Andere", value: "Andere" },
];

const ticketTypeOptions = [
  { label: "Kostenlos", value: "Kostenlos" },
  { label: "Kollekte", value: "Kollekte" },
  { label: "Eintrittspreis", value: "Eintrittspreis" },
];

const rules = reactive<FormRules<RuleForm>>({
  name: [
    { required: true, message: "Gib einen Eventnamen an", trigger: "blur" },
  ],
  type: [
    { required: true, message: "Wähle eine Kategorie aus", trigger: "blur" },
  ],
  eventstart: [
    {
      required: true,
      message: "Lege ein Startzeitpunkt fest",
      trigger: "change",
    },
  ],
  bands: [
    {
      required: false,
      message: "Wähle mindestens eine Band aus",
      trigger: "change",
    },
  ],
  location: [
    { required: true, message: "Wähle einen Ort aus", trigger: "change" },
  ],
  "ticket.type": [
    { required: true, message: "Gebe einen Ticket Typ an", trigger: "blur" },
  ],
  "ticket.chf": [
    {
      required: false,
      message: "Gebe einen gültigen Preis (in CHF) an",
      trigger: "blur",
    },
  ],
});

const loadBandsAndLocations = async () => {
  try {
    const bandsResponse = await fetchBands();
    const locationsResponse = await fetchLocations();
    bands.value = bandsResponse.data;
    locations.value = locationsResponse.data;
  } catch (error) {
    console.error("Error loading bands and locations:", error);
  }
};

onMounted(loadBandsAndLocations);

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      try {
        const musicstyle = {
          id: 0,
          Punk: selectedMusicStyles.value.includes("Punk"),
          Metal: selectedMusicStyles.value.includes("Metal"),
          Rock: selectedMusicStyles.value.includes("Rock"),
          Ska: selectedMusicStyles.value.includes("Ska"),
        };
        const payload: CreateEventPayload = {
          data: {
            name: ruleForm.name,
            type: ruleForm.type,
            musicstyle,
            eventtext: ruleForm.eventtext,
            eventstart: ruleForm.eventstart,
            eventend: ruleForm.eventend,
            bands: ruleForm.bands,
            location: ruleForm.location,
            ticket: ruleForm.ticket,
          },
        };

        console.log(payload);

        const response = await createEvent(payload);
        ElMessage({
          showClose: true,
          message: "Event erfolgreich erstellt!",
          type: "success",
        });
        console.log("Event created:", response);
        resetForm(formEl);
      } catch (error) {
        ElMessage({
          showClose: true,
          message: "Fehler beim Erstellen des Events!",
          type: "error",
        });
        console.error("Error creating event:", error);
      }
    } else {
      console.log("error submit!", fields);
    }
  });
};

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
  selectedMusicStyles.value = [];
};

const handleTicketTypeChange = () => {
  if (ruleForm.ticket.type === "Kostenlos") {
    ruleForm.ticket.ticketlink = "";
    ruleForm.ticket.chf = 0;
  }
};
</script>

<style scoped>
.form-container {
  width: 100%;
  padding: 0 15px;
  box-sizing: border-box;
}
</style>
