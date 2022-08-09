import { Card } from "../../types/Card";

export interface ICardSearchResultTableProps {
  resultList: Card[]
  loading: boolean
  onSelect: (value: Card) => void
  queryCaption?: string
}