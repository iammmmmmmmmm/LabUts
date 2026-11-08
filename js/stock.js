const KUNCI_BUKU = "bookstoreBuku_v2";
let dataBuku = JSON.parse(localStorage.getItem(KUNCI_BUKU) || "null");
if (!Array.isArray(dataBuku) || dataBuku.length === 0) {
  dataBuku = dataKatalogBuku.map(buku => ({ ...buku }));
  localStorage.setItem(KUNCI_BUKU, JSON.stringify(dataBuku));
}
const formBuku = document.getElementById("formBuku");
const tabelBuku = document.getElementById("tabelBuku");
function rupiah(nilai) { return "Rp " + Number(nilai).toLocaleString("id-ID"); }
function simpanBuku() { localStorage.setItem(KUNCI_BUKU, JSON.stringify(dataBuku)); }
function tampilkanBuku() {
  tabelBuku.innerHTML = "";
  if (!dataBuku.length) {
    tabelBuku.innerHTML = '<tr><td colspan="6" class="empty">Belum ada data buku.</td></tr>';
    return;
  }
  dataBuku.forEach((buku, index) => {
    const tr = document.createElement("tr");
    [index + 1, buku.judul, buku.penulis, rupiah(buku.harga), buku.stok].forEach(value => {
      const td = document.createElement("td"); td.textContent = value; tr.appendChild(td);
    });
    const aksi = document.createElement("td");
    const edit = document.createElement("button"); edit.className = "btn-small"; edit.textContent = "Edit";
    edit.addEventListener("click", () => editBuku(buku.id));
    const hapus = document.createElement("button"); hapus.className = "btn-small danger"; hapus.textContent = "Hapus";
    hapus.addEventListener("click", () => hapusBuku(buku.id));
    aksi.append(edit, hapus); tr.appendChild(aksi); tabelBuku.appendChild(tr);
  });
}
function resetForm() {
  formBuku.reset(); document.getElementById("idBuku").value = "";
  document.getElementById("tombolSimpan").textContent = "Tambah Buku";
  document.getElementById("tombolBatal").hidden = true;
}
function editBuku(id) {
  const buku = dataBuku.find(item => item.id === id); if (!buku) return;
  document.getElementById("idBuku").value = buku.id;
  document.getElementById("judul").value = buku.judul;
  document.getElementById("penulis").value = buku.penulis;
  document.getElementById("harga").value = buku.harga;
  document.getElementById("stok").value = buku.stok;
  document.getElementById("tombolSimpan").textContent = "Simpan Perubahan";
  document.getElementById("tombolBatal").hidden = false;
  window.scrollTo({ top: 0, behavior: "smooth" });
}
function hapusBuku(id) {
  if (!confirm("Yakin ingin menghapus buku ini?")) return;
  dataBuku = dataBuku.filter(item => item.id !== id); simpanBuku(); tampilkanBuku();
}
formBuku.addEventListener("submit", event => {
  event.preventDefault();
  const id = document.getElementById("idBuku").value;
  const bukuBaru = {
    judul: document.getElementById("judul").value.trim(),
    penulis: document.getElementById("penulis").value.trim(),
    harga: Number(document.getElementById("harga").value),
    stok: Number(document.getElementById("stok").value)
  };
  if (!bukuBaru.judul || !bukuBaru.penulis || bukuBaru.harga <= 0 || bukuBaru.stok < 0) {
    alert("Periksa kembali data buku."); return;
  }
  if (id) {
    const index = dataBuku.findIndex(item => item.id === Number(id));
    if (index !== -1) dataBuku[index] = { ...dataBuku[index], ...bukuBaru };
  } else {
    bukuBaru.id = dataBuku.length ? Math.max(...dataBuku.map(item => Number(item.id))) + 1 : 1;
    dataBuku.push(bukuBaru);
  }
  simpanBuku(); resetForm(); tampilkanBuku();
});
document.getElementById("tombolBatal").addEventListener("click", resetForm);
tampilkanBuku();
