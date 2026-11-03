export const isDemoMode = () =>
  typeof window !== "undefined" &&
  window.sessionStorage.getItem("appMode") === "demo";
