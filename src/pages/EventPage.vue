<template>
  <div class="container">
    <div class="left-column">
      <h1>{{ event?.attributes.name }}</h1>
      <el-tag>{{ event?.attributes.type }}</el-tag>
      <p>{{ event?.attributes.eventtext }}</p>
      <div v-if="event?.attributes.bands" id="band-section">
        <h3>
          <el-icon><Mic /></el-icon>
          Lineup
        </h3>
        <div class="demo-collapse">
          <el-collapse>
            <el-collapse-item
              v-for="band in event?.attributes.bands.data"
              :key="band.id"
              :title="band.attributes.bandname"
              :name="band.id.toString()"
            >
              <div><strong>Land:</strong> {{ band.attributes.country }}</div>
              <div v-if="band.attributes.description">
                <strong>Beschreibung:</strong> {{ band.attributes.description }}
              </div>
              <div v-if="band.attributes.linklist">
                <strong>Links:</strong>
                <ul>
                  <li v-for="link in band.attributes.linklist" :key="link.id">
                    <a :href="link.url" target="_blank">{{ link.title }}</a>
                  </li>
                </ul>
              </div>
            </el-collapse-item>
          </el-collapse>
        </div>
      </div>
    </div>
    <div class="right-column">
      <h2>{{ formatDateTime(event?.attributes.eventstart) }}</h2>
      <div class="countdown">
        <span>{{ days }}</span> Tage &nbsp;&nbsp;&nbsp;
        <span>{{ hours }}</span> Stunden &nbsp;&nbsp;&nbsp;
        <span>{{ minutes }}</span> Min &nbsp;&nbsp;&nbsp;
        <span>{{ seconds }}</span> Sek
      </div>

      <h3 class="location">
        <i inline-flex i="ep-location-information" />
        {{ event?.attributes.location.data.attributes.name }}
      </h3>
      <p>
        <i inline-flex i="ep-ticket" />
        <span v-if="event?.attributes.ticket?.type === 'Eintrittspreis'">
          {{ formatPrice(event?.attributes.ticket?.chf) }} CHF
          <el-link
            v-if="event?.attributes.ticket?.ticketlink"
            :href="event?.attributes.ticket?.ticketlink"
            target="_blank"
            style="margin-left: 5px;"
            ><i inline-flex i="ep-shopping-trolley" style="margin-right:2px;"/> kaufen</el-link
          >
        </span>
        <span v-else>
          {{ event?.attributes.ticket?.type }}
        </span>
      </p>

      <div class="share">
        <el-button plain @click="downloadICS">
          <el-icon><Calendar /></el-icon>
          <span class="button-text"> Kalender eintragen</span>
        </el-button>

        <el-button plain @click="copyLink">
          <el-icon><CopyDocument /></el-icon>
          <span class="button-text"> Link kopieren</span>
        </el-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import { fetchEvent } from "../api/events";
import type { Event } from "../types/Event";
import { Mic, CopyDocument, Calendar } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";

const route = useRoute();
const event = ref<Event | null>(null);

const days = ref(0);
const hours = ref(0);
const minutes = ref(0);
const seconds = ref(0);

const loadEvent = async (id: number) => {
  try {
    const response = await fetchEvent(id);
    event.value = response.data;
    document.title = response.data.attributes.name;
    startCountdown(new Date(response.data.attributes.eventstart));
  } catch (error) {
    console.error("Error loading event:", error);
  }
};

const formatDateTime = (timestamp: any) => {
  const date = new Date(timestamp);
  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  };
  return date.toLocaleDateString("de-DE", options);
};

const formatPrice = (price: number) => {
  return price.toFixed(2);
};

const startCountdown = (eventStart: Date) => {
  const updateCountdown = () => {
    const now = new Date().getTime();
    const distance = eventStart.getTime() - now;

    if (distance > 0) {
      days.value = Math.floor(distance / (1000 * 60 * 60 * 24));
      hours.value = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      minutes.value = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      seconds.value = Math.floor((distance % (1000 * 60)) / 1000);
    } else {
      days.value = 0;
      hours.value = 0;
      minutes.value = 0;
      seconds.value = 0;
    }
  };

  updateCountdown();
  setInterval(updateCountdown, 1000);
};

const downloadICS = () => {
  if (event.value) {
    const icsData = `
BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Your Company//Your Product//EN
BEGIN:VEVENT
UID:${event.value.id}
DTSTAMP:${new Date().toISOString().replace(/[-:]/g, "").split(".")[0]}Z
DTSTART:${new Date(event.value.attributes.eventstart).toISOString().replace(/[-:]/g, "").split(".")[0]}Z
SUMMARY:${event.value.attributes.name}
DESCRIPTION:${event.value.attributes.eventtext}
LOCATION:${event.value.attributes.location.data.attributes.name}
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsData], { type: "text/calendar" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${event.value.attributes.name}.ics`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
};

const copyLink = async () => {
  try {
    await navigator.clipboard.writeText(window.location.href);
    ElMessage.success("Link wurde kopiert!");
  } catch (err) {
    ElMessage.error("Fehler beim Kopieren des Links");
  }
};

onMounted(() => {
  const id = Number(route.params.id);
  loadEvent(id);
});

watch(event, (newEvent) => {
  if (newEvent) {
    document.title = newEvent.attributes.name + " | Punkalender";
  }
});
</script>

<style scoped>
.container {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  flex-wrap: wrap;
}

.left-column {
  flex: 1;
  max-width: 48%;
  text-align: left;
}

.right-column {
  flex: 1;
  max-width: 48%;
  text-align: left;
}

.countdown span {
  font-size: 2em;
  font-weight: bold;
}

p,
h3 {
  display: flex;
  align-items: center;
  gap: 5px;
}

h3.location {
  position: relative;
}

.share .el-button {
  display: flex;
  align-items: center;
  gap: 5px;
}

.button-text {
  display: inline;
}

@media (max-width: 773px) {
  .container {
    flex-direction: column;
  }

  .left-column,
  .right-column {
    max-width: 100%;
  }

  .button-text {
    display: none;
  }

  .share .el-button {
    justify-content: center;
  }
}
</style>
