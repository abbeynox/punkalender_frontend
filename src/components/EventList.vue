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
            <el-date-picker v-model="selectedDate" type="date" placeholder="Wähle ein Datum" :shortcuts="dateShortcuts"
              @change="handleDateChange" size="large" style="width: 100%" />
          </el-col>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col v-for="event in displayedEvents" :key="event.id" :xs="24" :sm="12" :md="8">
        <el-card class="event-card" :body-style="{ padding: '20px' }">
          <h3>{{ event.attributes.name }}</h3>
          <p>
            <el-icon>
              <Calendar />
            </el-icon>
            {{ formatEventDate(event.attributes.eventstart) }}
          </p>
          <p>
            <el-icon>
              <Location />
            </el-icon>
            {{ event.attributes.location.data.attributes.name }}, {{
              event.attributes.location.data.attributes.Adresse.city }}
          </p>
          <router-link :to="'/event/' + event.id">
            <el-button plain>Details</el-button>
          </router-link>
        </el-card>
      </el-col>
    </el-row>
    <div v-if="error">{{ error }}</div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import { fetchEvents } from "../api/events";
import { Event } from "../types/Event";
import SearchBar from "@/components/SearchBar.vue";
import { ElIcon } from "element-plus";
import { Calendar, Location } from "@element-plus/icons-vue";

export default defineComponent({
  name: "EventList",
  components: { SearchBar, ElIcon, Calendar, Location },
  setup() {
    const events = ref<Event[]>([]);
    const displayedEvents = ref<Event[]>([]);
    const error = ref<string | null>(null);
    const loading = ref(false);
    const selectedDate = ref<Date | null>(null);
    const searchTerm = ref<string>("");

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
      await loadEvents();
    });

    const loadEvents = async () => {
      loading.value = true;
      try {
        const response = await fetchEvents(
          "eventstart:asc",
          1,
          25,
          undefined,
          { location: { populate: ['Adresse'] } }
        );
        const futureEvents = response.data.filter((event) => {
          const eventDate = new Date(event.attributes.eventstart);
          const today = new Date();
          return eventDate >= today;
        });

        events.value = futureEvents;
        filterEvents();
      } catch (err) {
        error.value = (err as Error).message;
      } finally {
        loading.value = false;
      }
    };

    const handleSearch = (term: string) => {
      searchTerm.value = term;
      filterEvents();
    };

    const handleDateChange = (date: Date | null) => {
      selectedDate.value = date;
      filterEvents();
    };

    const filterEvents = () => {
      displayedEvents.value = events.value.filter((event) => {
        const matchesSearch = event.attributes.name
          .toLowerCase()
          .includes(searchTerm.value.toLowerCase());
        const matchesDate =
          !selectedDate.value ||
          new Date(event.attributes.eventstart).toLocaleDateString() ===
          selectedDate.value.toLocaleDateString();
        return matchesSearch && matchesDate;
      });
    };

    const formatEventDate = (dateString: any) => {
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

    return {
      displayedEvents,
      error,
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

.filter-container>* {
  flex: 1;
}

p {
  display: flex;
  align-items: center;
  gap: 5px;
}
</style>
