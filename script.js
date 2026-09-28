// Modal Awal Kas Kecil (Imprest/Fixed Fund System)
const SALDO_AWAL = 2000000; // Contoh modal kas kecil Rp 2.000.000

let transaksiList = [
  {
    tanggal: "2026-09-01",
    keterangan: "Pembentukan Kas Kecil",
    kategori: "Kas Kecil",
    jumlah: SALDO_AWAL,
    tipe: "KAS_AWAL"
  }
];

// Pindah Tab / Menu Navigasi
function switchTab(tabId) {
  document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.sidebar nav li').forEach(el => el.classList.remove('active'));
  
  document.getElementById(tabId).classList.add('active');
  event.currentTarget.classList.add('active');
}

// Format Rupiah
function formatRupiah(angka) {
  return "Rp " + Number(angka).toLocaleString("id-ID");
}

// Tangani Submit Form Transaksi
document.getElementById('form-transaksi').addEventListener('submit', function(e) {
  e.preventDefault();

  const tanggal = document.getElementById('tgl-transaksi').value;
  const keterangan = document.getElementById('keterangan').value;
  const kategori = document.getElementById('kategori-akun').value;
  const jumlah = parseFloat(document.getElementById('jumlah').value);

  transaksiList.push({
    tanggal,
    keterangan,
    kategori,
    jumlah,
    tipe: "PENGELUARAN"
  });

  alert("Transaksi berhasil dicatat!");
  this.reset();

  updateUI();
});

// Update Tampilan UI (Dashboard, Jurnal, Buku Besar, Laporan)
function updateUI() {
  let totalPengeluaran = 0;

  // 1. Hitung Total Pengeluaran
  transaksiList.forEach(t => {
    if (t.tipe === "PENGELUARAN") totalPengeluaran += t.jumlah;
  });

  const saldoSisa = SALDO_AWAL - totalPengeluaran;

  document.getElementById('total-saldo').innerText = formatRupiah(saldoSisa);
  document.getElementById('total-pengeluaran').innerText = formatRupiah(totalPengeluaran);

  // 2. Render Jurnal Umum
  const tbodyJurnal = document.getElementById('tbody-jurnal');
  tbodyJurnal.innerHTML = "";

  transaksiList.forEach(t => {
    if (t.tipe === "KAS_AWAL") {
      tbodyJurnal.innerHTML += `
        <tr>
          <td>${t.tanggal}</td>
          <td><strong>Kas Kecil</strong></td>
          <td>101</td>
          <td>${formatRupiah(t.jumlah)}</td>
          <td>-</td>
        </tr>
        <tr>
          <td></td>
          <td class="debet-indent">Kas / Bank</td>
          <td>100</td>
          <td>-</td>
          <td>${formatRupiah(t.jumlah)}</td>
        </tr>
      `;
    } else {
      tbodyJurnal.innerHTML += `
        <tr>
          <td>${t.tanggal}</td>
          <td><strong>${t.kategori}</strong> (${t.keterangan})</td>
          <td>500</td>
          <td>${formatRupiah(t.jumlah)}</td>
          <td>-</td>
        </tr>
        <tr>
          <td></td>
          <td class="debet-indent">Kas Kecil</td>
          <td>101</td>
          <td>-</td>
          <td>${formatRupiah(t.jumlah)}</td>
        </tr>
      `;
    }
  });

  // 3. Render Buku Besar Kas Kecil
  const tbodyBukuBesar = document.getElementById('tbody-bukubesar');
  tbodyBukuBesar.innerHTML = "";
  let runningSaldo = 0;

  transaksiList.forEach(t => {
    let debet = 0, kredit = 0;
    if (t.tipe === "KAS_AWAL") {
      debet = t.jumlah;
      runningSaldo += debet;
    } else {
      kredit = t.jumlah;
      runningSaldo -= kredit;
    }

    tbodyBukuBesar.innerHTML += `
      <tr>
        <td>${t.tanggal}</td>
        <td>${t.keterangan}</td>
        <td>${debet ? formatRupiah(debet) : '-'}</td>
        <td>${kredit ? formatRupiah(kredit) : '-'}</td>
        <td><strong>${formatRupiah(runningSaldo)}</strong></td>
      </tr>
    `;
  });

  // 4. Render Laporan Beban
  const listLaporan = document.getElementById('list-laporan-beban');
  listLaporan.innerHTML = "";

  const bebanMap = {};
  transaksiList.forEach(t => {
    if (t.tipe === "PENGELUARAN") {
      bebanMap[t.kategori] = (bebanMap[t.kategori] || 0) + t.jumlah;
    }
  });

  for (const [kategori, total] of Object.entries(bebanMap)) {
    listLaporan.innerHTML += `
      <li>
        <span>${kategori}</span>
        <strong>${formatRupiah(total)}</strong>
      </li>
    `;
  }

  document.getElementById('grand-total-beban').innerText = formatRupiah(totalPengeluaran);
}

// Jalankan saat pertama kali dibuka
updateUI();