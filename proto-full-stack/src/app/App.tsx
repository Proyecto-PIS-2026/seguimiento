'use client'

import { useEffect, useRef, useState } from 'react'
import { products, staticViewRoutes, slugify } from '../shared'
import Header from '../shared/layout/Header'
import Board from '../features/board/Board'
import Login from '../features/auth/Login'
import PasswordRecovery from '../features/auth/PasswordRecovery'
import ResetPasswordPage from '../features/auth/ResetPasswordPage'
import TwoFactorSetup from '../features/auth/TwoFactorSetup'
import ActorDirectory from '../features/actors/ActorDirectory'
import ActorPanel from '../features/actors/ActorPanel'
import ProviderMarket from '../features/actors/ProviderMarket'
import VacationPage from '../features/actors/VacationPage'
import AbsentOperatorPage from '../features/actors/AbsentOperatorPage'
import ProductPanel from '../features/products/ProductPanel'
import PublicationPanel from '../features/products/PublicationPanel'
import EditPrice from '../features/products/EditPrice'
import AdminManagementPage from '../features/admin/AdminManagementPage'
import AdminEditorPanel from '../features/admin/AdminEditorPanel'
import AdminWorkspace from '../features/admin/AdminWorkspace'
import AdminSmartListPage from '../features/admin/AdminSmartListPage'
import SmartRecommendationPanel from '../features/admin/SmartRecommendationPanel'
import RecoveryRequestsPage from '../features/admin/RecoveryRequestsPage'
import PriceRevaluationPage from '../features/admin/PriceRevaluationPage'
import ConfirmModal from '../shared/feedback/ConfirmModal'
import OperationNotification from '../shared/feedback/OperationNotification'
import { OPERATION_NOTIFICATION_EVENT, showOperationNotification, type OperationNotificationDetail } from '../shared/feedback/operationNotifications'
import LinearNavigationLoader from '../shared/navigation/LinearNavigationLoader'
import { LINEAR_LOADER_EVENT } from '../shared/navigation/linearLoader'
import { getAccessiblePath, getHomePath } from '../shared/auth/access'
import { loadPrices,applyPrices,readPriceFile,downloadPriceTemplate } from '../lib/api/revaluation'
import { api, ApiError, saveActorRecord } from '../lib/api/client'
import { login, logout, type AuthSession } from '../lib/api/session'
import { getRouteDocumentTitle } from '../lib/metadata/routeTitles'

type Props = { initialPath:string; initialSession:AuthSession|null }
const emptySnapshot={operators:[],producers:[],products:[],producerProducts:[],smartItems:[]}

export default function App({initialPath,initialSession}:Props){
  const [session,setSession]=useState(initialSession)
  const [path,setPath]=useState(initialPath)
  const [snapshot,setSnapshot]=useState<any>(emptySnapshot)
  const [mine,setMine]=useState<any>(null)
  const [adminOperators,setAdminOperators]=useState<any[]>([])
  const [adminProducers,setAdminProducers]=useState<any[]>([])
  const [requests,setRequests]=useState<any[]>([])
  const [ready,setReady]=useState(false)
  const [loadError,setLoadError]=useState('')
  const [reloadKey,setReloadKey]=useState(0)
  const [editor,setEditor]=useState<any>(null)
  const [publication,setPublication]=useState<any>(null)
  const [smartEditor,setSmartEditor]=useState<any>(null)
  const [deleteTarget,setDeleteTarget]=useState<any>(null)
  const [drawers,setDrawers]=useState<any[]>([])
  const [notifications,setNotifications]=useState<Array<OperationNotificationDetail & {id:number}>>([])
  const [navigating,setNavigating]=useState(false)
  const sequence=useRef(0)
  const loadSequence=useRef(0)
  const navTimer=useRef<ReturnType<typeof setTimeout>|null>(null)
  const role=session?.role??null

  const refresh=async(current=session)=>{
    const sequence=++loadSequence.current
    const [market,own,operators,producers,recovery]=await Promise.all([
      api('market'),current&&current.role!=='admin'?api('market/mine'):null,
      current?.role==='admin'?api('operators'):null,
      current?.role==='admin'?api('producers'):null,
      current?.role==='admin'?api('recovery'):null,
    ])
    if(sequence!==loadSequence.current)return
    setSnapshot(market);setMine(own);setAdminOperators(operators?.items??[]);setAdminProducers(producers?.items??[]);setRequests(recovery?.items??[])
    setReady(true);setLoadError('')
  }
  const feedback=(error:unknown)=>showOperationNotification('error',error instanceof Error?error.message:'No se pudo completar la operación.')
  useEffect(()=>{
    setReady(false)
    refresh().catch(error=>{
      if(error instanceof ApiError&&error.status===401){setSession(null);setPath('/ingresar');window.history.replaceState({},'','/ingresar')}
      else setLoadError(error.message)
    })
    return ()=>{loadSequence.current++}
  },[session?.role,session?.actorId,reloadKey])
  useEffect(()=>{
    const listener=(event:Event)=>{sequence.current++;setNotifications(current=>[...current,{...(event as CustomEvent<OperationNotificationDetail>).detail,id:sequence.current}])}
    window.addEventListener(OPERATION_NOTIFICATION_EVENT,listener)
    const loader=()=>{setNavigating(true);if(navTimer.current)clearTimeout(navTimer.current);navTimer.current=setTimeout(()=>setNavigating(false),650)}
    window.addEventListener(LINEAR_LOADER_EVENT,loader)
    return ()=>{window.removeEventListener(OPERATION_NOTIFICATION_EVENT,listener);window.removeEventListener(LINEAR_LOADER_EVENT,loader);if(navTimer.current)clearTimeout(navTimer.current)}
  },[])
  useEffect(()=>{
    const onPop=()=>{const next=getAccessiblePath(window.location.pathname,role);if(next!==window.location.pathname)window.history.replaceState({},'',next);setPath(next);setDrawers([]);setPublication(null);setEditor(null)}
    window.addEventListener('popstate',onPop)
    return ()=>window.removeEventListener('popstate',onPop)
  },[role])
  useEffect(()=>{document.title=getRouteDocumentTitle(path);if(path==='/lista-inteligente'&&ready)document.getElementById('inteligente')?.scrollIntoView()},[path,ready])
  const navigate=(view:string,override?:string)=>{
    const next=getAccessiblePath(override??staticViewRoutes[view]??'/',role)
    window.history.pushState({},'',next);setPath(next);setDrawers([]);setPublication(null);setEditor(null);window.scrollTo(0,0)
  }
  const changeSession=(next:AuthSession|null)=>{
    setSession(next);setMine(null);setDrawers([]);setPublication(null);setEditor(null);setSmartEditor(null);setDeleteTarget(null)
    const nextPath=getHomePath(next?.role??null);window.history.replaceState({},'',nextPath);setPath(nextPath)
  }
  const openProduct=(product:any,actorRole='operator')=>{
    const source=product.sourceProductId??product.id
    const fresh=(actorRole==='producer'?snapshot.producerProducts:snapshot.products).find(p=>p.id===source)??{...product,id:source,persisted:true,operators:[]}
    if(window.matchMedia('(min-width:761px)').matches)navigate('productDetail',`/productos/${source}/${actorRole==='producer'?'productores':'operadores'}`)
    else setDrawers(current=>[...current,{id:++sequence.current,type:'product',product:fresh,role:actorRole}])
  }
  const openActor=(entry:any,_product?:any,actorRole='operator')=>{
    if(window.matchMedia('(min-width:761px)').matches)navigate('provider',`/${actorRole==='producer'?'productores':'operadores'}/${entry.id}`)
    else setDrawers(current=>[...current,{id:++sequence.current,type:'actor',entry,role:actorRole}])
  }
  const savePublication=async(product:any,id?:number)=>{
    const payload={...product,id}
    const saved=await api('market/mine',{method:'POST',body:JSON.stringify(payload)})
    await refresh();return saved
  }
  const saveSettings=async(data:any)=>{await api('market/mine',{method:'PATCH',body:JSON.stringify(data)});await refresh()}
  const removePublication=async(id:number,speciesId?:number)=>{await api(`market/mine?${speciesId===undefined?`id=${id}`:`speciesId=${speciesId}`}`,{method:'DELETE'});await refresh()}
  const saveActor=async(item:any)=>{await saveActorRecord(editor.kind,item);await refresh();setEditor(null)}
  const removeAdminItem=async()=>{
    const target=deleteTarget
    await api(target.kind==='smart'?`admin/smart?id=${target.item.id}`:`${target.kind==='operator'?'operators':'producers'}/${target.item.id}`,{method:'DELETE'})
    await refresh();setDeleteTarget(null);showOperationNotification('success','Registro eliminado correctamente.')
  }
  const saveSmart=async(item:any)=>{await api('admin/smart',{method:'POST',body:JSON.stringify({...item,id:smartEditor?.item?.id})});await refresh();setSmartEditor(null)}
  const resolveRequest=async(id:number)=>{try{await api('recovery',{method:'PATCH',body:JSON.stringify({id})});await refresh();showOperationNotification('success','Solicitud marcada como resuelta.')}catch(error){feedback(error)}}

  let view=path==='/lista-inteligente'?'board':Object.entries(staticViewRoutes).find(([,value])=>value===path)?.[0]??'notFound'
  const actorMatch=path.match(/^\/(operadores|productores)\/([^/]+)$/)
  const actor=actorMatch?(actorMatch[1]==='operadores'?snapshot.operators:snapshot.producers).find(x=>x.id===actorMatch[2]||slugify(x.name)===actorMatch[2]):null
  if(actor)view=actor.role==='operator'?'actorMarket':'producerDetail'
  const detailMatch=path.match(/^\/productos\/(\d+)\/(operadores|productores)$/)
  const detailRole=detailMatch?.[2]==='productores'?'producer':'operator'
  const detailProduct=detailMatch?(detailRole==='producer'?snapshot.producerProducts:snapshot.products).find(x=>x.id===Number(detailMatch[1])):null
  if(detailMatch)view='productDetail'
  const editMatch=path.match(/^\/(operador|productor)\/mercado\/(\d+)\/editar$/)
  const editingProduct=editMatch?mine?.items.find(x=>x.id===Number(editMatch[2])):null
  if(editMatch)view='editPrice'
  const publicProduct=detailProduct??(detailMatch?products.find(x=>x.id===Number(detailMatch[1])):null)
  useEffect(()=>{if(actor)document.title=`${actor.name} | MFH - UAM`},[actor?.id,actor?.name])
  const renderOwnMarket=()=>mine&&<ProviderMarket key={session?.actorId} operator={mine.profile} items={mine.items} editable productRole={role} eyebrow="Mi mercado" schedule={mine.schedule} vacation={mine.vacation} onSaveSchedule={schedule=>saveSettings({schedule})} onCreate={product=>setPublication({product})} onSavePublication={savePublication} onRemove={removePublication} onOpenProduct={product=>openProduct(product,role)} />
  const renderActorMarket=()=>actor&&(actor.available===false?<AbsentOperatorPage operator={actor} vacation={actor.vacation} onOpenSubstitute={()=>actor.vacation.substitute&&navigate('provider',`/operadores/${actor.vacation.substitute.id}`)}/>:<ProviderMarket key={actor.id} operator={actor} originProduct={actor.product} items={actor.publishedProducts} schedule={actor.schedule} vacation={actor.vacation} productRole={actor.role} onOpenProduct={product=>openProduct(product,actor.role)}/>)
  const authView=['login','recovery','resetPassword','twoFactorSetup'].includes(view)

  return <div className="app-shell">
    <Header key={role??'public'} view={view} currentPath={path} onNavigate={navigate} role={role} username={session?.name??session?.username} onLogout={async()=>{try{await logout();changeSession(null)}catch(error){feedback(error)}}}/>
    <LinearNavigationLoader active={navigating||(!ready&&!authView)}/>
    <div className="operation-notification-stack" aria-live="polite">{notifications.map(notification=><OperationNotification key={notification.id} type={notification.type} message={notification.message} onDismiss={()=>setNotifications(current=>current.filter(x=>x.id!==notification.id))}/>)}</div>
    {!authView&&!ready&&(loadError?<main className="admin-page"><p role="alert">{loadError}</p><button onClick={()=>{setLoadError('');setReloadKey(x=>x+1)}}>Reintentar</button></main>:<main className="admin-page"><p role="status">Cargando datos…</p></main>)}
    {view==='login'&&<Login onLogin={async(username,password)=>changeSession(await login(username,password))} onRecover={()=>navigate('recovery')}/>}
    {view==='recovery'&&<PasswordRecovery onBack={()=>navigate('login')} onSubmit={data=>api('recovery',{method:'POST',body:JSON.stringify(data)})}/>}
    {view==='resetPassword'&&<ResetPasswordPage onComplete={()=>navigate('recovery')}/>}
    {view==='twoFactorSetup'&&<TwoFactorSetup onComplete={()=>navigate('login')}/>}
    {ready&&<>
      {view==='board'&&<Board items={snapshot.products} smartItems={snapshot.smartItems} onOpenProduct={openProduct}/>}
      {view==='producerBoard'&&<Board producerMode items={snapshot.producerProducts} onOpenProduct={openProduct}/>}
      {view==='operators'&&<ActorDirectory eyebrow="Mercado de hoy" title="Operadores" description="Puestos de la UAM y sus publicaciones." entries={snapshot.operators} filterLabel="Nave" getFilterValue={entry=>entry.place.split(' · ')[0]} showLocationAction showWhatsapp highlightPlace onOpen={entry=>openActor(entry)}/>}
      {view==='producers'&&<ActorDirectory eyebrow="Oferta de origen" title="Productores" description="Producción disponible para los operadores." entries={snapshot.producers} filterLabel="Departamento" getFilterValue={entry=>entry.place.split(' · ')[0]} showWhatsapp onOpen={entry=>openActor(entry,null,'producer')}/>}
      {view==='productDetail'&&(publicProduct?<ProductPanel key={path} asPage product={detailProduct??{...publicProduct,persisted:true,operators:[]}} actorRole={detailRole} onOpenProvider={openActor}/>:<main className="admin-page">No se encontró el producto.</main>)}
      {(view==='provider'||view==='producerMarket')&&renderOwnMarket()}
      {(view==='actorMarket'||view==='producerDetail')&&renderActorMarket()}
      {view==='vacations'&&mine&&<VacationPage value={mine.vacation} replacements={snapshot.operators.filter(x=>x.id!==session?.actorId)} onSave={async vacation=>{await saveSettings({vacation});navigate('provider')}}/>}
      {view==='absentProvider'&&!mine&&<main className="admin-page">Seleccioná un operador en el directorio para consultar su disponibilidad.</main>}
      {view==='absentProvider'&&mine&&<AbsentOperatorPage operator={mine.profile} vacation={mine.vacation} onOpenSubstitute={()=>mine.vacation.substitute&&navigate('provider',`/operadores/${mine.vacation.substitute.id}`)}/>}
      {view==='publish'&&<><main className="admin-page"><h1>Publicar mercadería</h1></main><PublicationPanel items={mine?.items??[]} onClose={()=>navigate('provider')} onSave={async(matched,draft)=>{await savePublication(draft,matched?.id);navigate('provider')}}/></>}
      {view==='editPrice'&&(editingProduct?<EditPrice product={editingProduct} onSave={async product=>{await savePublication(product,editingProduct.id);navigate(role==='producer'?'producerMarket':'provider')}} onCancel={()=>navigate(role==='producer'?'producerMarket':'provider')}/>:<main className="admin-page">La publicación no existe en tu mercado.</main>)}
      {view.startsWith('admin')&&<AdminWorkspace activeView={view} onNavigate={navigate}>
        {(view==='adminOperators'||view==='adminProducers')&&<AdminManagementPage key={view} kind={view==='adminOperators'?'operator':'producer'} items={view==='adminOperators'?adminOperators:adminProducers} onCreate={()=>setEditor({kind:view==='adminOperators'?'operator':'producer',item:null})} onEdit={item=>setEditor({kind:view==='adminOperators'?'operator':'producer',item})} onDelete={item=>setDeleteTarget({kind:view==='adminOperators'?'operator':'producer',item})}/>}
        {view==='adminSmartList'&&<AdminSmartListPage items={snapshot.smartItems} onCreate={()=>setSmartEditor({item:null})} onEdit={item=>setSmartEditor({item})} onDelete={item=>setDeleteTarget({kind:'smart',item})}/>}
        {view==='adminRecovery'&&<RecoveryRequestsPage items={requests} onResolve={resolveRequest}/>}
        {view==='adminRevaluation'&&<PriceRevaluationPage onLoad={loadPrices} onApply={applyPrices} onRead={readPriceFile} onTemplate={downloadPriceTemplate}/>}
      </AdminWorkspace>}
      {view==='notFound'&&<main className="admin-page"><h1>Página no encontrada</h1><button onClick={()=>navigate('board',getHomePath(role))}>Volver al inicio</button></main>}
    </>}
    {drawers.map(drawer=>drawer.type==='product'?<ProductPanel key={drawer.id} product={drawer.product} actorRole={drawer.role} onClose={()=>setDrawers(current=>current.filter(x=>x.id!==drawer.id))} onOpenProvider={openActor} onOpenPage={()=>navigate('productDetail',`/productos/${drawer.product.id}/${drawer.role==='producer'?'productores':'operadores'}`)}/>:<ActorPanel key={drawer.id} entry={drawer.entry} role={drawer.role} onClose={()=>setDrawers(current=>current.filter(x=>x.id!==drawer.id))} onOpenPage={()=>navigate('provider',`/${drawer.role==='producer'?'productores':'operadores'}/${drawer.entry.id}`)} onOpenProduct={openProduct}/>)}
    {publication&&<PublicationPanel items={mine?.items??[]} initialProduct={publication.product} onClose={()=>setPublication(null)} onSave={async(matched,draft)=>{await savePublication(draft,matched?.id);setPublication(null)}}/>}
    {editor&&<AdminEditorPanel kind={editor.kind} item={editor.item} onClose={()=>setEditor(null)} onSave={saveActor}/>}
    {deleteTarget&&<ConfirmModal heading={`Eliminar ${deleteTarget.item.name??deleteTarget.item.product?.name}`} description="Se eliminará el registro y sus datos asociados." onCancel={()=>setDeleteTarget(null)} onConfirm={removeAdminItem}/>}
    {smartEditor&&<SmartRecommendationPanel item={smartEditor.item} availableProducts={products.map(x=>({...x,active:true}))} onClose={()=>setSmartEditor(null)} onSave={saveSmart}/>}
  </div>
}
