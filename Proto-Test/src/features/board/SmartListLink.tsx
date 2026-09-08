import { ArrowUpRight, FileText } from 'lucide-react'
import { useSmartListUrl } from './smartListSettings'

export default function SmartListLink() {
  const url = useSmartListUrl()
  return <a className="primary-button smart-list-pdf-button" href={url} target="_blank" rel="noopener noreferrer"><FileText size={20} /><span>Ver lista inteligente de la UAM</span><ArrowUpRight size={18} /></a>
}
