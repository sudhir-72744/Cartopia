import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const forgotpassword = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cpassword, setCpassword] = useState("");

  useEffect(() => {
    if (localStorage.getItem("token")) {
      router.push("/");
    }
  }, []);
  const handleChange = async (e) => {
    if (e.target.name == "password") {
      setPassword(e.target.value);
    } else if (e.target.name == "cpassword") {
      setCpassword(e.target.value);
    } else if (e.target.name == "email") {
      setEmail(e.target.value);
    }
  };
  const sendResetEmail = async () => {
    let data = {
      email: email,
      sendMail: true,
    };

    let a = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/forgotpassword`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    let res = await a.json();
    if (res.success) {
    } else {
    }
  };
  const resetPassword = async () => {
    let data = {
      email: email,
      sendMail: true,
      password: password,
    };
    let a = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/forgotpassword`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    let res = await a.json();
    if (res.success) {
      console.log("password reset successful");
    } else {
      console.log("Error in password reset");
    }
  };
  return (
    <section className="bg-gray-50 dark:bg-gray-900 h-[80vh] pt-32">
      <div className="flex flex-col items-center justify-center px-6  mx-auto  md:pt-24 md:pb-48 pt-12 pb-16 ">
        <div className="w-full bg-white  rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-500 hover:border-indigo-500 ">
          {!router.query.token && (
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                Forgot Your Password
              </h1>
              {/* <form className="space-y-4 md:space-y-6" action="#"> */}
              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Your Email
                </label>
                <input
                  value={email}
                  onChange={handleChange}
                  type="email"
                  name="email"
                  id="email"
                  className="bg-gray-50 border-2  text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="name@company.com"
                  required=""
                />
              </div>

              <div className="flex justify-center items-center">
                <button
                  type="submit"
                  className="w-32 bg-gray-600 text-white bg-primary-600 hover:bg-indigo-500 font-bold text-sm hover:text-white flex justify-center items-center  rounded-lg  px-5 py-2.5 text-center "
                >
                  Send Email
                </button>
              </div>
              <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                Have an account?{" "}
                <Link
                  href="/login"
                  className="font-medium text-indigo-500 hover:underline dark:text-primary-500"
                >
                  Sign In
                </Link>
              </p>
              {/* </form> */}
            </div>
          )}
          {router.query.token && (
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                Forgot Your Password
              </h1>
              {/* <form className="space-y-4 md:space-y-6" action="#"> */}
              <div>
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Enter new passord
                </label>
                <input
                  value={password}
                  onChange={handleChange}
                  type="password"
                  name="password"
                  id="password"
                  className="bg-gray-50 border-2  text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="~!@#$%^&*()_+"
                  required={true}
                />
              </div>
              <div>
                <label
                  htmlFor="cpassword"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Confirm new passord
                </label>
                <input
                  value={cpassword}
                  onChange={handleChange}
                  type="password"
                  name="cpassword"
                  id="cpassword"
                  className="bg-gray-50 border-2  text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="~!@#$%^&*()_+"
                  required={true}
                />
              </div>

              <div className="flex justify-center items-center">
                <button
                  onClick={resetPassword}
                  disabled={password !== cpassword}
                  type="submit"
                  className={`${
                    password !== cpassword
                      ? "cursor-not-allowed opacity-50 hover:scale-100"
                      : "hover:bg-indigo-500 font-bold text-sm"
                  } w-32 bg-gray-600 text-white bg-primary-600  hover:text-white flex justify-center items-center  rounded-lg  px-5 pt-2.5 pb-1 text-center`}
                >
                  Reset
                </button>
              </div>
              {password !== cpassword ? (
                <div className="text-red-500">Passwords donot match</div>
              ) : (
                <div className="text-green-500">Passwords match</div>
              )}
              <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                Have an account?{" "}
                <Link
                  href="/login"
                  className="font-medium text-indigo-500 hover:underline dark:text-primary-500"
                >
                  Sign In
                </Link>
              </p>
              {/* </form> */}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default forgotpassword;
