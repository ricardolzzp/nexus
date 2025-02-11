const cds = require('@sap/cds');
const axios = require('axios');

postNotaFiscal = async (req, res, next) => { 

    console.log(req)
    

    // try {
    //     // Converter XML para Base64
    //     const fileBase64 = Buffer.from(file).toString('base64');

    //     // Inserir a nota na tabela distDocDfe
    //     const inserted = await INSERT.into(distDocDfe).entries({
    //         file: fileBase64,
    //         status: 'PENDING',
    //         tenant_ID: tenantID
    //     });

    //     const docId = inserted[0]?.ID;
        
    //     // Configuração da requisição para a API da SEFAZ
    //     const sefazResponse = await axios.post('https://homologacao.nfe.sefa.pr.gov.br/nfe/NFeAutorizacao4?wsdl', { xml: file }, {
    //         headers: {
    //             'Content-Type': 'application/xml'
    //         }
    //     });

    //     // Atualizar o status conforme resposta da SEFAZ
    //     const newStatus = sefazResponse.status === 200 ? 'SENT' : 'FAILED';
    //     await UPDATE(distDocDfe).set({ status: newStatus }).where({ ID: docId });

    //     return { message: 'Nota processada', status: newStatus };
    // } catch (error) {
    //     console.error('Erro ao processar a nota:', error);
    //     throw req.error(500, 'Erro ao enviar a nota para a SEFAZ');
    // }
}

module.exports = {postNotaFiscal};