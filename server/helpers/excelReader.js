module.exports = function excelReader(filePath) {
  // filePath - путь до файла пользователя на бэке
  const ExcelJS = require("exceljs");
  let workbook = new ExcelJS.Workbook();
  let cards = [];
  return workbook.xlsx.readFile(filePath).then(() => {
    try {
      let workSheet = workbook.getWorksheet(workbook._worksheets[1].name);
      workSheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
        if (rowNumber > 1) {
          let currRow = workSheet.getRow(rowNumber);
          let card = {
            name: currRow.getCell(1).value.toString(),
            descriptions: currRow.getCell(2).value.toString().includes(";")
              ? currRow.getCell(2).value.toString().split(";")
              : currRow.getCell(2).value.toString(),
            tags: currRow.getCell(3).value.toString().includes(";")
              ? currRow.getCell(3).value.toString().split(";")
              : currRow.getCell(3).value.toString(),
          };
          cards.push(card);
        }
      });
    } catch (e) {
      console.log(e);
    }

    return cards;
  });
};
