const STORAGE_KEY = 'mega44_todo_tasks'

let tasks = []
let filter = 'all'

const els = {
  form: document.getElementById('task-form'),
  input: document.getElementById('task-input'),
  due: document.getElementById('due-input'),
  list: document.getElementById('task-list'),
  filters: document.querySelectorAll('.filters button'),
  exportBtn: document.getElementById('export-btn'),
  importFile: document.getElementById('import-file'),
  clearBtn: document.getElementById('clear-btn')
}

function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
}

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    tasks = raw ? JSON.parse(raw) : []
  } catch (e) {
    tasks = []
  }
}

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2,8)
}

function addTask(title, due) {
  const t = { id: uid(), title: title.trim(), completed: false, createdAt: new Date().toISOString(), due: due || null }
  tasks.unshift(t)
  save()
  render()
}

function updateTask(id, patch) {
  const i = tasks.findIndex(t => t.id === id)
  if (i === -1) return
  tasks[i] = { ...tasks[i], ...patch }
  save()
  render()
}

function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id)
  save()
  render()
}

function clearAll() {
  if (!confirm('Clear all tasks?')) return
  tasks = []
  save()
  render()
}

function render() {
  els.list.innerHTML = ''
  const visible = tasks.filter(t => {
    if (filter === 'active') return !t.completed
    if (filter === 'completed') return t.completed
    return true
  })

  if (visible.length === 0) {
    const li = document.createElement('li')
    li.className = 'task-item'
    li.innerHTML = '<div class="title small">No tasks — add one above.</div>'
    els.list.appendChild(li)
    return
  }

  visible.forEach(task => {
    const li = document.createElement('li')
    li.className = 'task-item' + (task.completed ? ' completed' : '')

    const cb = document.createElement('input')
    cb.type = 'checkbox'
    cb.checked = task.completed
    cb.addEventListener('change', () => updateTask(task.id, { completed: cb.checked }))

    const title = document.createElement('div')
    title.className = 'title'
    title.textContent = task.title

    const meta = document.createElement('div')
    meta.className = 'small'
    meta.textContent = task.due ? 'Due: ' + task.due : ''

    const actions = document.createElement('div')
    actions.className = 'task-actions'

    const editBtn = document.createElement('button')
    editBtn.textContent = 'Edit'
    editBtn.addEventListener('click', () => startEdit(task))

    const delBtn = document.createElement('button')
    delBtn.textContent = 'Delete'
    delBtn.addEventListener('click', () => {
      if (confirm('Delete this task?')) deleteTask(task.id)
    })

    actions.appendChild(editBtn)
    actions.appendChild(delBtn)

    li.appendChild(cb)
    const textWrap = document.createElement('div')
    textWrap.style.flex = '1'
    textWrap.appendChild(title)
    textWrap.appendChild(meta)
    li.appendChild(textWrap)
    li.appendChild(actions)

    els.list.appendChild(li)
  })
}

function startEdit(task) {
  const newTitle = prompt('Edit task title', task.title)
  if (newTitle === null) return
  const newDue = prompt('Edit due date (YYYY-MM-DD) or leave empty', task.due || '')
  updateTask(task.id, { title: newTitle, due: newDue || null })
}

function exportTasks() {
  const blob = new Blob([JSON.stringify(tasks, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'mega44-tasks.json'
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

function importTasks(file) {
  const reader = new FileReader()
  reader.onload = () => {
    try {
      const imported = JSON.parse(reader.result)
      if (!Array.isArray(imported)) throw new Error('Invalid format')
      // basic validation
      const filtered = imported.map(i => ({ id: i.id || uid(), title: i.title||'', completed: !!i.completed, createdAt: i.createdAt||new Date().toISOString(), due: i.due||null }))
      tasks = filtered.concat(tasks)
      save()
      render()
    } catch (e) {
      alert('Failed to import: ' + e.message)
    }
  }
  reader.readAsText(file)
}

// event wiring
els.form.addEventListener('submit', e => {
  e.preventDefault()
  const v = els.input.value.trim()
  if (!v) return
  addTask(v, els.due.value || null)
  els.input.value = ''
  els.due.value = ''
})

els.filters.forEach(b => b.addEventListener('click', () => {
  els.filters.forEach(x => x.classList.remove('active'))
  b.classList.add('active')
  filter = b.dataset.filter
  render()
}))

els.exportBtn.addEventListener('click', exportTasks)
els.importFile.addEventListener('change', e => {
  const f = e.target.files[0]
  if (f) importTasks(f)
  e.target.value = ''
})

els.clearBtn.addEventListener('click', clearAll)

// init
load()
render()
