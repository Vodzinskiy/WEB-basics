const table = document.getElementById("table");
const color = document.getElementById("color");
let num = 1;
for (let i = 1; i <= 6; i++) {
    const row = document.createElement("tr");
    for (let j = 1; j <= 6; j++) {
        const cell = document.createElement("td");
        cell.id = num;
        cell.textContent = num++;
        row.appendChild(cell);
    }

    table.appendChild(row);
}

const firstCell = document.getElementById(1);
if (firstCell) {
    firstCell.addEventListener("mouseover", (e) => {
        e.target.style.backgroundColor = "#" + Math.floor(Math.random()*16777215).toString(16);
    });
    firstCell.addEventListener("click", (e) => {
        e.target.style.backgroundColor = color.value;
    });
    firstCell.addEventListener("dblclick", () => {
        const cellsInRow = firstCell.parentElement.getElementsByTagName("td");
        for (let k = 0; k < cellsInRow.length; k++) {
            cellsInRow[k].style.backgroundColor = color.value;
        }
    });
}


