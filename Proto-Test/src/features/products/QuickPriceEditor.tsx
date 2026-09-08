import { buildPricedProduct, productWebserviceCatalog } from '../../shared'
import AmountEditor from '../../shared/forms/AmountEditor'
import { showOperationNotification } from '../../shared/feedback/operationNotifications'
import { formatPrice } from './priceInput'

type Props = { product: any; option: any; onSave: (draft: any) => void | Promise<void>; onClose: () => void }

export default function QuickPriceEditor({ product, option, onSave, onClose }: Props) {
  const initialPrice = formatPrice(option.price ?? '').match(/\d+/)?.[0] ?? ''
  const definition = productWebserviceCatalog.find(entry => entry.id === (product.sourceProductId ?? product.id))
  return <AmountEditor title="Cambiar precio" inputLabel="Nuevo precio" initialValue={initialPrice} onClose={onClose} onSave={async price => {
    const draft = buildPricedProduct({ definition, baseProduct: product, ...option, photo: option.photo ?? '', price })
    if (!draft) throw new Error('Revisá los datos de esta combinación.')
    await onSave(draft)
    showOperationNotification('success', `Precio de ${definition?.species ?? product.name} actualizado a $${price}.`)
  }} />
}
