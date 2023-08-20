import React, { useState } from "react";
import Head from "next/head";
import Script from "next/script";
import { useEffect, useRef } from "react";
import Link from "next/link";
import {
  AiFillCloseCircle,
  AiOutlineShoppingCart,
  AiOutlinePlusCircle,
  AiOutlineMinusCircle,
} from "react-icons/Ai";
import { IoBagCheckOutline } from "react-icons/io5";
import { MdOutlineRemoveShoppingCart } from "react-icons/md";
const Checkout = ({ cart, clearCart, addToCart, removeFromCart, subTotal }) => {
  // console.log(cart);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [pincode, setPincode] = useState("");
  const [address, setAddress] = useState("");
  const [disabled, setDisabled] = useState(true);
  const [user, setUser] = useState({ vlaue: null });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("myUser"));
    if (user && user.token) {
      setUser(user);
      setEmail(user.email);
      fetchData(user.token);
    }
  }, []);
  const getPincode = async (pin) => {
    let a = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/pincodes`);
    let res = await a.json();
    if (Object.keys(res).includes(pin)) {
      setCity(res[pin][0]);
      setState(res[pin][1]);
    }
  };
  const fetchData = async (token) => {
    let data = { token: token, name, address, phone, pincode };
    let a = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/getuser`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    let res = await a.json();
    console.log(res);
    setName(res.name);
    setAddress(res.address);
    setPhone(res.phone);
    setPincode(res.pincode);
    getPincode(res.pincode);
  };
  const initatePayment = async () => {
    let oid = Math.floor(Math.random() * Date.now());
    const data = {
      cart,
      subTotal,
      oid,
      email: email,
      name,
      address,
      pincode,
      phone,
      city,
      state,
    };

    let a = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/pretransaction`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    let txnRes = a.json();
    if (txnRes.success) {
      let txnToken = txnRes.txnToken;
      let amount = subTotal;

      var config = {
        root: "",
        flow: "DEFAULT",
        data: {
          orderId: oid /* update order id */,
          token: "txnToken" /* update token value */,
          tokenType: "TXN_TOKEN",
          amount: amount /* update amount */,
        },
        handler: {
          notifyMerchant: function (eventName, data) {
            console.log("notifyMerchant handler function called");
            console.log("eventName => ", eventName);
            console.log("data => ", data);
          },
        },
      };

      // initialze configuration using init method
      window.Paytm.CheckoutJS.init(config)
        .then(function onSuccess() {
          // after successfully updating configuration, invoke JS Checkout
          window.Paytm.CheckoutJS.invoke();
        })
        .catch(function onError(error) {
          console.log("error => ", error);
        });
    } else {
      if (txnRes.clearCart) {
        clearCart();
      }
    }
  };
  const handleChange = async (e) => {
    if (e.target.name == "name") {
      setName(e.target.value);
    } else if (e.target.name == "phone") {
      setPhone(e.target.value);
    } else if (e.target.name == "address") {
      setAddress(e.target.value);
    } else if (e.target.name == "pincode") {
      setPincode(e.target.value);
      if (e.target.value.length == 6) {
        let pins = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/pincodes`);
        let pinJson = await pins.json();
        // console.log(pinJson);
        if (Object.keys(pinJson).includes(e.target.value)) {
          setCity(pinJson[e.target.value][0]);
          setState(pinJson[e.target.value][1]);
        } else {
          setCity("");
          setState("");
        }
      } else {
        setCity("");
        setState("");
      }
    } else if (e.target.name == "email") {
      setEmail(e.target.value);
    }

    if (email && phone && name && address && pincode) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  };

  const ref = useRef();
  return (
    <>
      <div className="container m-auto px-6">
        <Head>
          <title>checkout page</title>
          <meta
            name="viewport"
            content="width=device-width, height=device-height, initial-scale=1.0, maximum-scale=1.0"
          />
        </Head>
        <Script
          type="application/javascript"
          src={`${process.env.NEXT_PUBLIC_PAYTM_HOST}/merchantpgpui/checkoutjs/merchants/${process.env.NEXT_PUBLIC_PAYTM_MID}.js`}
          crossorigin="anonymous"
        ></Script>

        <h1 className="text-center text-3xl font-bold mt-12">Checkout</h1>
        <div>
          <h2 className="font-semibold md:mt-12 mt-6 ">1. Delivery Details </h2>
          <div className="mx-auto flex">
            <div className="md:w-1/3 px-2">
              <label htmlFor="name" className="leading-7 text-sm text-gray-600">
                Name
              </label>

              <input
                onChange={handleChange}
                value={name}
                type="text"
                id="name"
                name="name"
                className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
              />
            </div>
            <div className="md:w-1/3 px-2">
              <label
                htmlFor="email"
                className="leading-7 text-sm text-gray-600"
              >
                Email
              </label>
              {user && user.value ? (
                <input
                  readOnly={true}
                  value={user.email}
                  type="email"
                  id="email"
                  name="email"
                  className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                />
              ) : (
                <input
                  onChange={handleChange}
                  value={email}
                  type="email"
                  id="email"
                  name="email"
                  className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                />
              )}
            </div>
          </div>
          <div className="md:w-2/3 px-2">
            <label
              htmlFor="address"
              className="leading-7 text-sm text-gray-600"
            >
              Address
            </label>

            <textarea
              onChange={handleChange}
              value={address}
              rows="3"
              type="text"
              id="address"
              name="address"
              className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out overflow-hidden"
            />
          </div>
          <div className="flex">
            <div className="md:w-1/3 px-2">
              <label
                htmlFor="phone"
                className="leading-7 text-sm text-gray-600"
              >
                Phone
              </label>

              <input
                onChange={handleChange}
                value={phone}
                type="number"
                id="phone"
                name="phone"
                className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
              />
            </div>
            <div className="md:w-1/3 px-2">
              <label
                htmlFor="Pincode"
                className="leading-7 text-sm text-gray-600"
              >
                Pincode
              </label>

              <input
                onChange={handleChange}
                value={pincode}
                type="number"
                id="pincode"
                name="pincode"
                className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
              />
            </div>
          </div>
          <div className="flex">
            <div className="md:w-1/3 px-2">
              <label htmlFor="city" className="leading-7 text-sm text-gray-600">
                City
              </label>

              <input
                onChange={handleChange}
                value={city}
                // readOnly={true}
                type="text"
                id="city"
                name="city"
                className="w-full bg-gray-100 rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
              />
            </div>
            <div className="md:w-1/3 px-2">
              <label
                htmlFor="state"
                className="leading-7 text-sm text-gray-600"
              >
                State
              </label>

              <input
                value={state}
                onChange={handleChange}
                // readOnly={true}
                type="text"
                id="state"
                name="state"
                className="w-full bg-gray-100 rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
              />
            </div>
          </div>
        </div>

        <h2 className="mt-12 font-semibold">2. Review cart items</h2>
        <div>
          <div
            ref={ref}
            className="sidecart w-[100%] md:w-[60%]   right-0 bg-[#E0E7FF]  rounded-xl  pt-10  pl-10 pb-5 pr-10 mt-14  "
          >
            <h2 className="font-bold text-2xl text-center">Shopping Cart</h2>
            <span className="absolute top-4 right-5 text-2xl cursor-pointer">
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
                        {cart[k].name}({cart[k].size} / {cart[k].varient})
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
            <div className="subtotal font-semibold flex justify-end mr-20">
              Subtotal: {subTotal}
            </div>
          </div>
          <div className="flex mt-5 justify-center ">
            <Link href={"/checkout"}>
              <button
                disabled={disabled}
                onClick={initatePayment}
                className="disabled:bg-indigo-300 flex mx-auto px-16 py-3 text-white bg-indigo-500 border-0  focus:outline-none hover:bg-indigo-600 rounded text-sm "
              >
                <IoBagCheckOutline className="text-lg  justify-center mr-2 " />
                Pay ₹ {subTotal}
              </button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Checkout;
