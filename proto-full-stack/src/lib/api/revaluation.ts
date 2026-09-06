import { productWebserviceCatalog } from '../../shared'
import { api } from './client'
export type PriceRow={speciesId:number;price:number}
export const loadPrices=async()=> (await api('admin/prices')).items
export const applyPrices=(rows:PriceRow[])=>api('admin/prices',{method:'POST',body:JSON.stringify({rows})})
export async function downloadPriceTemplate(){
  const ExcelJS=await import('exceljs')
  const workbook=new ExcelJS.Workbook();const sheet=workbook.addWorksheet('Precios')
  sheet.addRow(['especie_id','precio']);sheet.addRow([1,58.50])
  const catalog=workbook.addWorksheet('Especies');catalog.addRow(['especie_id','nombre']);productWebserviceCatalog.forEach(p=>catalog.addRow([p.id,p.species]))
  const buffer=await workbook.xlsx.writeBuffer();const url=URL.createObjectURL(new Blob([buffer as BlobPart],{type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'}))
  const link=document.createElement('a');link.href=url;link.download='plantilla-precios.xlsx';link.click();setTimeout(()=>URL.revokeObjectURL(url),1000)
}
export async function readPriceFile(file:File):Promise<PriceRow[]>{
  if(!file.name.toLowerCase().endsWith('.xlsx')||file.size>5*1024*1024)throw new Error('Seleccioná un archivo .xlsx de hasta 5 MB.')
  const ExcelJS=await import('exceljs');const workbook=new ExcelJS.Workbook();await workbook.xlsx.load(await file.arrayBuffer())
  const sheet=workbook.worksheets[0]
  if(!sheet||sheet.getCell('A1').text.trim()!=='especie_id'||sheet.getCell('B1').text.trim()!=='precio')throw new Error('Usá la plantilla con columnas especie_id y precio.')
  if(sheet.rowCount>1001)throw new Error('La planilla admite hasta 1000 filas.')
  const next:PriceRow[]=[];const seen=new Set<number>()
  sheet.eachRow((row,index)=>{
    if(index===1)return
    const speciesId=Number(row.getCell(1).value),price=Number(row.getCell(2).value)
    if(!productWebserviceCatalog.some(p=>p.id===speciesId)||seen.has(speciesId)||!Number.isFinite(price)||price<=0||price>9_999_999_999.99||Math.abs(price*100-Math.round(price*100))>0.0001)throw new Error(`Revisá la especie y el precio de la fila ${index}.`)
    seen.add(speciesId);next.push({speciesId,price})
  })
  if(!next.length)throw new Error('La planilla está vacía.')
  return next
}
