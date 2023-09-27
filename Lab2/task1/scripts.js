const name = document.getElementById('name');
const phone = document.getElementById('phone');
const faculty = document.getElementById('faculty');
const birthDate = document.getElementById('birthDate');
const address = document.getElementById('address');
const form = document.getElementById('validation-form');

const nameRegex = /^[А-Яа-яA-Za-zҐґЄєІіЇї]{2,15} [А-Яа-яA-Za-zҐґЄєІіЇї]\.[А-Яа-яA-Za-zҐґЄєІіЇї]\.$/;
const phoneRegex = /^\(\d{3}\)-\d{3}-\d{2}-\d{2}$/;
const facultyRegex = /^[А-Яа-яA-Za-zҐґЄєІіЇї]{4}$/;
const birthRegex = /^\d{2}\.\d{2}\.\d{4}$/;
const addressRegex = /^м\.\s[А-Яа-яA-Za-zҐґЄєІіЇї]{2,15}$/;

function checkForm() {
    const inputFields = [
        { element: name, regex: nameRegex },
        { element: phone, regex: phoneRegex },
        { element: faculty, regex: facultyRegex },
        { element: birthDate, regex: birthRegex },
        { element: address, regex: addressRegex },
    ];

    let success = true;
    let formData = {};

    inputFields.forEach(({ element, regex }) => {
        element.classList.remove("input-error");
        if (!regex.test(element.value)) {
            element.classList.add("input-error");
            success = false;
        }
        if (element === birthDate) {
            if (!isValidDate(element.value)){
                element.classList.add("input-error");
                success = false;
            }
        }
        formData[element.id] = element.value;
    });

    if (success) {
        form.reset();

        const newWindow = window.open("", "_blank", "width=400,height=400");
        if (newWindow) {
            newWindow.document.write("<html><head><title>Форма Даних</title></head><body>");
            newWindow.document.write("<h1>Введена інформація з форми:</h1>");
            newWindow.document.write("<ul>");
            for (const key in formData) {
                newWindow.document.write(`<li><strong>${key}:</strong> ${formData[key]}</li>`);
            }
            newWindow.document.write("</ul>");
            newWindow.document.write("</body></html>");
            newWindow.document.close();
        }

    }
}

function isValidDate(dateString) {
    const parts = dateString.split('.');
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const year = parseInt(parts[2], 10);
    const date = new Date(year, month, day);
    return (
        date.getDate() === day &&
        date.getMonth() === month &&
        date.getFullYear() === year &&
        date <= new Date()
    );
}



