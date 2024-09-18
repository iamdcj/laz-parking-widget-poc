export const updateParams = (key, value, clearPrevious = false) => {
  const url = new URL(window.location);
  const params = new URLSearchParams(url.search);
  const paramsArray = Array.from(url.searchParams.entries());

  if (clearPrevious) {
    paramsArray.forEach(([key]) => {
      params.delete(key);
    });
  }

  if (key && value) {
    params.set(key, value);
  }

  const updatedUrl = new URL(
    `${url.origin}${url.pathname}${params?.size ? `?${params}` : ""}`
  );

  window.history.pushState("", "", updatedUrl);
};
