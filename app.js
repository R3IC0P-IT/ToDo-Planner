const CURRENT_DATE = new Date();
const [CURRENT_YEAR, CURRENT_MONTH, CURRENT_DAY] = CURRENT_DATE.toISOString()
    .split("T")[0]
    .split("-");
const TASK_LIST = JSON.parse(localStorage.getItem("TASK_LIST")) || [];
const header = document.querySelector(".js-header");
const modal = document.querySelector(".js-new-task-modal");
const newTaskBtn = document.querySelector(".js-new-task-btn");

modal.addEventListener("click", (e) => {
    if (e.target === modal || e.target.classList.contains("js-modal-close")) {
        modal.classList.remove("active");
    }
});

newTaskBtn.addEventListener("click", () => {
    const form = document.querySelector(".js-new-task-form");
    const taskDate = document.querySelector(".js-new-task-date");

    modal.classList.add("active");
    taskDate.valueAsDate = CURRENT_DATE;
    taskDate.min = `${CURRENT_YEAR}-${CURRENT_MONTH}-${CURRENT_DAY}`;

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        let color = "";

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
    });
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
            ${dayNumber === CURRENT_DAY ? "today" : ""}
            ${dayNumber < CURRENT_DAY ? "past" : ""}
        ">
            <span class="calendar__number">${dayNumber}</span>
            <div class="calendar__list">
                ${taskList}
            </div>
        </div>
    `;
}

function renderCalendar() {
    const daysInMonth = new Date(CURRENT_YEAR, CURRENT_MONTH, 0).getDate();
    calendarGrid.innerHTML = "";
    let days = "";

    for (let i = 0; i < daysInMonth; i++) {
        days += generateDay(i + 1, TASK_LIST);
    }

    calendarGrid.insertAdjacentHTML("beforeend", days);
}

renderCalendar();
