import { postData } from "./fetch.js";

export async function checkAuth() {
  const accessToken = localStorage.getItem("access_token");
  const refresh = localStorage.getItem("refresh_token");

  // si ces deux clés n'existe pas , on le redirige vers login
  if (!accessToken || !refresh) {
    redirectToLogin();
    return;
  }

  // la fonction qui vérifie si le token est expiré

  function isTokenExpired(token) {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const expiry = payload.exp * 1000; // covertir la date d'expiration en seconde
    return Date.now() > expiry;
  }

  // vérifiez si lle token est expiré
  if (isTokenExpired(accessToken)) {
    const response = await postData("http://127.0.0.1:8000/api/auth/refresh/", {
      refresh: refresh,
    });

    if (response.ok) {
      const data = await response.json();
      // on change la valeur d'access
      localStorage.setItem("access_token", data.access);
    } else {
      redirectToLogin();
      return;
    }
  }
}
function redirectToLogin() {
  window.location.href = "pages/login.html";
}
