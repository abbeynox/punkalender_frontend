<template>
  <div>
    <h1>Nächste Events</h1>
    <p>{{ displayedEvents.length }} Events gefunden</p>
    <el-row>
      <el-col class="grid-content mt-5 mb-5" :span="24">
        <div class="filter-container">
          <el-col :span="16">
            <SearchBar @search="handleSearch" />
          </el-col>
          <el-col :span="8">
            <el-date-picker
              v-model="selectedDate"
              type="date"
              placeholder="Wähle ein Datum"
              :shortcuts="dateShortcuts"
              @change="handleDateChange"
              size="large"
              style="width: 100%"
            />
          </el-col>
        </div>
      </el-col>
    </el-row>
    <div
      v-infinite-scroll="loadMoreEvents"
      infinite-scroll-disabled="loading"
      infinite-scroll-distance="10"
    >
      <el-row :gutter="20">
        <el-col
          v-for="event in displayedEvents"
          :key="event.id"
          :xs="24"
          :sm="12"
          :md="8"
        >
          <el-card class="event-card" :body-style="{ padding: '20px' }">
            <h3>{{ event.attributes.name }}</h3>
            <p>
              <strong>Datum:</strong>
              {{ formatEventDate(event.attributes.eventstart) }}
            </p>
            <p>
              <strong>Ort:</strong>
              {{ event.attributes.location.data.attributes.name }}
            </p>
            <el-button type="primary" @click="openEvent(event)"
              >Details</el-button
            >
          </el-card>
        </el-col>
      </el-row>
    </div>
    <div v-if="error">{{ error }}</div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import { fetchEvents } from "../api/events";
import { Event } from "../types/Event";
import SearchBar from "@/components/SearchBar.vue";

export default defineComponent({
  name: "EventList",
  components: { SearchBar },
  setup() {
    const events = ref<Event[]>([]);
    const displayedEvents = ref<Event[]>([]);
    const error = ref<string | null>(null);
    const page = ref(1);
    const pageSize = ref(9); // 3 rows per load
    const loading = ref(false);
    const selectedDate = ref<Date | null>(null);

    const dateShortcuts = [
      {
        text: "Heute",
        value: new Date(),
      },
      {
        text: "Morgen",
        value: () => {
          const date = new Date();
          date.setDate(date.getDate() + 1);
          return date;
        },
      },
    ];

    onMounted(async () => {
      await loadMoreEvents();
    });

    const loadMoreEvents = async () => {
      if (loading.value) return;
      loading.value = true;
      try {
        const response = await fetchEvents(
          undefined,
          page.value,
          pageSize.value
        );
        const sortedEvents = response.data.sort(
          (a: Event, b: Event) =>
            new Date(a.attributes.eventstart).getTime() -
            new Date(b.attributes.eventstart).getTime()
        );
        events.value.push(...sortedEvents);
        displayedEvents.value = events.value;
        page.value += 1;
      } catch (err) {
        error.value = (err as Error).message;
      } finally {
        loading.value = false;
      }
    };

    const handleSearch = (searchTerm: string) => {
      filterEvents(searchTerm, selectedDate.value);
    };

    const handleDateChange = (date: Date | null) => {
      selectedDate.value = date;
      filterEvents("", date);
    };

    const filterEvents = (searchTerm: string, date: Date | null) => {
      displayedEvents.value = events.value.filter((event) => {
        const matchesSearch = event.attributes.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
        const matchesDate =
          !date ||
          new Date(event.attributes.eventstart).toLocaleDateString() ===
            date.toLocaleDateString();
        return matchesSearch && matchesDate;
      });
    };

    const formatEventDate = (dateString: string) => {
      const eventDate = new Date(dateString);
      const today = new Date();
      const tomorrow = new Date();
      tomorrow.setDate(today.getDate() + 1);

      let formattedDate = eventDate.toLocaleDateString();

      if (eventDate.toLocaleDateString() === today.toLocaleDateString()) {
        formattedDate += " (Heute)";
      } else if (
        eventDate.toLocaleDateString() === tomorrow.toLocaleDateString()
      ) {
        formattedDate += " (Morgen)";
      }

      return formattedDate;
    };

    const openEvent = (event: Event) => {
      // Open event details logic
    };

    return {
      displayedEvents,
      error,
      loadMoreEvents,
      handleSearch,
      handleDateChange,
      loading,
      selectedDate,
      dateShortcuts,
      formatEventDate,
    };
  },
});
</script>

<style scoped>
.event-card {
  margin-bottom: 20px;
}

.filter-container {
  display: flex;
  align-items: center;
  gap: 10px;
}

.filter-container > * {
  flex: 1;
}
</style>
