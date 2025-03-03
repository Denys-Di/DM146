document.addEventListener("DOMContentLoaded", function () {
    setupForm(".form-input_ftr");
    setupForm(".another-form-selector");

    function setupForm(formSelector) {
        const form = document.querySelector(formSelector);
        if (!form) return;
        
        const nameInput = form.querySelector("#user-name");
        const phoneInput = form.querySelector("#user-phone");
        const emailInputs = form.querySelectorAll("input[name='user-email']");
        const questionInput = emailInputs.length > 1 ? emailInputs[1] : null;
        const emailInput = emailInputs[0];
        const privacyCheckbox = form.querySelector("#user-privacy");
        const submitButton = form.querySelector(".button-send_ftr");

        submitButton.addEventListener("click", function (event) {
            event.preventDefault();
            let isValid = true;

            form.querySelectorAll(".error-message").forEach(el => el.remove());

            if (nameInput && nameInput.value.trim() === "") {
                showError(nameInput, "Введите ваше имя.");
                isValid = false;
            }

            const phonePattern = /^\+1 \(\d{3}\) \d{3}-\d{4}$/;
            if (!phonePattern.test(phoneInput.value.trim())) {
                showError(phoneInput, "Введите корректный номер телефона.");
                isValid = false;
            }

            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(emailInput.value.trim())) {
                showError(emailInput, "Введите корректный email.");
                isValid = false;
            }

            if (questionInput && questionInput.value.trim() === "") {
                showError(questionInput, "Поле не должно быть пустым.");
                isValid = false;
            }

            if (privacyCheckbox && !privacyCheckbox.checked) {
                showError(privacyCheckbox, "Вы должны согласиться с обработкой данных.");
                isValid = false;
            }

            if (isValid) {
                sendForm(form, nameInput, phoneInput, emailInput, questionInput);
            }
        });
    }

    function showError(input, message) {
        const errorElement = document.createElement("div");
        errorElement.classList.add("error-message");
        errorElement.style.color = "red";
        errorElement.style.fontSize = "12px";
        errorElement.style.marginTop = "5px";
        errorElement.textContent = message;
        input.parentNode.appendChild(errorElement);
    }

    function sendForm(form, nameInput, phoneInput, emailInput, questionInput) {
        const formData = {
            name: nameInput ? nameInput.value.trim() : "",
            phone: phoneInput.value.trim(),
            email: emailInput.value.trim(),
            question: questionInput ? questionInput.value.trim() : ""
        };

        fetch("https://example.com/submit-form", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formData)
        })
        .then(response => response.json())
        .then(data => {
            alert("Форма успешно отправлена!");
            if (nameInput) nameInput.value = "";
            phoneInput.value = "";
            emailInput.value = "";
            if (questionInput) questionInput.value = "";
            const privacyCheckbox = form.querySelector("#user-privacy");
            if (privacyCheckbox) privacyCheckbox.checked = false;
        })
        .catch(error => {
            console.error("Ошибка отправки формы:", error);
            alert("Произошла ошибка при отправке формы. Попробуйте еще раз.");
        });
    }
});
