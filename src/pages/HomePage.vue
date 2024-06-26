<template>
  <div>
    <EventList />
    <el-calendar v-model="value">
      <template #date-cell="{ data }">
        <div
          :class="{ 'is-selected': data.isSelected }"
          @dblclick="handleDateCellDblClick(data.day, $event)"
          @click="handleDayClick(data.day, $event)"
        >
          <p>{{ data.day.split("-").slice(2).join("-") }}</p>
          <div v-if="getEventsForDay(data.day).length > 0">
            <el-tooltip
              v-if="getEventsForDay(data.day).length === 1"
              :content="getEventsForDay(data.day)[0].attributes.name"
              placement="bottom"
            >
              <el-tag type="primary">
                {{
                  truncateTitle(
                    getEventsForDay(data.day)[0].attributes.name,
                    15
                  )
                }}
              </el-tag>
            </el-tooltip>
            <el-tag v-else type="primary">
              {{ getEventsForDay(data.day).length }} Events
            </el-tag>
          </div>
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
let clickTimeout: number | undefined;

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

const handleDateCellDblClick = (day: string, event: MouseEvent) => {
  event.stopPropagation();
  clearTimeout(clickTimeout);
  clickTimeout = undefined;
  const date = new Date(day);
  date.setHours(20, 0, 0);
  router
    .push({
      path: "create",
      query: { startDate: date.toISOString() },
    })
    .catch((err) => console.error(err));
};

const handleDayClick = (day: string, event: MouseEvent) => {
  if (clickTimeout !== undefined) {
    clearTimeout(clickTimeout);
    clickTimeout = undefined;
    return;
  }
  clickTimeout = window.setTimeout(() => {
    selectedDay.value = day;
    drawerVisible.value = true;
    clickTimeout = undefined;
  }, 200);
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
