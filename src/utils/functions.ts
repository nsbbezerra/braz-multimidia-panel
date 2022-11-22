const formatMoney = (value: string) => {
  const toNumber = parseFloat(value);
  return toNumber.toLocaleString("pt-br", {
    style: "currency",
    currency: "BRL",
  });
};

export { formatMoney };
