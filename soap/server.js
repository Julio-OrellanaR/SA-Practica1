const express = require('express');
const axios = require('axios');
const xml2js = require('xml2js');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(express.json());

// Configurar CORS
app.use(cors({
  allowedHeaders: ['Content-Type'], // Permitir solo el encabezado Content-Type
}));


app.post('/soap-request', async (req, res) => {
  try {
    const xmlBody = `<?xml version="1.0" encoding="utf-8"?>
      <soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
        <soap:Body>
          <NumberToWords xmlns="http://www.dataaccess.com/webservicesserver/">
            <ubiNum>${req.body.ubiNum}</ubiNum>
          </NumberToWords>
        </soap:Body>
      </soap:Envelope>`;

    const config = {
      headers: {
        'Content-Type': 'text/xml; charset=utf-8',
      },
    };

    const response = await axios.post('https://www.dataaccess.com/webservicesserver/NumberConversion.wso', xmlBody, config);
    const xmlResponse = response.data;

    // Convertir la respuesta XML a JSON
    const parser = new xml2js.Parser();
    parser.parseString(xmlResponse, (err, result) => {
      if (err) {
        res.status(500).json({ error: 'Error al procesar la respuesta XML' });
      } else {
        const jsonResponse = JSON.stringify(result); // Convertir a JSON
        res.send(jsonResponse);
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al realizar la solicitud SOAP' });
  }
});

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
