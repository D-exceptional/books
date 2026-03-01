// -------------------------------------------------
// Base Urls
// -------------------------------------------------
export const apiUrl =
  window.location.hostname === "localhost"
    ? "http://localhost/projects/books/api"
    : "https://austin.com/api";

export const baseUrl =
  window.location.hostname === "localhost"
    ? "http://localhost/projects/books"
    : "https://austin.com";
