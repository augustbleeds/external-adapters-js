import { Requester } from '@chainlink/external-adapter'
import { ExternalFetch } from './adapter'

export const fetchDerbit: ExternalFetch = async (
  currency: string,
  days: number,
): Promise<number> => {
  const url = 'https://www.deribit.com/api/v2/public/get_historical_volatility'
  const params = { currency }
  const config = { url, params }

  const response = await Requester.request(config)
  const result: number[][] = response.data['result']

  const date = new Date()
  date.setMinutes(0, 0, 0)
  date.setDate(date.getDate() - days)

  const resultForDate = result.find((elem) => elem[0] === date.getTime())
  if (!resultForDate || resultForDate.length < 2) {
    throw new Error('no derbit value for this date')
  }

  return resultForDate[1]
}
