document.addEventListener('DOMContentLoaded', function() {
    // Form submission handling
    const form = document.getElementById("contact-form");
    const formStatus = document.getElementById("form-status");

    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        formStatus.innerHTML = "Sending...";

        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        console.log('data', data)
        try {
            const response = await fetch('api/sendEmail', {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const result = await response.json();
                formStatus.textContent = result.message || "Thanks for reaching out! We'll get back to you soon!";
                form.reset();
            } else {
                formStatus.textContent = "Oops! Something went wrong. Mind trying again?";            }
        } catch (error) {
            console.error('Error:', error);
            formStatus.textContent = "Oops! Something went wrong. Mind trying again?";        }
    });


    document.getElementById('currentYear').textContent = new Date().getFullYear();

});