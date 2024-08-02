import { postData } from "../utils/fetch.js";

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("register-form");
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
      const lastName = document.querySelector("[name='inputLastName']").value;
      const firstName = document.querySelector("[name='inputFistName']").value;
      const email = document.querySelector("[name='inputEmail']").value;
      const password = document.querySelector("[name='inputPassword']").value;
      const repeatPassword = document.querySelector(
        "[name='inputRepeatPassword']"
      ).value;

      // on construit les données à envoyer
      const data = {
        email: email,
        first_name: firstName,
        last_name: lastName,
        password: password,
        password2: repeatPassword,
      };

      // on post les données
      postData("http://127.0.0.1:8000/api/auth/register/", data)
        .then(async (response) => {
          if (response.ok) {
            // on dirige l'utilisateur pour vérifier son email
            window.location.href = "verify-email.html";
          } else {
            // on obtient les erreurs du serveur
            const errors = await response.json();
            handleErrors(errors);
          }
        })
        .catch((error) => {
          console.error("Error", error);
        });
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
      if (field === "non_field_errors") {
        const alert = document.createElement("div");
        alert.id = "registerErrorAlert";
        alert.className = "alert alert-danger";
        alert.role = "alert";
        alert.innerHTML = `${messages[0]} <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>`;
        form.prepend(alert);
        // on rend le form invalid
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
