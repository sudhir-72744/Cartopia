import React from "react";

import { useEffect } from "react";
import { useRouter } from "next/router";
import MyOrders from "@/models/MyOrders";
import mongoose from "mongoose";

const Order = (order, clearCart) => {
  const router = useRouter();
  const { orderId } = router.query;
  const { id } = router.query;
  const products = order.products;
  useEffect(() => {
    if (router.query.clearCart == 1) {
      clearCart();
    }
  }, []);

  return (
    <>
      <section className="text-gray-600 body-font overflow-hidden px-4 md:px-0">
        <div className="container px-5 md:px-0 py-8 md:my-24 mx-auto">
          <div className="md:w-5/6 mx-auto flex flex-wrap">
            <div className="md:w-1/2 w-full lg:pr-10 lg:py-6 mb-6 lg:mb-0 ">
              <h2 className="text-sm title-font text-gray-500 tracking-widest">
                Codeswear.com
              </h2>
              <h1 className="text-gray-900 text-3xl title-font font-medium mb-4">
                Order Id: {order.orderId}
              </h1>

              <p className="leading-relaxed mb-4">
                Your order was {order.status}
              </p>
              <div className="flex mb-4">
                <a className="flex-grow text-left text-indigo-500 border-b-2 border-indigo-500 py-2 text-lg px-1">
                  Description
                </a>
                <a className="flex-grow text-right border-b-2 border-gray-300 py-2 text-lg px-1">
                  Quantity
                </a>
                <a className="flex-grow text-right border-b-2 border-gray-300 py-2 text-lg px-1">
                  Item Total
                </a>
              </div>

              {Object.keys(products).maps((item) => {
                <div className="flex ">
                  <span className="text-gray-500">
                    {products[item].name}({products[item].size}/
                    {products[item].varient})
                  </span>
                  <span className="ml-auto text-gray-900">
                    products[item].qty
                  </span>
                  <span className="ml-auto text-gray-900">
                    products[item].price*products[item].qty
                  </span>
                </div>;
              })}

              <div className="flex flex-col justify-center mt-12">
                <span className="title-font font-medium pt-1 text-2xl text-gray-900 ">
                  Subtotal: ₹ {order.amount}
                </span>
                <div>
                  <button className="flex mx-auto md:mx-0 mt-4 text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded">
                    Track Order
                  </button>
                </div>
              </div>
            </div>
            <img
              alt="ecommerce"
              className="lg:w-1/2 w-full lg:h-auto h-64 object-cover object-center rounded"
              src="https://dummyimage.com/400x400"
            />
          </div>
        </div>
      </section>
    </>
  );
};

export async function getServerSideProps(context) {
  if (!mongoose.connections[0].readyState) {
    await mongoose.connect(process.env.MONGO_URI);
  }
  let order = await MyOrders.findById(context.query.id);

  return {
    props: {
      order: JSON.parse(JSON.stringify(order)),
    }, // will be passed to the page component as props
  };
}

export default Order;
