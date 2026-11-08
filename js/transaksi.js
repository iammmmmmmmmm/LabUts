const pesananTransaksi = JSON.parse(localStorage.getItem("bookstorePesanan") || "[]");
const tabelTransaksi = document.getElementById("tabelTransaksi");
const rupiahTransaksi = nilai => "Rp " + Number(nilai || 0).toLocaleString("id-ID");
function bukuTransaksi(pesanan) {
  if (Array.isArray(pesanan.buku)) return {
    nama: pesanan.buku.map(item => item.judul).join(", "),
    jumlah: pesanan.buku.reduce((sum, item) => sum + Number(item.jumlah || 0), 0)
  };
  return { nama: pesanan.buku || "-", jumlah: Number(pesanan.jumlah || 1) };
}
if (!pesananTransaksi.length) tabelTransaksi.innerHTML = '<tr><td colspan="9">Belum ada transaksi.</td></tr>';
else pesananTransaksi.forEach((pesanan, index) => {
  const info = bukuTransaksi(pesanan);
  const tr = document.createElement("tr");
  [index + 1, pesanan.id, pesanan.pelanggan, info.nama, info.jumlah, pesanan.metodePembayaran || "-", rupiahTransaksi(pesanan.total), pesanan.tanggal, pesanan.status].forEach(value => {
    const td = document.createElement("td"); td.textContent = value; tr.appendChild(td);
  });
  tabelTransaksi.appendChild(tr);
});
