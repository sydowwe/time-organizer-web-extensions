document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    emailInput.addEventListener('input', e => {
        e.target.classList.remove('is-invalid');
    });
    passwordInput.addEventListener('input', e => {
        e.target.classList.remove('is-invalid');
    });
    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const email = emailInput.value;
        const password = passwordInput.value;
        let formInvalid = false;

        if (!emailInput.checkValidity()) {
            emailInput.classList.add('is-invalid');
            emailInput.classList.remove('is-valid');

            formInvalid = true;
            emailInput.focus();
        } else {
            emailInput.classList.remove('is-invalid');
            emailInput.classList.add('is-valid');
        }
        if (!passwordInput.checkValidity() || password.length < 8) {
            passwordInput.classList.add('is-invalid');
            passwordInput.classList.remove('is-valid');
            if (!formInvalid) {
                passwordInput.focus();
            }
            formInvalid = true;
        } else {
            passwordInput.classList.remove('is-invalid');
            passwordInput.classList.add('is-valid');
        }
        if (formInvalid) {
            return;
        }
        const recaptchaToken = await grecaptcha.execute('6LcoxRQqAAAAANQStle4t7x0RxaxiDQI2FBQRVnw', {action: 'login'});
        const response = await fetch('http://localhost:8080/api/user/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
                email,
                password,
                stayLoggedIn: false,
                recaptchaToken
            })
        })
        let data;
        try {
            console.log(response)
            data = await response.json();
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
            alert('Login failed. Please check your credentials and try again.');
        }
        if (data.id && data.email && data.token) {
            loginForm.hidden = true;
            document.getElementById('loginSuccessful').hidden = false;
        }
    });
});