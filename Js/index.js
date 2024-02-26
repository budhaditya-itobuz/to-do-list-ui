import { getData, setData, formater } from "./helper.js";

const container = document.getElementById('task-container')
const input = document.getElementById('input')
const all = document.getElementById('all-btn')
const completed = document.getElementById('completed-btn')
const active = document.getElementById('active-btn')
const clear = document.getElementById('clear-btn')
const submit = document.getElementById('submit-btn')

if (!getData('todo')) setData('todo', [])

if (!getData('state')) setData('state', 'all')

setData('update', null)

const addTask = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const taskData = Object.fromEntries(formData.entries());

    let mytask = formater(taskData.task)
    if (mytask === "") {
        alert("your text is empty")
        return
    }
    let tasks = getData('todo')
    if (tasks.filter(e => e.task === mytask).length > 0) {
        alert('Task already exists')
    }
    else {
        tasks.push({ id: Date.now(), task: mytask, status: 'pending' })
        setData('todo', tasks)
    }
}

const removeTask = (id) => {
    if (getData('update') === parseInt(id)) {
        alert("Current item is in update . Cannot delete it")
        setData('update', null)
        submit.innerText = "update"
    }
    else {
        let tasks = getData('todo')
        tasks = tasks.filter((item) => item.id != id)
        setData('todo', tasks)
    }
}

const completeTask = (id) => {
    let tasks = getData('todo')
    tasks.map((item, index) => {
        if (item.id === parseInt(id)) {
            if (item.status === 'pending')
                tasks[index].status = 'completed'
            else
                tasks[index].status = 'pending'
        }
    })
    setData('todo', tasks)
}

const updateInitial = (id) => {
    if (getData('update') === parseInt(id))
        alert("Current item is already in update ")
    else {
        const tasks = getData('todo')
        let mytask = tasks.filter((item) => item.id === parseInt(id))[0]
        setData('update', mytask.id)
        input.value = mytask.task
        submit.innerText = "update"
    }
}

const updateFinal = () => {
    const id = getData('update')
    let tasks = getData('todo')
    if (tasks.filter(e => e.task === input.value).length > 0) {
        alert('Task already exists')
    }
    else if (input.value.trim() === "") {
        alert("Your text is empty")
    }
    else {
        tasks.forEach((item, index) => {
            if (parseInt(item.id) === parseInt(id)) {
                tasks[index].task = input.value
            }
        })
        setData('todo', tasks)
        setData('update', null)
    }

}

const render = () => {
    let tasks = getData('todo')
    const state = getData('state')
    container.innerHTML = ""
    input.value = ""

    if (state === 'completed')
        tasks = getData('todo').filter((item) => item.status === 'completed')
    else if (state === 'active')
        tasks = getData('todo').filter((item) => item.status === 'pending')

    tasks.forEach((item) => {
        const remove = document.createElement('img')
        remove.setAttribute('src', "./images/trash-solid.svg")
        remove.setAttribute('class', 'remove')
        remove.dataset.id = item.id

        const update = document.createElement('img')
        update.setAttribute('src', "./images/pen-to-square-regular.svg")
        update.setAttribute('class', 'update')
        update.dataset.id = item.id

        let complete = document.createElement('div')
        complete.setAttribute('class', 'complete')


        const tasks = document.createElement('div')
        tasks.classList.add('task')

        const h4 = document.createElement('h4')
        if (item.status === 'completed') {
            tasks.classList.add('change')
            h4.innerHTML = item.task.strike()
            complete = document.createElement('img')
            complete.setAttribute('src', "./images/check-solid.svg")
            complete.setAttribute('class', 'complete')
            complete.dataset.id = item.id

        }
        else {
            h4.innerHTML = item.task
            complete.dataset.id = item.id
        }

        tasks.appendChild(complete)
        tasks.appendChild(h4)
        tasks.appendChild(update)
        tasks.appendChild(remove)
        container.appendChild(tasks)

    })

    const remove = document.querySelectorAll('.remove')
    remove.forEach((item) => {
        item.addEventListener("click", (e) => {
            removeTask(e.target.getAttribute('data-id'))
            render()
        })
    })

    const update = document.querySelectorAll('.update')
    update.forEach((item) => {
        item.addEventListener("click", (e) => {
            updateInitial(e.target.getAttribute('data-id'))
            // render()
        })
    })

    const complete = document.querySelectorAll('.complete')
    complete.forEach((item) => {
        item.addEventListener("click", (e) => {
            completeTask(e.target.getAttribute('data-id'))
            render()
        })
    })
}
render()

all.addEventListener('click', () => {
    setData('state', 'all')
    render()
})
completed.addEventListener('click', () => {
    setData('state', 'completed')
    render()
})
active.addEventListener('click', () => {
    setData('state', 'active')
    render()
})
clear.addEventListener('click', () => {
    let tasks = getData('todo')
    tasks = tasks.filter((item) => item.status === 'pending')
    setData('todo', tasks)
    render()
})

const form = document.getElementById('my-form')
form.addEventListener('submit', (e) => {
    if (!getData('update')) {
        addTask(e)
        render()
    }
    else {
        updateFinal()
        render()
    }
})
