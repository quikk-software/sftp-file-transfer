import React from "react";
import axios from "axios";

export default function Home() {
  const uploadFile = async (e) => {
    const file = new File(
      [
        "QUIKK Software\n\n",
        "Übertragung von Dateien per SFTP und Serverless Functions",
      ],
      "testFile.txt",
      {
        type: "text/plain",
      }
    );
    const formData = new FormData();

    formData.append("testFile", file);

    const data = await axios.post("/api/sftp", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  };

  return (
    <>
      <button onClick={uploadFile}>UPLOAD</button>
    </>
  );
}
