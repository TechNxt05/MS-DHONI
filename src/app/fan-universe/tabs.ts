// Shared by the server page (to read ?tab=) and the client component (to render the tab bar).
export const TABS = [
  { key: 'thala', label: 'Thala for a Reason' },
  { key: 'pressure', label: 'Pressure Mode' },
  { key: 'captaincy', label: 'Captaincy Lab' },
  { key: 'fanmap', label: 'Fan Globe' },
  { key: 'cards', label: 'Supremacy Cards' },
] as const;

export type Tab = (typeof TABS)[number]['key'];

export const isTab = (v: string | undefined): v is Tab => TABS.some((t) => t.key === v);
