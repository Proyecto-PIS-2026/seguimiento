import { marketSnapshot } from '../../../server/market'
import { respond } from '../../../server/http'
export async function GET(){return respond(marketSnapshot)}
