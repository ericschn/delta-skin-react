import { useRef, useState } from 'react';
import JSZip from 'jszip';
import './App.css';

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const canvasRef = useRef(null);

  const zip = new JSZip();

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (selectedFile) {
      // Here you can access the selected file and perform any necessary actions
      if (selectedFile.type === 'image/png') {
        console.log('User uploaded PNG');
        const reader = new FileReader();
        reader.onload = () => {
          const img = new Image();
          img.onload = () => {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
          };
          img.src = reader.result;
        };
        reader.readAsDataURL(selectedFile);
      } else if (selectedFile.type === 'application/zip') {
        console.log('this is a zip');
      } else if (selectedFile.name.match(/\.deltaskin$/i)) {
        console.log('deltaskin file extension detected');
        const reader = new FileReader();
        reader.onload = () => {
          // unzipping
          // TODO: error handling
          console.log('unzipping starting');
          zip.loadAsync(reader.result).then(async (zipData) => {
            const infoJson = await zipData.file('info.json').async('string');
            const info = JSON.parse(infoJson);
            // check for debug setting in json, we don't want that on
            // Guess this won't be the main usage of this app
            console.log('this is the info.json');
            console.log(info);
          });
        };
        reader.readAsArrayBuffer(selectedFile);
      }
      console.log(`User file ${selectedFile.name} now accessible in memory`);

      // You can also read the file contents using FileReader API
      const reader = new FileReader();
      reader.onload = () => {
        const fileContent = reader.result;
        // console.log('File content:', fileContent);
      };
      reader.readAsText(selectedFile);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="fileInput">Upload File:</label>
          <input
            type="file"
            id="fileInput"
            accept=".deltaskin,.zip,.png,.jpg,.txt"
            onChange={handleFileChange}
          />
        </div>
        <div>
          <button type="submit">Upload</button>
        </div>
      </form>
      <canvas ref={canvasRef} />
    </>
  );
}

export default App;
