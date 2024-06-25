<template>
  <el-drawer
    :model-value="localVisible"
    @update:model-value="updateVisible"
    :before-close="handleClose"
    size="50%"
    :title="formattedSelectedDay"
    custom-class="event-drawer"
  >
    <div v-for="event in events" :key="event.id" class="event-card">
      <el-card>
        <template #header>
          <div class="card-header">
            <el-row :gutter="20" style="text-align: left">
              <el-col :span="16"
                >{{ event.attributes.name }}
                <div class="grid-content ep-bg-purple"
              /></el-col>
              <el-col :span="8" style="text-align: right"
                ><el-tag>{{ event.attributes.type }}</el-tag>
                <div class="grid-content ep-bg-purple"
              /></el-col>
            </el-row>
          </div>
        </template>
        <div style="text-align: left">
          <p>
            <strong>Startzeitpunkt:</strong>
            {{ formatDateTime(event.attributes.eventstart) }}
            <el-tag type="primary" effect="plain" round>{{
              timeUntil(event.attributes.eventstart)
            }}</el-tag>
          </p>
          <p v-if="event.attributes.eventend">
            <strong>Endzeit:</strong>
            {{ formatDateTime(event.attributes.eventend) }}
          </p>
          <p>
            <strong>Ort:</strong>
            {{ event.attributes.location.data.attributes.name }}
          </p>
          <p v-if="event.attributes.bands.data[0]">
            <strong>Bands: </strong>
            <span v-for="band in event.attributes.bands.data" :key="band.id">{{
              band.attributes.bandname + "\n"
            }}</span>
          </p>
        </div>
      </el-card>
    </div>
  </el-drawer>
</template>

<script lang="ts" setup>
import { ref, watch, computed, PropType } from "vue";
import type { Event } from "../types/Event";

const props = defineProps({
  visible: Boolean,
  events: Array as PropType<Event[]>,
  selectedDay: String,
});

const emit = defineEmits(["update:visible"]);
const localVisible = ref(props.visible);

const updateVisible = (value: boolean) => {
  localVisible.value = value;
  emit("update:visible", value);
};

watch(
  () => props.visible,
  (newVal) => {
    localVisible.value = newVal;
  }
);

const handleClose = () => emit("update:visible", false);

const formattedSelectedDay = computed(() => {
  if (!props.selectedDay) return "";
  const date = new Date(props.selectedDay);
  return date.toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
});

const formatDateTime = (timestamp: string | number) => {
  const date = new Date(timestamp);
  return date.toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const timeUntil = (timestamp: string | number) => {
  const now = new Date();
  const eventDate = new Date(timestamp);
  const diff = eventDate.getTime() - now.getTime();
  const diffDays = Math.floor(diff / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor(
    (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const diffMinutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (diff < 0) {
    return "bereits vorbei";
  } else if (diffDays > 2) {
    return `in ${diffDays} Tagen`;
  } else if (diffDays === 1) {
    return `in 1 Tag und ${diffHours} Stunden`;
  } else if (diffDays === 0) {
    return `in ${diffHours} Stunden und ${diffMinutes} Minuten`;
  } else {
    const diffSeconds = Math.floor((diff % (1000 * 60)) / 1000);
    return `in ${String(diffHours).padStart(2, "0")}:${String(diffMinutes).padStart(2, "0")}:${String(diffSeconds).padStart(2, "0")}`;
  }
};
</script>

<style scoped>
.event-drawer {
  max-width: 600px;
}

.event-card {
  margin-bottom: 20px;
}
</style>
