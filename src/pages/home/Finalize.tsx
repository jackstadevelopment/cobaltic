/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import { faArrowLeft, faEllipsis } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { dialog, invoke } from "@tauri-apps/api";
import React from "react";
import { AppContext } from "../../components/Context";
import { Method, State } from "../../utils/constants";

export default function Finalize() {
  const { directory } = React.useContext(AppContext);
  const { setDirectory, setState, setMethod, setModal } =
    React.useContext(AppContext);

  const getDirectory = () => {
    dialog.open({ directory: true }).then((value) => {
      if (typeof value === "string") {
        setDirectory?.(value as string);
      } else {
        setDirectory?.("Something goofed.");
      }
    });
  };

  const checkDirectoryExists = async (incomingDirectory: string) =>
    invoke("check_directory_exists", { directory: incomingDirectory });

  const start = async (m: Method) => {
    try {
      if (directory && (await checkDirectoryExists(directory as string))) {
        if (m === Method.NATIVE)
          throw new Error("Built-in downloading is not supported yet.");
        setMethod?.(m);
        setState?.(State.DOWNLOADING);
      } else {
        throw new Error("The selected directory does not exist.");
      }
    } catch (e) {
      setModal?.({
        title: "ERROR",
        message: (e as Error).message,
        state: true,
        children: undefined,
        type: "error",
      });
    }
  };
  return (
    <div className="flex flex-col justify-between">
      <div
        className="flex items-center space-x-2 text-gray-200 cursor-pointer"
        onClick={() => {
          setState?.(State.CHOOSING_SEASON);
        }}
      >
        <FontAwesomeIcon icon={faArrowLeft} />
        <p>Go back</p>
      </div>
      <h1 className="font-bold text-3xl text-center">Ready to start?</h1>
      <p className="text-center mb-3 text-gray-200">
        Choose a folder and the download method.
      </p>

      <div className="mt-1 relative rounded-md shadow-sm flex">
        <input
          onChange={(e) => {
            setDirectory?.(e.target.value);
          }}
          value={directory}
          placeholder="Download directory"
          className="py-2 px-3 border bg-opacity-10 focus:bg-opacity-25 bg-black text-white transition border-gray-700 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-300 focus:ring-opacity-50 shadow-sm disabled:text-gray-500 mt-1 block w-full rounded-l-md rounded-md"
        />
        <button
          type="button"
          onClick={getDirectory}
          className="ml-2 py-2 px-3 border bg-opacity-10 hover:bg-opacity-25 bg-black text-white transition border-gray-700 placeholder-gray-400 hover:outline-none hover:ring-1 hover:ring-gray-300 hover:ring-opacity-50 shadow-sm disabled:text-gray-500 mt-1 block w-10 rounded-l-md rounded-md"
        >
          <FontAwesomeIcon icon={faEllipsis} />
        </button>
      </div>
      <div className="mt-8 mb-2 relative rounded-md shadow-sm flex justify-center items-center flex-row">
        <button
          type="button"
          onClick={() => {
            start(Method.SPLASH);
          }}
          className="ml-2 py-2 px-12 border bg-opacity-10 hover:bg-opacity-25 bg-black text-white transition border-gray-700 placeholder-gray-400 hover:outline-none hover:ring-1 hover:ring-gray-300 hover:ring-opacity-50 shadow-sm disabled:text-gray-500 mt-1 block rounded-l-md rounded-md"
        >
          Splash (recommended)
        </button>
        <button
          type="button"
          onClick={() => {
            start(Method.NATIVE);
          }}
          className="ml-2 py-2 px-12 border bg-opacity-10 hover:bg-opacity-25 bg-black text-white transition border-gray-700 placeholder-gray-400 hover:outline-none hover:ring-1 hover:ring-gray-300 hover:ring-opacity-50 shadow-sm disabled:text-gray-500 mt-1 block rounded-l-md rounded-md"
        >
          Built-in (experimental)
        </button>
        <button
          type="button"
          onClick={() => {
            start(Method.LOG);
          }}
          className="ml-2 py-2 px-12 border bg-opacity-10 hover:bg-opacity-25 bg-black text-white transition border-gray-700 placeholder-gray-400 hover:outline-none hover:ring-1 hover:ring-gray-300 hover:ring-opacity-50 shadow-sm disabled:text-gray-500 mt-1 block rounded-l-md rounded-md"
        >
          Log to console (debug only)
        </button>
      </div>
    </div>
  );
}