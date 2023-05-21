const Excel = require('exceljs');

export default function createCards(filePath){
    let workbook = new Excel.Workbook();
    workbook.xlsx.readFile(filePath).then(()=>{
        let workSheet = workbook.getWorksheet(workbook._worksheets[1].name);
        let cards = [];
        workSheet.eachRow({includeEmpty:true}, (row, rowNumber)=>{
            if(rowNumber>1){
                let currRow = workSheet.getRow(rowNumber);
                let card = {
                    name:currRow.getCell(1).value?currRow.getCell(1).value:null,
                    descriptions:currRow.getCell(2).value.includes(';')?currRow.getCell(2).value.split(';'):currRow.getCell(2).value,
                    tag:currRow.getCell(3).value?currRow.getCell(3).value:null,
                    data: new Date().getTime()
                }
                cards.push(card)
            }
        })
    })
}