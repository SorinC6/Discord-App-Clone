import React from "react";

export const useOrigin = () => {
  const [monted, isMounted] = React.useState(false);

  React.useEffect(() => {
    isMounted(true);
  }, []);

  const origin =
    typeof window !== "undefined" && window.location.origin
      ? window.location.origin
      : "";

  if (!monted) return "";

  return origin;
};
