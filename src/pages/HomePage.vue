<template>
  <div>
    <EventList />
    <el-calendar v-model="value">
      <template #date-cell="{ data }">
        <div
          :class="{ 'is-selected': data.isSelected }"
          @dblclick="handleDateCellDblClick(data.day)"
          @click="handleDayClick(data.day)"
        >
          <p>{{ data.day.split("-").slice(2).join("-") }}</p>
          <el-tooltip
            v-for="event in getEventsForDay(data.day)"
            :key="event.id"
            :content="event.attributes.name"
            placement="bottom"
            effect="light"
          >
            <el-tag type="primary">
              {{ truncateTitle(event.attributes.name, 15) }}
            </el-tag>
          </el-tooltip>
        </div>
      </template>
    </el-calendar>

    <EventDrawer
      :visible="drawerVisible"
      @update:visible="drawerVisible = $event"
      :events="eventsForSelectedDay"
      :selectedDay="selectedDay"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import EventList from "@/components/EventList.vue";
import EventDrawer from "@/components/EventDrawer.vue";
import { fetchEvents } from "../api/events";
import { Event } from "../types/Event";

const value = ref(new Date());
const events = ref<Event[]>([]);
const error = ref<string | null>(null);
const drawerVisible = ref(false);
const selectedDay = ref<string | null>(null);
const router = useRouter();

onMounted(async () => {
  try {
    const response = await fetchEvents(
      undefined,
      undefined,
      undefined,
      undefined,
      "*"
    );
    events.value = response.data;
  } catch (err) {
    error.value = (err as Error).message;
  }
});

const getEventsForDay = (day: string) => {
  const date = new Date(day);
  return events.value.filter((event) => {
    const eventStart = new Date(event.attributes.eventstart);
    return (
      eventStart.getFullYear() === date.getFullYear() &&
      eventStart.getMonth() === date.getMonth() &&
      eventStart.getDate() === date.getDate()
    );
  });
};

const eventsForSelectedDay = computed(() => {
  return selectedDay.value ? getEventsForDay(selectedDay.value) : [];
});

const handleDateCellDblClick = (day: string) => {
  const date = new Date(day);
  date.setHours(20, 0, 0);
  router.push({
    path: "/create",
    query: { startDate: date.toISOString() },
  });
};

const handleDayClick = (day: string) => {
  selectedDay.value = day;
  drawerVisible.value = true;
};

const truncateTitle = (title: string, length: number) => {
  return title.length > length ? title.slice(0, length) + "..." : title;
};
</script>

<style>
.is-selected {
  color: #1989fa;
}
</style>
