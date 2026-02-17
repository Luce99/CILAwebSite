const { MercadoPagoConfig } = require("mercadopago");

function createMercadoPagoClient() {
  const accessToken = process.env.MP_ACCESS_TOKEN;

  if (!accessToken) {
    throw new Error(
      "MP_ACCESS_TOKEN no esta definido en las variables de entorno"
    );
  }

  return new MercadoPagoConfig({ accessToken });
}

module.exports = { createMercadoPagoClient };
