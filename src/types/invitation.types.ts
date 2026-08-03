export interface InvitationDetails {
  readonly honoree: string;
  readonly age: number;
  readonly eventDate: string;
  readonly dateLabel: string;
  readonly timeLabel: string;
  readonly address: string;
  readonly city: string;
  readonly mapUrl: string;
  readonly rsvpUrl: string | null;
}
