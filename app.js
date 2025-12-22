/* ========= NOTIFICATION PERMISSION ========= */
if ("Notification" in window) {
    Notification.requestPermission();
  }
  
  /* ========= STATE ========= */
  let todos = JSON.parse(localStorage.getItem("todos") || "[]");
  
  /* ========= DOM ========= */
  const list = document.getElementById("list");
  const total = document.getElementById("total");
  const done = document.getElementById("done");
  const pending = document.getElementById("pending");
  
  /* ========= SIDEBAR ========= */
  function toggleSidebar() {
    document.getElementById("sidebar").classList.toggle("show");
  }
  
  function showTab(id, el) {
    document.querySelectorAll(".tab").forEach(t => t.style.display = "none");
    document.getElementById(id).style.display = "block";
  
    document.querySelectorAll("aside div").forEach(d => d.classList.remove("active"));
    el.classList.add("active");
  
    document.getElementById("sidebar").classList.remove("show");
  }
  
  /* ========= STORAGE ========= */
  function save() {
    localStorage.setItem("todos", JSON.stringify(todos));
  }
  
  /* ========= RENDER ========= */
  function render() {
    list.innerHTML = "";
    let completed = 0;
  
    todos.forEach((t, i) => {
      if (t.done) completed++;
  
      const li = document.createElement("li");
      if (t.done) li.classList.add("done");
  
      li.innerHTML = `
        <div onclick="toggleDone(${i})">
          <b>${t.text}</b> <small>(${t.priority})</small>
          <div class="time">${new Date(t.time).toLocaleString()}</div>
        </div>
  
        <div class="actions">
          <span onclick="toggleDone(${i})">✔</span>
          <span onclick="removeTodo(${i})">🗑</span>
        </div>
      `;
  
      list.appendChild(li);
    });
  
    total.textContent = todos.length;
    done.textContent = completed;
    pending.textContent = todos.length - completed;
  }
  
  /* ========= TASKS ========= */
  function addTodo() {
    const text = task.value.trim();
    if (!text || !time.value) return;
  
    const todo = {
      text,
      time: time.value,
      priority: priority.value,
      done: false
    };
  
    todos.push(todo);
    scheduleNotification(todo);
    save();
    render();
  
    task.value = "";
    time.value = "";
  }
  
  function toggleDone(i) {
    todos[i].done = !todos[i].done;
    save();
    render();
  }
  
  function removeTodo(i) {
    todos.splice(i, 1);
    save();
    render();
  }
  
  function resetAll() {
    if (confirm("Reset all data?")) {
      todos = [];
      save();
      render();
    }
  }
  
  /* ========= NOTIFICATIONS ========= */
  function scheduleNotification(todo) {
    const delay = new Date(todo.time) - new Date();
    if (delay <= 0) return;
  
    setTimeout(() => {
      sendNotification(todo.text);
    }, delay);
  }
  
  function sendNotification(text) {
    if (Notification.permission !== "granted") return;
  
    navigator.serviceWorker.ready.then(reg => {
      reg.showNotification("NotifyMe Pro", {
        body: text,
        icon: "icon-192.png",
        badge: "icon-192.png",
        vibrate: [200, 100, 200],
        tag: "notifyme"
      });
    });
  }
  
  /* ========= RESCHEDULE ON RELOAD ========= */
  todos.forEach(scheduleNotification);
  
  /* ========= INIT ========= */
  render();
  