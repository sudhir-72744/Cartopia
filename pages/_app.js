import "@/styles/globals.css";
import Head from "next/head";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoadingBar from "react-top-loading-bar";

export default function App({ Component, pageProps }) {
  const [cart, setCart] = useState({});
  const [subTotal, setSubTotal] = useState(0);
  const [user, setUser] = useState({ value: null });
  const [navKey, setNavKey] = useState();
  const [progress, setProgress] = useState(0);
  const router = useRouter();

  const saveCart = (myCart) => {
    localStorage.setItem("cart", JSON.stringify(myCart));
    let subt = 0;
    let keys = Object.keys(myCart);
    for (let i = 0; i < keys.length; i++) {
      subt += myCart[keys[i]].price * myCart[keys[i]].qty;
    }
    setSubTotal(subt);
  };

  useEffect(() => {
    router.events.on("routeChangeStart", () => {
      setProgress(40);
    });
    router.events.on("routeChangeComplete", () => {
      setProgress(100);
    });
    console.log("hey iam a use effect from app.js");
    try {
      if (localStorage.getItem("cart")) {
        setCart(JSON.parse(localStorage.getItem("cart")));
        saveCart(JSON.parse(localStorage.getItem("cart")));
      }
    } catch (error) {
      console.log("tampered locally stored cart, clearign localStorage..");
      localStorage.clear();
    }

    const myUser = JSON.parse(localStorage.getItem("myUser"));
    if (myUser) {
      setUser({ value: myUser.token, email: myUser.email });
    }
    setNavKey(Math.random());
  }, [router.query]);

  const addToCart = (itemCode, qty, price, name, size, varient) => {
    toast.success("Item added to cart!", {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
    let newCart = cart;
    if (itemCode in cart) {
      newCart[itemCode].qty = cart[itemCode].qty + qty;
    } else {
      newCart[itemCode] = { itemCode, qty, price, name, size, varient };
    }
    setCart(newCart);

    saveCart(newCart);
  };

  const buyNow = (itemCode, qty, price, name, size, varient) => {
    // clearCart();
    // let newCart = {};
    // newCart[itemCode] = { qty: 1, price, name, size, varient };
    // setCart(newCart);
    router.push("/checkout");
  };
  const removeFromCart = (itemCode, qty, price, name, varient) => {
    let newCart = cart;
    if (itemCode in cart) {
      newCart[itemCode].qty = cart[itemCode].qty - qty;
    }
    if (newCart[itemCode].qty <= 0) {
      delete newCart[itemCode];
    }
    setCart(newCart);
    saveCart(newCart);
  };
  const clearCart = () => {
    setCart({});
    saveCart({});
    console.log("cart has been cleared");
  };
  const logout = () => {
    localStorage.removeItem("myUser");
    setUser({ value: null });
    router.push("/");
    setNavKey(Math.random());
  };
  return (
    <>
      <Head>
        <title>Codeswear.com - Wear the code</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <LoadingBar
        waitingTime={300}
        color="#5046e9"
        progress={progress}
        onLoaderFinished={() => setProgress(0)}
        height={4}
      />
      {navKey && (
        <NavBar
          logout={logout}
          user={user}
          navKeyey={navKey}
          cart={cart}
          addToCart={addToCart}
          removeFromCart={removeFromCart}
          clearCart={clearCart}
          subTotal={subTotal}
        />
      )}
      <Component
        cart={cart}
        addToCart={addToCart}
        removeFromCart={removeFromCart}
        clearCart={clearCart}
        subTotal={subTotal}
        buyNow={buyNow}
        {...pageProps}
      />
      <Footer />
    </>
  );
}
