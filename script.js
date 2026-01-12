let currentStudentName = "";
let currentStudentClass = "";

// ===== ELEMENT =====
const loginPage = document.getElementById("loginPage");
const appPage = document.getElementById("appPage");
const roleInfo = document.getElementById("roleInfo");
const username = document.getElementById("username");
const password = document.getElementById("password");

const bookList = document.getElementById("bookList");
const historyPage = document.getElementById("historyPage");
const historyList = document.getElementById("historyList");
const infoAdmin = document.getElementById("infoAdmin");
const totalDipinjam = document.getElementById("totalDipinjam");
const listPeminjam = document.getElementById("listPeminjam");
const manualBookForm = document.getElementById("manualBookForm");

const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");
const showBooksBtn = document.getElementById("showBooksBtn");
const showHistoryBtn = document.getElementById("showHistoryBtn");
const toggleManualBtn = document.getElementById("toggleManualBtn");

const manualTitle = document.getElementById("manualTitle");
const manualNama = document.getElementById("manualNama");
const manualKelas = document.getElementById("manualKelas");
const manualJumlah = document.getElementById("manualJumlah");
const submitManualBtn = document.getElementById("submitManualBtn");

// ===== USER =====
let currentUser = "";
let currentRole = "";

const users = [
  { username: "admin", password: "admin123", role: "admin" },
  { username: "siswa", password: "12345", role: "siswa" }
];

// ===== DATA =====
const books = [
  { title: "Matematika", status: "tersedia", borrower: "" },
  { title: "Fisika", status: "tersedia", borrower: "" },
  { title: "Kimia", status: "tersedia", borrower: "" },
  { title: "Biologi", status: "tersedia", borrower: "" },
  { title: "Bahasa Indonesia", status: "tersedia", borrower: "" },
  { title: "Bahasa Inggris", status: "tersedia", borrower: "" },
  { title: "Bahasa Jawa", status: "tersedia", borrower: "" },
  { title: "TIK", status: "tersedia", borrower: "" },
  { title: "PAI", status: "tersedia", borrower: "" },
  { title: "Seni", status: "tersedia", borrower: "" },
  { title: "PPKN", status: "tersedia", borrower: "" },
  { title: "PJOK", status: "tersedia", borrower: "" },
  { title: "Sejarah", status: "tersedia", borrower: "" }
];

let loans = [];
let history = [];

// ===== WAKTU =====
function getWaktu() {
  const now = new Date();

  const tgl = now.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric"
  });

  const jam = now.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit"
  });

  return `${tgl} • ${jam}`;
}

// ===== LOGIN =====
loginBtn.addEventListener("click", () => {
  const user = username.value.trim();
  const pass = password.value.trim();

  const found = users.find(
    u => u.username === user && u.password === pass
  );

  if (!found) {
    alert("Username atau password salah");
    return;
  }

  currentUser = found.username;
  currentRole = found.role;

  loginPage.classList.add("hidden");
  appPage.classList.remove("hidden");
  roleInfo.textContent = `(${currentRole})`;

  showBooks();
  renderBooks();
});

// ===== LOGOUT =====
logoutBtn.addEventListener("click", () => {
  appPage.classList.add("hidden");
  loginPage.classList.remove("hidden");
});

// ===== NAV =====
showBooksBtn.addEventListener("click", showBooks);
showHistoryBtn.addEventListener("click", showHistory);

toggleManualBtn.addEventListener("click", () => {
  manualBookForm.classList.toggle("hidden");
});

function showBooks() {
  bookList.classList.remove("hidden");
  historyPage.classList.add("hidden");
}

function showHistory() {
  bookList.classList.add("hidden");
  historyPage.classList.remove("hidden");
  renderHistory();
}

// ===== RENDER BUKU =====
function renderBooks() {
  bookList.innerHTML = "";

  books.forEach((b, i) => {
    const div = document.createElement("div");
    div.className = "card";

    let btn = "";
    if (currentRole === "siswa") {
      if (b.status === "tersedia") {
        btn = `<button onclick="pinjam(${i})">Pinjam</button>`;
      } else if (
        b.status === "dipinjam" &&
        b.borrower === currentStudentName
      ) {
        btn = `<button onclick="kembalikan(${i})">Kembalikan</button>`;
      }
    }

    div.innerHTML = `
      <b>${b.title}</b>
      <div class="status ${b.status}">
        Status: ${b.status}
      </div>
      ${btn}
    `;

    bookList.appendChild(div);
  });

  loans.forEach((l, i) => {
    const div = document.createElement("div");
    div.className = "card";

    let btn = "";
    if (currentRole === "siswa") {
      btn = `<button onclick="kembalikanManual(${i})">Kembalikan</button>`;
    }

    div.innerHTML = `
      <b>${l.book} (Manual)</b>
      <div class="status dipinjam">
        Dipinjam oleh ${l.nama}
      </div>
      ${btn}
    `;

    bookList.appendChild(div);
  });

  updateAdmin();
}

// ===== PINJAM =====
function pinjam(i) {
  const nama = prompt("Masukkan nama siswa:");
  const kelas = prompt("Masukkan kelas:");

  if (!nama || !kelas) {
    alert("Nama dan kelas wajib diisi!");
    return;
  }

  currentStudentName = nama;
  currentStudentClass = kelas;

  books[i].status = "dipinjam";
  books[i].borrower = nama;

  loans.push({ book: books[i].title, nama, kelas });
  history.push(
    `[${getWaktu()}] ${nama} (${kelas}) meminjam Buku ${books[i].title}`
  );

  renderBooks();
  renderHistory();
}

// ===== PINJAM MANUAL =====
submitManualBtn.addEventListener("click", () => {
  const title = manualTitle.value.trim();
  const nama = manualNama.value.trim();
  const kelas = manualKelas.value.trim();
  const jumlah = manualJumlah.value.trim();

  if (!title || !nama || !kelas || !jumlah) {
    alert("Semua data wajib diisi!");
    return;
  }

  loans.push({ book: title, nama, kelas, jumlah });
  history.push(
    `[${getWaktu()}] ${nama} (${kelas}) meminjam Buku ${title} (manual)`
  );

  manualBookForm.classList.add("hidden");
  manualTitle.value = "";
  manualNama.value = "";
  manualKelas.value = "";
  manualJumlah.value = "";

  renderBooks();
  renderHistory();
  updateAdmin();
});

// ===== KEMBALIKAN REGULER =====
function kembalikan(i) {
  const ok = confirm(
    `Apakah ${books[i].borrower} yakin ingin mengembalikan Buku "${books[i].title}"?`
  );
  if (!ok) return;

  books[i].status = "tersedia";
  books[i].borrower = "";

  loans = loans.filter(
    l => l.book !== books[i].title
  );

  history.push(
    `[${getWaktu()}] ${currentStudentName} (${currentStudentClass}) mengembalikan Buku ${books[i].title}`
  );

  renderBooks();
  renderHistory();
}

// ===== KEMBALIKAN MANUAL =====
function kembalikanManual(i) {
  const ok = confirm(
    `Apakah ${loans[i].nama} yakin ingin mengembalikan Buku "${loans[i].book}"?`
  );
  if (!ok) return;

   history.push(
  `[${getWaktu()}] ${loans[i].nama} (${loans[i].kelas}) mengembalikan Buku ${loans[i].book} (manual)`
);

  loans.splice(i, 1);
  renderBooks();
  renderHistory();
  updateAdmin();
}

// ===== ADMIN =====
function updateAdmin() {
  if (currentRole !== "admin") {
    infoAdmin.classList.add("hidden");
    return;
  }

  infoAdmin.classList.remove("hidden");
  totalDipinjam.textContent = loans.length;
  listPeminjam.innerHTML = "";

  loans.forEach(l => {
    const li = document.createElement("li");
    li.textContent = `${l.nama} (${l.kelas}) - ${l.book}`;
    listPeminjam.appendChild(li);
  });
}

// ===== RIWAYAT =====
function renderHistory() {
  historyList.innerHTML = "";
  history.forEach(h => {
    const li = document.createElement("li");
    li.textContent = h;
    historyList.appendChild(li);
  });
}
