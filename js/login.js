const formLogin = document.getElementById("formLogin");
if (formLogin) {
  formLogin.addEventListener("submit", function (event) {
    event.preventDefault();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const pengguna = dataPengguna.find(user => user.email === email && user.password === password);
    if (pengguna) {
      localStorage.setItem("bookstorePenggunaAktif", JSON.stringify(pengguna));
      window.location.href = "dashboard.html";
    } else {
      document.getElementById("pesanLogin").textContent = "Email atau password salah.";
    }
  });
}
