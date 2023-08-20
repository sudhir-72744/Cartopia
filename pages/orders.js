import React, { useState } from "react";
import { useEffect } from "react";
import { useRouter } from "next/router";

const Orders = () => {
  const router = useRouter();
  const [orders, setOrders] = useState([]);

  useEffect(() => {

    const fetchOrders = async () => {
      let a = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/myorders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: JSON.parse(localStorage.getItem("myUser")).token,
        }),
      });
      let res = await a.json();
      setOrders(res.orders);

    };

    if (!localStorage.getItem("myUser")) {
      router.push("/");
    } else {
      console.log("asdsa")
      fetchOrders();
    }
  }, []);

  return (
    <div className="min-h-screen">
      <div className="relative overflow-x-auto shadow-lg  sm:rounded-lg w-[50%] m-auto mt-20 border border-gray-300">
        <table className="w-full text-sm text-left text-gray-500  ">
          <thead className="text-xs text-gray-700 uppercase bg-gray-200 font-bold ">
            <tr>
              <th scope="col" className="px-6 py-3 font-bold ">
                Product name
              </th>
              <th scope="col" className="px-6 py-3 font-bold ">
                Color
              </th>
              <th scope="col" className="px-6 py-3 font-bold ">
                Category
              </th>
              <th scope="col" className="px-6 py-3 font-bold ">
                Price
              </th>
              <th scope="col" className="px-6 py-3 font-bold ">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {orders.map((item) => (
              <tr key={item._id} className="bg-white border-b ">
                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap "
                >
                  {item.email}
                </th>
                <td className="px-6 py-4">{item.orderId}</td>
                <td className="px-6 py-4">{item.status}</td>
                <td className="px-6 py-4">${item.amount}</td>
                <td className="px-6 py-4">
                  <a
                    href={"/order?id=" + item._id}
                    className="font-medium text-blue-600  hover:underline"
                  >
                    Details
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Orders;
