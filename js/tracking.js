const dataPesanan = JSON.parse(localStorage.getItem("bookstorePesanan") || "[]");
const tabelPesanan = document.getElementById("tabelPesanan");
const statusPesanan = ["Menunggu Pembayaran", "Diproses", "Dikirim", "Selesai", "Dibatalkan"];
function daftarNamaBuku(pesanan) {
  if (Array.isArray(pesanan.buku)) return pesanan.buku.map(item => `${item.judul} (${item.jumlah})`).join(", ");
  return pesanan.buku || "-";
}
function tampilkanPesanan() {
  tabelPesanan.innerHTML = "";
  if (!dataPesanan.length) { tabelPesanan.innerHTML = '<tr><td colspan="7">Belum ada pesanan.</td></tr>'; return; }
  dataPesanan.forEach((pesanan, index) => {
    const tr = document.createElement("tr");
    [index + 1, pesanan.id, pesanan.pelanggan, daftarNamaBuku(pesanan), pesanan.tanggal].forEach(value => {
      const td = document.createElement("td"); td.textContent = value; tr.appendChild(td);
    });
    const tdStatus = document.createElement("td");
    const select = document.createElement("select");
    statusPesanan.forEach(status => { const opt = document.createElement("option"); opt.value = status; opt.textContent = status; select.appendChild(opt); });
    select.value = pesanan.status || statusPesanan[0]; tdStatus.appendChild(select); tr.appendChild(tdStatus);
    const tdAksi = document.createElement("td");
    const btn = document.createElement("button"); btn.className = "btn-small"; btn.textContent = "Simpan";
    btn.addEventListener("click", () => {
      const semua = JSON.parse(localStorage.getItem("bookstorePesanan") || "[]");
      const target = semua.find(item => item.id === pesanan.id);
      if (target) target.status = select.value;
      localStorage.setItem("bookstorePesanan", JSON.stringify(semua));
      pesanan.status = select.value; alert("Status pesanan diperbarui.");
    });
    tdAksi.appendChild(btn); tr.appendChild(tdAksi); tabelPesanan.appendChild(tr);
  });
}
tampilkanPesanan();
