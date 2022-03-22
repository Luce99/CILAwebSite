const responseService = require("../services/Response");

const responseResolvers = {
  Query: {
    getResponse: async (parent, args) => {
      let response = responseService.getResponse();
      return response;
    },
  },
};

module.exports = { responseResolvers };
