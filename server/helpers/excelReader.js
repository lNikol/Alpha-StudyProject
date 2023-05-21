const ExcelJS = require("exceljs");

let workbook = new ExcelJS.Workbook();

// Отправить с бэка user (candidate) а потом взять _id из него

workbook.xlsx.readFile('template.xlsx').then(()=>{
    let workSheet = workbook.getWorksheet(workbook._worksheets[1].name);
    let cards = [];
    workSheet.eachRow({includeEmpty:true}, (row, rowNumber)=>{
        if(rowNumber>1){
            let currRow = workSheet.getRow(rowNumber);
            let card = {
                name:currRow.getCell(1).value,
                descriptions:currRow.getCell(2).value.includes(';')?currRow.getCell(2).value.split(';'):currRow.getCell(2).value,
                tag:currRow.getCell(3).value,
                //user:user._id,
            }
            cards.push(card)
        }
    })
})