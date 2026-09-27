import type { Court } from "../types/arena";

const query = (court: Court) => encodeURIComponent(court.name + " - " + court.neighborhood);

export const openWaze = (court: Court) => {
  window.open("https://waze.com/ul?q=" + query(court), "_blank", "noopener,noreferrer");
};

export const openMaps = (court: Court) => {
  window.open("https://www.google.com/maps/search/?api=1&query=" + query(court), "_blank", "noopener,noreferrer");
};

export const shareOnWhatsApp = (message: string) => {
  window.open("https://wa.me/?text=" + encodeURIComponent(message), "_blank", "noopener,noreferrer");
};
