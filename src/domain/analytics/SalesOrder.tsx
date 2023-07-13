import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import moment from "moment"
import { stringDisplayPrice } from "../../utils/prices"
const SalesOrder = ({ data }: { data: any }) => {
  return (
    <>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart
          data={data?.result}
          margin={{
            top: 40,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <Line type="monotone" dataKey="value" stroke="#8884d8" dot={false} />
          <CartesianGrid strokeDasharray="5" />
          <XAxis
            dataKey="label"
            scale={"auto"}
            tickFormatter={(e) => {
              const interval = data.interval
              if (interval === "day") return moment(e).format("D MMM YYYY")
              else if (interval === "hour") {
                return moment(e).format("hh:mm A")
              } else if (interval === "month") {
                return moment(e).format("MMM YYYY")
              } else {
                return moment(e).format("YYYY")
              }
            }}
          />
          <YAxis
            dataKey="value"
            tickFormatter={(e) => (typeof e === "number" ? e / 100 : e)}
          />
          <Tooltip
            content={(props) => {
              const { active, payload, label } = props
              return payload?.[0] ? (
                <div className="flex w-56 flex-row rounded border bg-white p-4 shadow-lg">
                  <p className="text-gray-500">{`${moment(label).format(
                    "D MMM YYYY"
                  )}`}</p>
                  <div className="ml-auto">
                    {stringDisplayPrice({
                      amount: payload[0].value,
                      currencyCode: "myr",
                    })}
                  </div>
                </div>
              ) : (
                <></>
              )
            }}
          />
          <Tooltip />
        </LineChart>
      </ResponsiveContainer>
    </>
  )
}

export default SalesOrder
