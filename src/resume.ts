/**
 * Resume metadata and helpers used by the portfolio OS.
 */
export const RESUME_TITLE = "Taahirah Denmark — AI Engineer Resume";
export const RESUME_FILENAME = "Taahirah_Denmark_AI_Engineer_Resume.pdf";
export const RESUME_LAST_UPDATED = "June 2026";

/**
 * URL of the resume PDF file.
 */
export const RESUME_URL = new URL(
  "../Taahirah_Denmark_FullStack_Product.pdf",
  import.meta.url,
).href;

export function openResumePdf() {
  window.open(RESUME_URL, "_blank", "noopener,noreferrer");
}

export function downloadResumePdf() {
  const link = document.createElement("a");
  link.href = RESUME_URL;
  link.download = RESUME_FILENAME;
  link.rel = "noopener noreferrer";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
