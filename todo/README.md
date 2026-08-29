* Mega44 To‑Do (frontend-only)

This is a simple single-page to‑do application that stores tasks in the browser's localStorage. It lives in the `todo/` folder of this repository.

Features
- Add / edit / delete tasks
- Mark complete / uncomplete
- Filter: All / Active / Completed
- Due dates
- Export tasks to JSON and import from JSON
- Clear all tasks

How to run
- Option 1 (recommended): Serve the folder with a simple static server from the repo root:
  - python3 -m http.server 8000
  - open http://localhost:8000/todo/index.html
- Option 2: Open `todo/index.html` directly in your browser (some browsers restrict file access for import).

Notes
- Data is saved to localStorage under the key `mega44_todo_tasks`.
- This is a frontend-only demo. If you want a backend sync (server + DB), tell me and I can scaffold that.
