import Swal from "sweetalert2";
import validator from "validator";

export const validarSignup = () => {
    if (document.querySelector(".signup")) {
        const email = document.querySelector("#email");
        const password = document.querySelector("#password");
        const confirmPassword = document.querySelector("#confirm-password");
        const button = document.querySelector(".boton");

        email.addEventListener("input", () => {
            if (
                validator.isEmail(email.value) &&
                password.value.length > 6 &&
                password.value == confirmPassword.value
            ) {
                button.disabled = false;
            } else {
                button.disabled = true;
            }
        });

        password.addEventListener("input", () => {
            if (
                validator.isEmail(email.value) &&
                password.value.length > 6 &&
                password.value == confirmPassword.value
            ) {
                button.disabled = false;
            } else {
                button.disabled = true;
            }
        });

        confirmPassword.addEventListener("input", () => {
            if (
                validator.isEmail(email.value) &&
                password.value.length > 6 &&
                password.value == confirmPassword.value
            ) {
                button.disabled = false;
            } else {
                button.disabled = true;
            }
        });
    }
};