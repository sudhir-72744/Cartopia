import React from "react";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import {
  AiFillCloseCircle,
  AiOutlineShoppingCart,
  AiOutlinePlusCircle,
  AiOutlineMinusCircle,
} from "react-icons/Ai";
import { BiSolidUserCircle } from "react-icons/Bi";
import { IoBagCheckOutline } from "react-icons/io5";
import {
  MdOutlineRemoveShoppingCart,
  MdOutlineAccountCircle,
} from "react-icons/md";
import Product from "@/models/Product";
import { useRouter } from "next/router";

const NavBar = ({
  logout,
  user,
  key,
  cart,
  addToCart,
  removeFromCart,
  clearCart,
  subTotal,
}) => {
  const [dropdown, setDropdown] = useState(false);
  const [sidebar, setSidebar] = useState(false);
  const ref = useRef();
  const router = useRouter();

  useEffect(() => {
    setDropdown(false);
    // if (Object.keys(cart).length !== 0) {
    //   setSidebar(true);
    //   setTimeout(() => {
    //     setSidebar(false);
    //   }, 2700);
    // } else {
    //   setSidebar(false);
    // }
    let exempted = [
      "/checkout",
      "/order",
      "/orders",
      "/",
      "/checkout",
      "/tshirts",
    ];
    if (exempted.includes(router.pathname)) {
      setSidebar(false);
      setDropdown(false);
    }
  }, []);

  const toggleCart = () => {
    setSidebar(!sidebar);
  };

  return (
    <div
      className={` flex justify-center items-center flex-col md:flex-row md:justify-start mt-2 mb-1 shadow-lg  sticky top-0 bg-white opacity-[0.95] z-[999] `}
    >
      <div className=" ml-3 mr-auto md:mr-4 mt-3 mb-3 ">
        <Link href={"/"} className="cursor-pointer">
          <Image src="/logoBlack.png" alt="" width={200} height={50} />
        </Link>
      </div>
      <div className="nav ml-5 ">
        <ul className="flex  items-center md:flex-row  font-bold md:text-md ">
          <Link href={"/tshirts"}>
            <li className=" hover:bg-indigo-600 px-5  py-2 rounded-lg hover:text-white">
              Tshirts
            </li>
          </Link>
          <Link href={"/stickers"}>
            <li className=" hover:bg-indigo-600 px-5  py-2 rounded-lg hover:text-white">
              Sticker
            </li>
          </Link>
          <Link href={"/hoddies"}>
            <li className=" hover:bg-indigo-600 px-5  py-2 rounded-lg hover:text-white">
              Hoddies
            </li>
          </Link>
          <Link href={"/mugs"}>
            <li className=" hover:bg-indigo-600 px-5  py-2 rounded-lg hover:text-white">
              Mugs
            </li>
          </Link>
        </ul>
      </div>

      <div className="cart flex absolute items-center top-4 md:top-4 right-16 md:right-20 md:justify-end">
        {user.value ? (
          <span
            onMouseEnter={() => {
              setDropdown(true);
            }}
            onMouseLeave={() => {
              setDropdown(false);
            }}
          >
            <div className="">
              <BiSolidUserCircle className="text-5xl md:text-4xl cursor-pointer" />
            </div>
          </span>
        ) : (
          <Link href={"/login"}>
            <button className="mt-1 bg-indigo-600 hover:bg-indigo-800 font-bold text-white px-4 py-1 rounded-lg">
              Login
            </button>
          </Link>
        )}

        {user.value && dropdown && (
          <div
            onMouseEnter={() => {
              setDropdown(true);
            }}
            onMouseLeave={() => {
              setDropdown(false);
            }}
            className="absolute right-7 top-4 px-4 bg-white rounded-xl py-2 w-40"
          >
            <ul>
              <Link href={"/myaccount"}>
                <li className="font-semibold py-1 pt-1 px-4 hover:bg-gray-300 hover:text-white rounded-lg">
                  My Account
                </li>
              </Link>

              <Link href={"orders"}>
                <li className="font-semibold py-1 px-4 hover:bg-gray-300 hover:text-white rounded-lg">
                  Orders
                </li>
              </Link>

              <li
                onClick={logout}
                className="font-semibold py-1 pb-1 px-4 hover:bg-gray-300 hover:text-white rounded-lg"
              >
                Logout
              </li>
            </ul>
          </div>
        )}
      </div>

      <div
        onClick={toggleCart}
        className="cart  absolute  top-4 right-4 md:right-7"
      >
        <AiOutlineShoppingCart className="text-4xl md:text-4xl cursor-pointer rounded-full  p-1 hover:bg-indigo-600 hover:text-white" />
      </div>

      <div
        ref={ref}
        className={`sidecart  w-80 overflow-y-scroll absolute top-0  bg-[#E0E7FF]  rounded-xl  pt-10  pl-10 pb-5 pr-10 mt-14  transition-all ${
          sidebar ? "right-0" : "-right-96"
        }`}
      >
        <h2 className="font-bold text-2xl text-center">Shopping Cart</h2>
        <span
          onClick={toggleCart}
          className="absolute top-4 right-5 text-2xl cursor-pointer"
        >
          <AiFillCloseCircle />
        </span>
        <ol className="list-decimal font-semibold">
          {Object.keys(cart).length === 0 && (
            <div className="mt-4">
              {" "}
              No items in Cart!! please add few items to checkout
            </div>
          )}
          {Object.keys(cart).map((k) => {
            return (
              <li className="mt-3 mb-3">
                <div className="flex justify-center">
                  <div className="w-2/3  overflow-hidden">
                    {cart[k].name} ({cart[k].size}/{cart[k].varient})
                  </div>
                  <div className="w-1/3 font-semibold flex justify-center items-center">
                    <AiOutlineMinusCircle
                      onClick={() => {
                        removeFromCart(
                          k,
                          1,
                          cart[k].price,
                          cart[k].name,
                          cart[k].size,
                          cart[k].varient
                        );
                      }}
                      className="text-xl cursor-pointer"
                    />
                    <span className="mx-2 text-lg">{cart[k].qty}</span>
                    <AiOutlinePlusCircle
                      onClick={() =>
                        addToCart(
                          k,
                          1,
                          cart[k].price,
                          cart[k].name,
                          cart[k].size,
                          cart[k].varient
                        )
                      }
                      className="text-xl cursor-pointer"
                    />
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
        <div className="mt-8 font-bold">Total Amount ₹ {subTotal} </div>
        <div className="flex mt-5">
          <Link href={"/checkout"}>
            <button
              disabled={Object.keys(cart).length == 0}
              className="disabled:bg-indigo-400 flex mx-auto mt-1 text-white bg-indigo-500 border-0 py-2 px-4 focus:outline-none hover:bg-indigo-600 rounded text-sm"
            >
              <IoBagCheckOutline className="text-lg  justify-center mr-2 " />
              Checkout
            </button>
          </Link>
          <button
            onClick={clearCart}
            disabled={Object.keys(cart).length == 0}
            className="disabled:bg-indigo-400 flex mt-1 mx-2 text-white bg-indigo-500 border-0 py-2 px-4 focus:outline-none hover:bg-indigo-600 rounded text-sm"
          >
            <MdOutlineRemoveShoppingCart className="text-lg text-center justify-center mr-2 mt-1" />
            Clear
          </button>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
