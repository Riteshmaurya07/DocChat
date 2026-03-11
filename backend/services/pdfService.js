import { PDFExtract } from "pdf.js-extract";

const pdfExtract = new PDFExtract();

export const extractTextFromPDF = (buffer) => {
  return new Promise((resolve, reject) => {
    pdfExtract.extractBuffer(buffer, {}, (err, data) => {
      if (err) return reject(err);
      const text = data.pages
        .map((page) => page.content.map((item) => item.str).join(" "))
        .join("\n");
      resolve(text);
    });
  });
};
