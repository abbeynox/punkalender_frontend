<template>
  <div>
    <h1>{{ event?.data.attributes.name }}</h1>
    <p>{{ event?.data.attributes.eventtext }}</p>
    <p>Startzeit: {{ formatDate(event?.data.attributes.eventstart) }}</p>
    <p>Endzeit: {{ formatDate(event?.data.attributes.eventend) }}</p>
    <!-- <p>Ort: {{ locationName }}</p> -->
    <p>Ticket Typ: {{ event?.data.attributes.ticket.type }}</p>
    <p v-if="event?.data.attributes.ticket.type !== 'Kostenlos'">
      Ticket Link:
      <a :href="event?.data.attributes.ticket.ticketlink">
        {{ event?.data.attributes.ticket.ticketlink }}
      </a>
    </p>
    <p v-if="event?.data.attributes.ticket.type !== 'Kostenlos'">
      Preis: {{ event?.data.attributes.ticket.chf }} CHF
    </p>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed } from "vue";
import { useRoute } from "vue-router";
import { fetchEvent } from "../api/events"; // Stellen Sie sicher, dass diese Funktion in api/events.ts existiert
import { fetchLocation } from "../api/locations";
import type { Event } from "../types/Event";
import type { Location } from "../types/Location";

const route = useRoute();
const eventId = Number(route.params.id);
const event = ref<{ data: Event } | null>(null);
const location = ref<{ data: Location } | null>(null);

const formatDate = (timestamp: number) => {
  if (!timestamp) return "";
  const date = new Date(timestamp);
  return date.toLocaleString();
};

onMounted(async () => {
  try {
    const eventResponse = await fetchEvent(eventId);
    event.value = eventResponse;

    // const locationResponse = await fetchLocation(
    //   event.value.data.attributes.location
    // );
    // location.value = locationResponse;
  } catch (error) {
    console.error("Error fetching event or location:", error);
  }
});

const locationName = computed(() => location.value?.data.attributes.name || "");
</script>
