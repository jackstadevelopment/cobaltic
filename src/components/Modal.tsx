/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable react/require-default-props */

import React from "react";
import Modal from "../types/Modal";
import Button from "./Button";
import { AppContext } from "./Context";

export default function ModalComponenet({
  title,
  message,
  children,
  type,
}: Modal) {
  const { setModal } = React.useContext(AppContext);
  const { modal } = React.useContext(AppContext);
  return (
    <div
      className={`w-1/3 absolute bottom-0 right-0 border bg-opacity-40 px-6 py-4 mb-4 mr-4 text-white animate__animated animate__fadeIn transition border-gray-700  shadow-sm items-center rounded-3xl backdrop-filter backdrop-blur-xl opacity-50 ${
        type === "error" ? "bg-red-500" : "bg-black"
      }`}
    >
      <div className="drop-shadow-md">
        <h3 className="font-black">{title || "Error"}</h3>
        <p className="text-gray-200">{message}</p>
      </div>
      <div>{children}</div>
      <div className="drop-shadow-md pt-2 flex justify-end">
        <Button
          onClick={() =>
            setModal
              ? setModal({
                  state: !modal?.state,
                  title: "",
                  message: "",
                  children: undefined,
                  type: "error",
                })
              : null
          }
        >
          Close
        </Button>
      </div>
    </div>
  );
}
