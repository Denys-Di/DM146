document.addEventListener("DOMContentLoaded", () => {
    function setupForm(form) {
        if (!form) return;

        const inputs = {
            name: form.querySelector("#user-name"),
            phone: form.querySelector("#user-phone"),
            email: form.querySelector("input[name='user-email']"),
            question: form.querySelectorAll("input[name='user-email']")[1] || null,
            privacy: form.querySelector("#user-privacy"),
        };
        
        const submitButton = form.querySelector(".button-send_ftr");
        submitButton.addEventListener("click", (event) => {
            event.preventDefault();
            clearErrors(form);

            if (validateForm(inputs)) {
                sendForm(form, inputs);
            }
        });
    }

    function validateForm(inputs) {
        let isValid = true;
        const patterns = {
            phone: /^\+1 \(\d{3}\) \d{3}-\d{4}$/, 
            email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        };
        
        if (inputs.name && !inputs.name.value.trim()) {
            showError(inputs.name, "Введите ваше имя.");
            isValid = false;
        }

        if (inputs.phone && !patterns.phone.test(inputs.phone.value.trim())) {
            showError(inputs.phone, "Введите корректный номер телефона.");
            isValid = false;
        }

        if (inputs.email && !patterns.email.test(inputs.email.value.trim())) {
            showError(inputs.email, "Введите корректный email.");
            isValid = false;
        }

        if (inputs.question && !inputs.question.value.trim()) {
            showError(inputs.question, "Поле не должно быть пустым.");
            isValid = false;
        }

        if (inputs.privacy && !inputs.privacy.checked) {
            showError(inputs.privacy, "Вы должны согласиться с обработкой данных.");
            isValid = false;
        }

        return isValid;
    }

    function showError(input, message) {
        const errorElement = document.createElement("div");
        Object.assign(errorElement.style, {
            color: "red", fontSize: "12px", marginTop: "5px"
        });
        errorElement.classList.add("error-message");
        errorElement.textContent = message;
        input.parentNode.appendChild(errorElement);
    }

    function clearErrors(form) {
        form.querySelectorAll(".error-message").forEach(el => el.remove());
    }

    function sendForm(form, inputs) {
        const formData = {
            name: inputs.name?.value.trim() || "",
            phone: inputs.phone.value.trim(),
            email: inputs.email.value.trim(),
            question: inputs.question?.value.trim() || ""
        };

        fetch("https://example.com/submit-form", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData)
        })
        .then(response => response.json())
        .then(() => {
            alert("Форма успешно отправлена!");
            Object.values(inputs).forEach(input => {
                if (input) input.value = "";
            });
            if (inputs.privacy) inputs.privacy.checked = false;
        })
        .catch(error => {
            console.error("Ошибка отправки формы:", error);
            alert("Произошла ошибка при отправке формы. Попробуйте еще раз.");
        });
    }
});
