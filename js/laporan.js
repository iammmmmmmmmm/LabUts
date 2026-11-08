const pesananLaporan = JSON.parse(localStorage.getItem("bookstorePesanan") || "[]");
const rupiahLaporan = nilai => "Rp " + Number(nilai || 0).toLocaleString("id-ID");
const jumlahTransaksi = pesananLaporan.length;
const totalPendapatan = pesananLaporan.filter(p => p.status !== "Dibatalkan").reduce((sum, p) => sum + Number(p.total || 0), 0);
const rekapBuku = {};
let totalBukuTerjual = 0;
pesananLaporan.filter(p => p.status !== "Dibatalkan").forEach(pesanan => {
  const items = Array.isArray(pesanan.buku) ? pesanan.buku : [{ judul: pesanan.buku || "Buku", jumlah: pesanan.jumlah || 1, harga: pesanan.total || 0 }];
  items.forEach(item => {
    const qty = Number(item.jumlah || 1); const nilai = qty * Number(item.harga || 0);
    totalBukuTerjual += qty;
    if (!rekapBuku[item.judul]) rekapBuku[item.judul] = { jumlah: 0, total: 0 };
    rekapBuku[item.judul].jumlah += qty; rekapBuku[item.judul].total += nilai;
  });
});
document.getElementById("jumlahTransaksi").textContent = jumlahTransaksi;
document.getElementById("jumlahBukuTerjual").textContent = totalBukuTerjual;
document.getElementById("totalPendapatan").textContent = rupiahLaporan(totalPendapatan);
const tbodyLaporan = document.getElementById("tabelLaporanBuku");
const daftarRekap = Object.entries(rekapBuku);
if (!daftarRekap.length) tbodyLaporan.innerHTML = '<tr><td colspan="4">Belum ada penjualan.</td></tr>';
else daftarRekap.forEach(([judul, data], index) => {
  const tr = document.createElement("tr");
  [index + 1, judul, data.jumlah, rupiahLaporan(data.total)].forEach(value => { const td = document.createElement("td"); td.textContent = value; tr.appendChild(td); });
  tbodyLaporan.appendChild(tr);
});
