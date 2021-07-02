import React, { useEffect, useState } from 'react'
import Pages from './components-for-official-homepage/Pages'
import './official-homepage-css/index.css'




const App = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('/api')
      .then(res => res.json())
      .then(data => setData(data.message))
  }, []);


  useEffect(() => {
    console.log(data);
  })
  return (
    <Pages />
  );
}

export default App;
