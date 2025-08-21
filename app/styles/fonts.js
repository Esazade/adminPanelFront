import localFont from "next/font/local";

  export const poppins_font = localFont({
    src: [
      {
        path: "../assets/font/poppins/poppins-light-webfont.woff2",
        weight: "200",
        style: "normal",
      },
      {
        path: "../assets/font/poppins/poppins-light-webfont.woff2",
        weight: "300",
        style: "normal",
      },
      {
        path: "../assets/font/poppins/poppins-regular-webfont.woff2",
        weight: "400",
        style: "normal",
      },
      {
        path: "../assets/font/poppins/poppins-medium-webfont.woff2",
        weight: "500",
        style: "normal",
      },
      {
        path: "../assets/font/poppins/poppins-bold-webfont.woff2",
        weight: "700",
        style: "normal",
      },
      {
        path: "../assets/font/poppins/poppins-semibold-webfont.woff2",
        weight: "800",
        style: "normal",
      },
      {
        path: "../assets/font/poppins/poppins-bold-webfont.woff2",
        weight: "900",
        style: "normal",
      },
    ],
    variable: "--font-poppins",
  });
  
  export const iran_yekan_font = localFont({
    src: [
      {
        path: "../assets/font/iran-yekan/IRANYekanXFaNum-Thin.woff2",
        weight: "200",
        style: "normal",
      },
      {
        path: "../assets/font/iran-yekan/IRANYekanXFaNum-Light.woff2",
        weight: "300",
        style: "normal",
      },
      {
        path: "../assets/font/iran-yekan/IRANYekanXFaNum-Regular.woff2",
        weight: "400",
        style: "normal",
      },
      {
        path: "../assets/font/iran-yekan/IRANYekanXFaNum-Medium.woff2",
        weight: "500",
        style: "normal",
      },
      {
        path: "../assets/font/iran-yekan/IRANYekanXFaNum-Bold.woff2",
        weight: "700",
        style: "normal",
      },
      {
        path: "../assets/font/iran-yekan/IRANYekanXFaNum-DemiBold.woff2",
        weight: "800",
        style: "normal",
      },
      {
        path: "../assets/font/iran-yekan/IRANYekanXFaNum-ExtraBold.woff2",
        weight: "900",
        style: "normal",
      },
    ],
    variable: "--font-iran-yekan",
  });