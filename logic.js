function kiemTraDuLieu(chuoiBai) {
  // Kiểm tra định dạng
  var dinhDangHopLe =
    /^(\s*([1-9]|[1-4][0-9]|5[0-2])\s*(Bích|Nhép|Rô|Cơ)\s*,\s*){8}(\s*([1-9]|[1-4][0-9]|5[0-2])\s*(Bích|Nhép|Rô|Cơ)\s*)(,\s*([1-9]|[1-4][0-9]|5[0-2])\s*(Bích|Nhép|Rô|Cơ))?$/i.test(
      chuoiBai
    );

  if (!dinhDangHopLe) {
    return false; // Trả về false nếu không phù hợp với định dạng
  }

  // Kiểm tra sự lặp lại của các bộ lá bài
  var mangLai = chuoiBai.split(",").map((item) => item.trim());
  var boBaiDaXuatHien = [];
  for (var i = 0; i < mangLai.length - 2; i++) {
    var boBai = mangLai.slice(i, i + 3);
    var boDaXuatHien = false;
    for (var j = 0; j < boBaiDaXuatHien.length; j++) {
      if (JSON.stringify(boBai) === JSON.stringify(boBaiDaXuatHien[j])) {
        boDaXuatHien = true;
        break;
      }
    }
    if (boDaXuatHien) {
      return false; // Trả về false nếu bộ lá bài đã xuất hiện trước đó
    }
    boBaiDaXuatHien.push(boBai);
  }

  // Kiểm tra giá trị số và loại bài
  for (var k = 0; k < mangLai.length; k++) {
    var so = parseInt(mangLai[k].split(" ")[0]);
    if (isNaN(so) || so < 1 || so > 52) {
      return false; // Trả về false nếu giá trị số không hợp lệ
    }
    var loaiBaiHopLe = ["Bích", "Nhép", "Rô", "Cơ"];
    var loaiBai = mangLai[k].split(" ")[1];
    if (!loaiBaiHopLe.includes(loaiBai)) {
      return false; // Trả về false nếu loại bài không hợp lệ
    }
  }

  // Xác thực độ dài
  if (mangLai.length !== 9 && mangLai.length !== 10) {
    return false; // Trả về false nếu số lá bài không đúng
  }

  return true; // Trả về true nếu tất cả điều kiện đều hợp lệ
}

function chiaBai() {
  var inputBai = document.getElementById("inputBai").value;
  if (kiemTraDuLieu(inputBai)) {
    var chiaBai = inputBai.split(",").map((item) => item.trim());
    var checkSoLuong = kiemTraSoLuongLoaiBai(chiaBai);
    if (checkSoLuong) {
      alert("Không phù hợp!");
      return; // Nếu không phù hợp, dừng lại và không thực hiện tiếp
    }
    sapXepBai(chiaBai);
  } else {
    alert("Chuỗi lá bài không hợp lệ! Vui lòng kiểm tra lại.");
  }
}
function sapXepBai(chiaBai) {
  var boNgang = [];
  var boDoc = [];

  // Sắp xếp mảng lá bài theo giá trị số
  chiaBai.sort((a, b) => {
    var aSo = parseInt(a.split(" ")[0]);
    var bSo = parseInt(b.split(" ")[0]);
    return aSo - bSo;
  });

  // Tìm bộ ngang
  var count = 1;
  for (var i = 0; i < chiaBai.length - 1; i++) {
    var a = parseInt(chiaBai[i].split(" ")[0]);
    var b = parseInt(chiaBai[i + 1].split(" ")[0]);

    if (a === b) {
      count++;
    } else {
      if (count >= 3) {
        var bo = [];
        for (var j = i - count + 1; j <= i; j++) {
          bo.push(chiaBai[j]);
        }
        boNgang.push(bo);
      }
      count = 1;
    }
  }

  // Kiểm tra bộ ngang cuối cùng
  if (count >= 3) {
    var bo = [];
    for (var j = chiaBai.length - count; j < chiaBai.length; j++) {
      bo.push(chiaBai[j]);
    }
    boNgang.push(bo);
  }

  // Tìm bộ dọc
  var currentBoDoc = [];
  for (var i = 0; i < chiaBai.length - 1; i++) {
    var currentCard = chiaBai[i];
    var nextCard = chiaBai[i + 1];

    if (
      currentCard.split(" ")[1] === nextCard.split(" ")[1] &&
      parseInt(currentCard.split(" ")[0]) + 1 ===
        parseInt(nextCard.split(" ")[0])
    ) {
      if (currentBoDoc.length === 0) {
        currentBoDoc.push(currentCard);
      }
      currentBoDoc.push(nextCard);
    } else {
      if (currentBoDoc.length >= 3) {
        boDoc.push(currentBoDoc);
      }
      currentBoDoc = [];
    }
  }

  // Kiểm tra bộ dọc cuối cùng
  if (currentBoDoc.length >= 3) {
    boDoc.push(currentBoDoc);
  }

  // Tính tổng số lá bài trong các bộ ngang và bộ dọc
  var totalCardsInBoNgang = 0;
  for (var k = 0; k < boNgang.length; k++) {
    totalCardsInBoNgang += boNgang[k].length;
  }

  var totalCardsInBoDoc = 0;
  for (var l = 0; l < boDoc.length; l++) {
    totalCardsInBoDoc += boDoc[l].length;
  }

  var diemTraVe = chiaBai.length - totalCardsInBoNgang - totalCardsInBoDoc;

  var coBingo = kiemTraBingo(chiaBai);

  // Hiển thị kết quả
  var boNgangDiv = document.getElementById("boNgang");
  var boDocDiv = document.getElementById("boDoc");
  var diemTraVeDiv = document.getElementById("diemTraVe");

  if (coBingo) {
    alert("Ù, BẠN ĐÃ THẮNG");
  } else if (diemTraVe <= 1) {
    alert("Đây là cách sắp xếp bài tốt!");
  } else if (boNgang.length === 0 && boDoc.length === 0) {
    alert("Móm");
  }

  boNgangDiv.innerHTML = "Bộ ngang: " + JSON.stringify(boNgang);
  boDocDiv.innerHTML = "Bộ dọc: " + JSON.stringify(boDoc);
  diemTraVeDiv.innerHTML = "Điểm trả về: " + diemTraVe;
}

function kiemTraBingo(chiaBai) {
  // Tạo một mảng chứa số lá bài của mỗi loại
  var counts = {
    Nhép: 0,
    Bích: 0,
    Rô: 0,
    Cơ: 0,
  };

  // Đếm số lần xuất hiện của mỗi loại lá bài
  for (var i = 0; i < chiaBai.length; i++) {
    var cardType = chiaBai[i].split(" ")[1];
    counts[cardType]++;
  }

  // Kiểm tra xem có bộ bài nào theo quy tắc "1 Nhép, 2 Nhép, ..., 9 Nhép" không
  if (
    counts["Nhép"] === 9 &&
    counts["Bích"] === 0 &&
    counts["Rô"] === 0 &&
    counts["Cơ"] === 0
  ) {
    alert("Ù, BẠN ĐÃ THẮNG");
    return true; // Trả về true nếu có bingo
  }

  return false; // Trả về false nếu không có bingo
}
function kiemTraSoLuongLoaiBai(chiaBai) {
  var daXuatHien = {};

  for (var i = 0; i < chiaBai.length; i++) {
    var soVaLoai = chiaBai[i].split(" ");
    var so = soVaLoai[0];
    var loai = soVaLoai[1];

    var key = so + loai; // Tạo key duy nhất cho mỗi lá bài

    if (daXuatHien[key]) {
      return true; // Trả về true nếu lá bài đã xuất hiện trước đó trong dãy số
    } else {
      daXuatHien[key] = true; // Đánh dấu lá bài đã xuất hiện
    }
  }
  return false; // Trả về false nếu mỗi loại lá bài chỉ xuất hiện một lần
}
