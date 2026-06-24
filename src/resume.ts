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
