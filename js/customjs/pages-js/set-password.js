import { postData, getData, patchData } from "../utils/fetch.js";

document.addEventListener("DOMContentLoaded", function () {
  // on recupère les urlsParams
  const urlsParams = new URLSearchParams(window.location.search);
  const uid = urlsParams.get("uidb64");
  const token = urlsParams.get("token");
  if (!uid && !token) {
    // on redirige vers login
    window.location.href = "pages/login.html";
    return;
  }

  // on construit la logique
  const form = document.getElementById("form-set-password");
  if (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      event.stopPropagation();

      // on vérifie si le formulaire est valide
      if (form.checkValidity() === false) {
        form.classList.add("was-validated");
        return;
      }

      // on récupère les données validées
      const password = document.querySelector("[name='inputPassword']").value;
      const password2 = document.querySelector("[name='inputPassword2']").value;

      // on fait un get request pour voir si le ticket de validation est bonne ou pas

      getData(
        `http://127.0.0.1:8000/api/auth/password-reset-confirm/${uid}/${token}/`
      )
        .then(async (response) => {
          if (response.ok) {
            // on va maintenant patcher les données
            const data = {
              password: password,
              confirm_password: password2,
              uidb64: uid,
              token: token,
            };
            var res_patch = await patchData(
              "http://127.0.0.1:8000/api/auth/set-new-password/",
              data
            );
            if (res_patch.ok) {
              // on le redirige vers le login
              window.location.href = "pages/login.html";
              return;
            } else {
              var errors_validation = await res_patch.json();
              // on affiche les différentes erreurs
              handleErrors(errors_validation);
            }
          }
        })
        .catch((error) => console.error(error));

      // on construit les données à envoyer

      // on post les données
      //   postData("http://127.0.0.1:8000/api/auth/login/", data)
      //     .then(async (response) => {
      //       console.log(response);
      //       if (response.ok) {
      //         const result = await response.json();
      //         // Stocker les tokens dans le localStorage
      //         localStorage.setItem("access_token", result.access_token);
      //         localStorage.setItem("refresh_token", result.refresh_token);

      //         // Rediriger l'utilisateur vers index.html
      //         window.location.href = "index.html";
      //       } else {
      //         // on obtient les erreurs du serveur
      //         const errors = await response.json();
      //         handleErrors(errors);
      //       }
      //     })
      //     .catch((error) => {
      //       console.error("Error", error);
      //     });
    });
  } else {
    console.error("Form not found");
  }

  function handleErrors(errors) {
    // efface les anciens messages d'erreur
    const errorElements = document.querySelectorAll(".invalid-feedback.server");
    errorElements.forEach((el) => el.remove());

    // on enleve is_invalid dans tous les inputs
    const inputs = document.querySelectorAll("input");
    inputs.forEach((input) => {
      input.classList.remove("is-invalid");
    });

    // efface l'ancienne alerte si elle existe
    const existingAlert = document.getElementById("registerErrorAlert");
    if (existingAlert) {
      existingAlert.remove();
    }

    // affiche les nouveaux messages d'erreur
    for (const [field, messages] of Object.entries(errors)) {
      // si field est une erreur de validation de champs
      console.log(field);
      if (field === "detail") {
        const alert = document.createElement("div");
        alert.id = "registerErrorAlert";
        alert.className = "alert alert-danger";
        alert.role = "alert";
        alert.innerHTML = `${messages} <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>`;
        form.prepend(alert);
      } else {
        const input = document.getElementById(field);
        if (input) {
          messages.forEach((message) => {
            const errorDiv = document.createElement("div");
            errorDiv.classList.add("invalid-feedback", "server");
            errorDiv.textContent = message;
            input.parentNode.appendChild(errorDiv);
          });
          input.classList.add("is-invalid");
        }
      }
    }
  }
});
