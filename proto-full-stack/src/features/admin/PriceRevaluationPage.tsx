import { useEffect, useState } from 'react'
import { FileSpreadsheet, Upload } from 'lucide-react'
import AdminHeader from './AdminHeader'
import { productWebserviceCatalog } from '../../shared'

type Row={speciesId:number;price:number}
type Props={onLoad?:()=>Promise<Row[]>;onApply?:(rows:Row[])=>Promise<{updated:number}>;onRead?:(file:File)=>Promise<Row[]>;onTemplate?:()=>Promise<void>}
export default function PriceRevaluationPage({onLoad,onApply,onRead,onTemplate}:Props){
  const [rows,setRows]=useState<Row[]>([])
  const [current,setCurrent]=useState<Row[]>([])
  const [error,setError]=useState('')
  const [message,setMessage]=useState('')
  const [pending,setPending]=useState(false)
  useEffect(()=>{onLoad?.().then(setCurrent).catch(error=>setError(error.message))},[])
  const template=async()=>{try{await onTemplate?.()}catch{setError('No se pudo generar la plantilla.')}}
  const readFile=async(file?:File)=>{
    setRows([]);setError('');setMessage('')
    if(!file)return
    setPending(true)
    try{if(!onRead)throw new Error('La importación no está configurada.');setRows(await onRead(file))}
    catch(error){setError(error instanceof Error?error.message:'No se pudo leer la planilla.')}
    finally{setPending(false)}
  }
  return <main className="admin-page"><AdminHeader eyebrow="Actualización masiva" title="Revalorización de precios" description="Importá precios recomendados para la lista inteligente."/>
    <section className="revaluation-card">{!onRead&&<p>La importación de precios no está conectada en esta versión.</p>}<FileSpreadsheet size={38}/><h2>Subir archivo Excel</h2><p>Columnas: especie_id y precio. Revisá la vista previa antes de aplicar.</p>
      <button type="button" disabled={!onTemplate} onClick={template}>Descargar plantilla y catálogo de especies</button>
      <label className="excel-upload"><Upload size={19}/><span>Seleccionar archivo .xlsx</span><input type="file" accept=".xlsx" disabled={pending||!onRead} onChange={event=>readFile(event.target.files?.[0])}/></label>
      {error&&<p role="alert" className="field-error">{error}</p>}{message&&<p role="status">{message}</p>}
      {rows.length>0&&<><h3>Vista previa: {rows.length} precios</h3><table><thead><tr><th>Especie</th><th>Precio recomendado</th></tr></thead><tbody>{rows.map(row=><tr key={row.speciesId}><td>{productWebserviceCatalog.find(p=>p.id===row.speciesId)?.species}</td><td>${row.price.toFixed(2)}</td></tr>)}</tbody></table></>}
      <button className="primary-submit" disabled={pending||!rows.length||!onApply} onClick={async()=>{setPending(true);setError('');try{const result=await onApply!(rows);setMessage(`${result.updated} precios actualizados.`);setRows([]);setCurrent(await onLoad!())}catch(error){setError(error instanceof Error?error.message:'No se pudo guardar.')}finally{setPending(false)}}}>{pending?'Procesando…':'Aplicar precios recomendados'}</button>
      {current.length>0&&<><h3>Precios vigentes</h3><table><tbody>{current.map(row=><tr key={row.speciesId}><td>{productWebserviceCatalog.find(p=>p.id===row.speciesId)?.species}</td><td>${Number(row.price).toFixed(2)}</td></tr>)}</tbody></table></>}
    </section>
  </main>
}
