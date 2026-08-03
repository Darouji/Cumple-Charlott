import type { InvitationDetails } from "../types/invitation.types";

export const invitationConfig = {
  honoree: "Charlott",
  age: 30,
  eventDate: "2026-08-08T18:30:00-04:00",
  dateLabel: "Sábado 8 de agosto de 2026",
  timeLabel: "18:30 h",
  address: "Lorenzo Arenas 7477",
  city: "Antofagasta, Chile",
  mapUrl:
    "https://www.google.com/maps/search/?api=1&query=Lorenzo+Arenas+7477%2C+Antofagasta%2C+Chile",
  rsvpUrl: null,
} satisfies InvitationDetails;
