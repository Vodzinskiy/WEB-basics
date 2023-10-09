let users = document.getElementById("users");

function download() {
    fetch('https://randomuser.me/api')
        .then((response) => {
            return response.json();
        })
        .then(data => {
            const userHTML = data.results.map(element => {
                return `
                    <div class="col">
                        <div class="card h-100">
                            <button type="button" class="btn-close position-absolute top-0 end-0 border-white rounded-circle" style="background-color: white;""></button>
                            <img src="${element.picture.large}" class="card-img-top" alt="" />
                            <div class="card-body">             
                                <p>name: ${element.name.title} ${element.name.first} ${element.name.last}</p>
                                <p>cell: ${element.cell}</p>
                                <p>city: ${element.location.city}</p>
                                <p>country: ${element.location.country}</p>             
                            </div>
                        </div>
                    </div>`;
            }).join('');

            users.innerHTML = userHTML + users.innerHTML;
        });
}

function deleteAll() {
    users.innerHTML = '';
}

users.addEventListener('click', function(event) {
    if (event.target.classList.contains('btn-close')) {
        event.target.closest('.col').remove();
    }
});