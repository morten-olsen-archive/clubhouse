export const download = (data: string, type: string) => {
  const blob = new Blob([data], {
    type,
  });
  const url = URL.createObjectURL(blob);
  window.location.href = url;
};
