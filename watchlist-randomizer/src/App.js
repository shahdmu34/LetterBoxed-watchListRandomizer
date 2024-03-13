import logo from './logo.svg';
import './App.css';
import { useState} from 'react';
import * as XLSX from 'xlsx';

function App() {
  //onchange
  const [excelFile, setExcelFile] = useState(null);
  const [typeError, setTypeError] = useState(null);
  //submit
  const[excelData, setExcelData] = useState(null);
  const [randomMovie, setRandomMovie] = useState(null);
  

  const handleFile= (e) =>{
    let fileTypes = ['application/vnd.ms-excel','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet','text/csv'];
    let selectedFile = e.target.files[0];
    if(selectedFile){
      if(selectedFile&&fileTypes.includes(selectedFile.type)){
        setTypeError(null);
        let reader = new FileReader();
        reader.readAsArrayBuffer(selectedFile);
        reader.onload=(e) =>{
          setExcelFile(e.target.result);
        }  
      }else{
        setTypeError("Please uplad only Excel file type");
        setExcelFile(null);
      }
    }else{
      console.log('Please select your file');
    }
  }

  const handleSubmit = (e)=>{
    e.preventDefault();
    if(excelFile!==null){
      const workbook = XLSX.read(excelFile,{type: 'buffer'});
      const worksheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[worksheetName];
      const data = XLSX.utils.sheet_to_json(worksheet);
      setExcelData(data.map(row => row[Object.keys(row)[1]]));
    }
  }

  
  const handleRandomMovie = () => {
    if (excelData && excelData.length > 0) {
      const randomIndex = Math.floor(Math.random() * excelData.length);
      setRandomMovie(excelData[randomIndex]);
    }
  }

  return (
    <div className="App">

    <header>
      LetterBoxed Movie Watchlist Randomizer 
    </header>
      
        
        <p>
          Upload/Drag watchlist file 
        </p>

        <form className="upladForm" onSubmit={handleSubmit}>
          <input type="file" className="upload" required onChange={handleFile} />
          <button type="submit" className="submitBtn">Upload file</button>
          {typeError&&(
            <div className="alert" role="alert">{typeError}</div>
          )}
        </form>
        
            {/* view data */}
      <div className="viewer">
        {excelData?(
          <div className="table-responsive">
            <table className="table">

              <thead>
                <tr>
                  <th>Column 2</th>
                </tr>
              </thead>

              <tbody>
                {excelData.map((value, index)=>(
                  <tr key={index}>
                    <td>{value}</td>
                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        ):(
          <div>No File is uploaded yet!</div>
        )}
      </div>

       <button onClick={handleRandomMovie}>Get Random Movie</button>
      {randomMovie && <div>Random Movie: {randomMovie}</div>}
    </div>
  );
}

export default App;
