import React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { IoBagCheckOutline } from "react-icons/io5";
import User from "@/models/User";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const MyAccount = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [cpassword, setCpassword] = useState("");
  const [password, setPassword] = useState("");

  const [pincode, setPincode] = useState("");
  const [address, setAddress] = useState("");

  const [user, setUser] = useState({ vlaue: null });
  const router = useRouter();
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("myUser"));
    if (user && user.token) {
      setUser(user);
      setEmail(user.email);
      fetchData(user.token);
    }
    if (!localStorage.getItem("myUser")) {
      router.push("/");
    }
  }, []);
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
    } else if (e.target.name == "password") {
      setPassword(e.target.value);
    } else if (e.target.name == "cpassword") {
      setCpassword(e.target.value);
    }
  };
  const handleUserSubmit = async (e) => {
    let data = { token: user.token, name, address, phone, pincode };
    let a = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/updateuser`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    let res = await a.json();
    toast.success("Details updated!", {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
    console.log(res);
  };
  const handlePasswordSubmit = async () => {
    let data = { token: user.token, cpassword, password };
    let a = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/updatepassword`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    let res = await a.json();
    if (res.success) {
      toast.success("Password updated!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } else {
      toast.error("passwords donot match!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
    setCpassword("");
    setpassword("");
  };
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <div className="conatiner m-auto my-9">
        <h1 className="text-3xl text-center font-bold">Update Your Account</h1>
      </div>

      <div className="mx-auto ">
        <div className="mx-auto flex  justify-center">
          <h2 className="font-semibold md:mt-12 mt-6 md:w-2/3 px-2">
            1. Delivery Details{" "}
          </h2>
        </div>
        <div className="mx-auto flex  justify-center">
          <div className="md:w-1/3 px-2 ">
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
            <label htmlFor="email" className="leading-7 text-sm text-gray-600">
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
        <div className="flex justify-center ">
          <div className="md:w-2/3 px-2 ">
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
        </div>
        <div className="flex justify-center">
          <div className="md:w-1/3 px-2">
            <label htmlFor="phone" className="leading-7 text-sm text-gray-600">
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
        <div className="flex justify-center">
          <div className="flex justify-start mt-8  w-2/3 ">
            <Link href={""}>
              <button
                // disabled={}
                onClick={handleUserSubmit}
                className="disabled:bg-indigo-300 flex mx-auto px-8 py-3 text-white bg-indigo-500 border-0  focus:outline-none hover:bg-indigo-600 rounded text-sm "
              >
                Submit
              </button>
            </Link>
          </div>
        </div>

        <div className="mx-auto flex  justify-center mt-10 mb-4">
          <h2 className="font-semibold  mt-2 md:w-2/3 px-2">
            2. Change Password
          </h2>
        </div>
        <div className="mx-auto flex  justify-center">
          <div className="md:w-1/3 px-2  ">
            <label htmlFor="name" className="leading-7 text-sm text-gray-600">
              Confirm Previous Password
            </label>

            <input
              onChange={handleChange}
              value={password}
              type="password"
              id="password"
              name="password"
              className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
            />
          </div>
          <div className="md:w-1/3 px-2">
            <label htmlFor="email" className="leading-7 text-sm text-gray-600">
              New Password
            </label>

            <input
              onChange={handleChange}
              value={cpassword}
              type="password"
              id="cpassword"
              name="cpassword"
              className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
            />
          </div>
        </div>
        <div className="flex justify-center">
          <div className="flex justify-start mt-8  w-2/3 ">
            <Link href={""}>
              <button
                // disabled={}
                onClick={handlePasswordSubmit}
                className="disabled:bg-indigo-300 flex mx-auto px-8 py-3 text-white bg-indigo-500 border-0  focus:outline-none hover:bg-indigo-600 rounded text-sm "
              >
                Update Password
              </button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default MyAccount;
