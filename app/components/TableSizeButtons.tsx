import { ImShrink } from "react-icons/im"
import { HiArrowsExpand } from "react-icons/hi"
import { Button } from "app/components/common/Button"

/***
 * シフトテーブル拡大縮小ボタン
 */

type Props = {
  tableSize: number
  setTableSize: React.Dispatch<React.SetStateAction<number>>
  date: {
    year: number
    month: number
  }
}

export const TableSizeButtons = ({ tableSize, setTableSize, date }: Props) => {
  return (
    <div className="flex items-center my-1">
      <Button
        text={
          <div className="flex items-center justify-center">
            <ImShrink size={20} className="mr-1" />
            縮小
          </div>
        }
        customWidth="70px"
        width="sm"
        color="secondary-light"
        disabled={tableSize === new Date(date.year, date.month, 0).getDate()}
        onClick={() => {
          tableSize + 5 > new Date(date.year, date.month, 0).getDate()
            ? setTableSize(new Date(date.year, date.month, 0).getDate())
            : setTableSize(tableSize + 5)
        }}
      />
      <div className="mr-1" />
      <Button
        text={
          <div className="flex items-center justify-center">
            <HiArrowsExpand size={28} className="mr-1" />
            拡大
          </div>
        }
        color="secondary-light"
        width="sm"
        customWidth="70px"
        disabled={tableSize === 7}
        onClick={() => {
          tableSize - 5 > 7 ? setTableSize(tableSize - 5) : setTableSize(7)
        }}
      />
    </div>
  )
}
