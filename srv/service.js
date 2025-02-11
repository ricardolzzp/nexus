const cds = require('@sap/cds');

const { postNotaFiscal } = require("./functions/postNotaFiscal")

module.exports = cds.service.impl(function () {

    this.on('postNotaFiscal', postNotaFiscal)
});