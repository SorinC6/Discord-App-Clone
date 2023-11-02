"use client";

import { useEffect, useState } from "react";
import { CreateServerModal } from "../modals/create-server-modal";

export const ModalProvider = () => {
  const [isMonted, setIsMonted] = useState(false);

  useEffect(() => {
    setIsMonted(true);
  }, []);

  // preventing the modal to be rendered on the server side (hidration error stuff)
  if (!isMonted) return null;

  return (
    <>
      <CreateServerModal />
    </>
  );
};
