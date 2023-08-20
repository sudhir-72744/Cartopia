import React from "react";
import Link from "next/link";
import Product from "@/models/Product";
import connectDb from "@/middleware/mongoose";
import mongoose from "mongoose";

const Hoodies = ({ products }) => {
  // console.log(products);
  return (
    <>
      <section className="text-gray-600 body-font">
        <div className="container px-5 py-24 mx-auto">
          <div className="flex flex-wrap -m-4">
            {Object.keys(products).length === 0 && (
              <p>
                Out of stock!! new stickers stock comming soon, stay tuned!!
              </p>
            )}
            {Object.keys(products).map((item) => {
              // console.log(item);

              return (
                <Link
                  key={products[item]._id}
                  passHref={true}
                  href={`/products/${products[item].slug}`}
                  className="lg:w-1/4 md:w-1/2 p-4 w-full relative"
                >
                  <div className="block relative overflow-hidden z-1">
                    <img
                      // Correct the attribute name
                      layout="fill"
                      alt="ecommerce"
                      className=" object-cover m-auto md:m-0 rounded-lg h-[36vh] block"
                      src={products[item].img}
                    />
                  </div>
                  <div className="mt-4 text-center md:text-left">
                    <h3 className="text-gray-500 text-xs tracking-widest title-font mb-1">
                      {products[item].category}
                    </h3>
                    <h2 className="text-gray-900 title-font text-lg font-medium">
                      {products[item].title}
                    </h2>
                    <p className="mt-1">₹{products[item].price}</p>
                    <div className="sizes mt-1">
                      {products[item].size.includes("S") && (
                        <span className="border border-gray-300 px-1 mx-1">
                          S
                        </span>
                      )}
                      {products[item].size.includes("M") && (
                        <span className="border border-gray-300 px-1 mx-1">
                          M
                        </span>
                      )}
                      {products[item].size.includes("L") && (
                        <span className="border border-gray-300 px-1 mx-1">
                          L
                        </span>
                      )}
                      {products[item].size.includes("XL") && (
                        <span className="border border-gray-300 px-1 mx-1">
                          XL
                        </span>
                      )}
                      {products[item].size.includes("XXL") && (
                        <span className="border border-gray-300 px-1 mx-1">
                          XXL
                        </span>
                      )}
                      {products[item].size.includes("XXXL") && (
                        <span className="border border-gray-300 px-1 mx-1">
                          XXXL
                        </span>
                      )}
                    </div>
                    <div className="color mt-1">
                      {products[item].color.includes("violet") && (
                        <button className="border-2 border-gray-300 ml-1 bg-violet-50-500 rounded-full w-6 h-6 focus:outline-none"></button>
                      )}
                      {products[item].color.includes("indigo") && (
                        <button className="border-2 border-gray-300 ml-1 bg-indigo-500 rounded-full w-6 h-6 focus:outline-none"></button>
                      )}
                      {products[item].color.includes("blue") && (
                        <button className="border-2 border-gray-300 ml-1 bg-blue-500 rounded-full w-6 h-6 focus:outline-none"></button>
                      )}
                      {products[item].color.includes("yellow") && (
                        <button className="border-2 border-gray-300 ml-1 bg-yellow-500 rounded-full w-6 h-6 focus:outline-none"></button>
                      )}
                      {products[item].color.includes("orange") && (
                        <button className="border-2 border-gray-300 ml-1 bg-orange-50-500 rounded-full w-6 h-6 focus:outline-none"></button>
                      )}
                      {products[item].color.includes("red") && (
                        <button className="border-2 border-gray-300 ml-1 bg-red-500 rounded-full w-6 h-6 focus:outline-none"></button>
                      )}
                      {products[item].color.includes("black") && (
                        <button className="border-2 border-gray-300 ml-1 bg-black rounded-full w-6 h-6 focus:outline-none"></button>
                      )}
                      {products[item].color.includes("green") && (
                        <button className="border-2 border-gray-300 ml-1 bg-green-500 rounded-full w-6 h-6 focus:outline-none"></button>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
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
  let products = await Product.find({ category: "stickers" });
  let hoodies = {};
  for (let item of products) {
    if (item.title in hoodies) {
      if (
        !hoodies[item.title].color.includes(item.color) &&
        item.availabilityQty > 0
      ) {
        hoodies[item.title].color.push(item.color);
      }
      if (
        !hoodies[item.title].size.includes(item.size) &&
        item.availabilityQty > 0
      ) {
        hoodies[item.title].size.push(item.size);
      }
    } else {
      hoodies[item.title] = JSON.parse(JSON.stringify(item));
      if (item.availabilityQty > 0) {
        hoodies[item.title].color = [item.color];
        hoodies[item.title].size = [item.size];
      }
    }
  }
  // console.log(hoodies);
  return {
    props: { products: JSON.parse(JSON.stringify(hoodies)) }, // will be passed to the page component as props
  };
}

export default Hoodies;
