const KUNCI_BUKU = "bookstoreBuku_v2";
const KUNCI_PESANAN = "bookstorePesanan";
let dataBuku = JSON.parse(localStorage.getItem(KUNCI_BUKU) || "null");
if (!Array.isArray(dataBuku) || dataBuku.length === 0) {
  dataBuku = dataKatalogBuku.map(buku => ({ ...buku }));
  localStorage.setItem(KUNCI_BUKU, JSON.stringify(dataBuku));
}
let keranjang = [];
const formCheckout = document.getElementById("formCheckout");
const tabelKeranjang = document.getElementById("tabelKeranjang");
function formatRupiah(nilai) { return "Rp " + Number(nilai).toLocaleString("id-ID"); }
function tampilkanPilihanBuku() {
  const select = document.getElementById("pilihBuku");
  select.innerHTML = '<option value="">-- Pilih Buku --</option>';
  dataBuku.filter(buku => Number(buku.stok) > 0).forEach(buku => {
    const option = document.createElement("option");
    option.value = buku.id;
    option.textContent = `${buku.judul} - ${formatRupiah(buku.harga)} (Stok: ${buku.stok})`;
    select.appendChild(option);
  });
}
function tampilkanKeranjang() {
  tabelKeranjang.innerHTML = "";
  let total = 0;
  if (!keranjang.length) tabelKeranjang.innerHTML = '<tr><td colspan="6">Keranjang masih kosong.</td></tr>';
  keranjang.forEach((item, index) => {
    const subtotal = item.harga * item.jumlah; total += subtotal;
    const tr = document.createElement("tr");
    [index + 1, item.judul, formatRupiah(item.harga), item.jumlah, formatRupiah(subtotal)].forEach(value => {
      const td = document.createElement("td"); td.textContent = value; tr.appendChild(td);
    });
    const td = document.createElement("td");
    const btn = document.createElement("button"); btn.className = "btn-small danger"; btn.type = "button"; btn.textContent = "Hapus";
    btn.addEventListener("click", () => { keranjang.splice(index, 1); tampilkanKeranjang(); });
    td.appendChild(btn); tr.appendChild(td); tabelKeranjang.appendChild(tr);
  });
  document.getElementById("totalHarga").textContent = "Total: " + formatRupiah(total);
}
formCheckout.addEventListener("submit", event => {
  event.preventDefault();
  const id = Number(document.getElementById("pilihBuku").value);
  const jumlah = Number(document.getElementById("jumlahBuku").value);
  const buku = dataBuku.find(item => Number(item.id) === id);
  if (!buku) { alert("Silakan pilih buku."); return; }
  if (!Number.isInteger(jumlah) || jumlah < 1) { alert("Jumlah tidak valid."); return; }
  const ada = keranjang.find(item => Number(item.id) === id);
  const jumlahDiKeranjang = ada ? ada.jumlah : 0;
  if (jumlah + jumlahDiKeranjang > Number(buku.stok)) { alert("Jumlah melebihi stok."); return; }
  if (ada) ada.jumlah += jumlah;
  else keranjang.push({ id: buku.id, judul: buku.judul, harga: Number(buku.harga), jumlah });
  tampilkanKeranjang();
  document.getElementById("pilihBuku").value = "";
  document.getElementById("jumlahBuku").value = 1;
});
document.getElementById("btnCheckout").addEventListener("click", () => {
  const pelanggan = document.getElementById("namaPelanggan").value.trim();
  const metode = document.getElementById("metodePembayaran").value;
  if (!pelanggan) { alert("Masukkan nama pelanggan."); return; }
  if (!metode) { alert("Pilih metode pembayaran."); return; }
  if (!keranjang.length) { alert("Keranjang masih kosong."); return; }
  for (const item of keranjang) {
    const buku = dataBuku.find(row => Number(row.id) === Number(item.id));
    if (!buku || Number(buku.stok) < item.jumlah) { alert(`Stok ${item.judul} tidak mencukupi.`); return; }
  }
  const pesananLama = JSON.parse(localStorage.getItem(KUNCI_PESANAN) || "[]");
  const dataPesanan = Array.isArray(pesananLama) ? pesananLama : [];
  const total = keranjang.reduce((sum, item) => sum + item.harga * item.jumlah, 0);
  keranjang.forEach(item => {
    const buku = dataBuku.find(row => Number(row.id) === Number(item.id));
    buku.stok = Number(buku.stok) - item.jumlah;
  });
  const pesanan = {
    id: "ORD" + Date.now(), pelanggan, buku: keranjang.map(item => ({ ...item })),
    tanggal: new Date().toLocaleDateString("id-ID"),
    status: "Menunggu Pembayaran", metodePembayaran: metode, total
  };
  dataPesanan.push(pesanan);
  localStorage.setItem(KUNCI_BUKU, JSON.stringify(dataBuku));
  localStorage.setItem(KUNCI_PESANAN, JSON.stringify(dataPesanan));
  alert("Pesanan berhasil dibuat!\nNomor Pesanan: " + pesanan.id);
  keranjang = []; tampilkanKeranjang(); tampilkanPilihanBuku(); formCheckout.reset();
});
tampilkanPilihanBuku();
tampilkanKeranjang();
