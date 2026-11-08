const penggunaAktif = JSON.parse(localStorage.getItem("bookstorePenggunaAktif") || "null");
const namaPengguna = document.getElementById("namaPengguna");
const greeting = document.getElementById("greeting");
if (penggunaAktif) {
  if (namaPengguna) namaPengguna.textContent = "Halo, " + penggunaAktif.nama + ". Selamat bekerja!";
  if (greeting) greeting.textContent = "Selamat Datang!";
}
function logout() {
  localStorage.removeItem("bookstorePenggunaAktif");
  window.location.href = "login.html";
}
