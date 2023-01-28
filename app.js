const currentDate = new Date();
const [DAY, MONTH, YEAR] = [
    currentDate.getDate(),
    currentDate.getMonth() + 1,
    currentDate.getFullYear(),
];
const TASK_LIST = JSON.parse(localStorage.getItem("TASK_LIST")) || [];

const newTaskBtn = document.querySelector(".js-new-task-btn");
newTaskBtn.addEventListener("click", () => {
    document.querySelector(".js-new-task-modal").classList.add("active");
    const form = document.querySelector(".js-new-task-form");
    document.querySelector("#new-task-date").valueAsDate = currentDate;

    form.addEventListener(
        "submit",
        (e) => {
            e.preventDefault();
            let color = "";
            let error = "";
            const taskDate = e.target[2].value.split("-");

            if (new Date(taskDate[0], taskDate[1], taskDate[2]) < new Date(YEAR, MONTH, DAY)) {
                error += "Nie można dodać zdarzenia starszych niz dzień dzisiejszy";
                form.classList.add("error");
            }

            document.querySelector(".js-new-task-error").textContent = error;
            if (error) return;

            for (const el of form) {
                if (el.name === "new-task-color" && el.checked) {
                    color = el.classList[1].split("--")[1];
                }
            }

            TASK_LIST.push({
                title: e.target[0].value,
                content: e.target[1].value,
                date: e.target[2].value,
                color,
            });
            localStorage.setItem("TASK_LIST", JSON.stringify(TASK_LIST));

            renderCalendar();
            form.reset();
            document.querySelector(".js-new-task-modal").classList.remove("active");
        },
        { once: true }
    );
});

const calendarGrid = document.querySelector(".calendar__grid");
calendarGrid.style.height = document.body.clientHeight - calendarGrid.offsetTop + "px";

function generateDay(dayNumber, tasks = []) {
    let taskList = "";
    tasks.forEach((task) => {
        if (new Date(task.date).getDate() !== dayNumber) return;

        taskList += `
            <div class="calendar__task calendar__task--${task.color}">
                <p>${task.title}</p>
                <span>${task.content}</span>
            </div>
        `;
    });

    return `
        <div class="
            calendar__day 
            ${dayNumber === DAY ? "today" : ""}
            ${dayNumber < DAY ? "past" : ""}
        ">
            <span class="calendar__number">${dayNumber}</span>
            <div class="calendar__list">
                ${taskList}
            </div>
        </div>
    `;
}

function renderCalendar() {
    const daysInMonth = new Date(YEAR, MONTH, 0).getDate();
    calendarGrid.innerHTML = "";
    let days = "";

    for (let i = 0; i < daysInMonth; i++) {
        days += generateDay(i + 1, TASK_LIST);
    }

    calendarGrid.insertAdjacentHTML("beforeend", days);
}

renderCalendar();
