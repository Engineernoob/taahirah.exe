export const RESUME_URL = new URL(
  "../Taahirah_Denmark_Resume_2026_3.pdf",
  import.meta.url,
).href;

export function openResumePdf() {
  window.open(RESUME_URL, "_blank", "noopener,noreferrer");
}
