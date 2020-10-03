function exportToCSV(exportName){
    let encodedUri = encodeURI(csvContent)
    let link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    let date = new Date()
    let fileName = exportName +"."+ [date.getMonth() + 1,date.getDate(),date.getFullYear()].join('.') + ".csv"
    link.setAttribute("download", fileName)
    document.body.appendChild(link)
    link.click(); 
}