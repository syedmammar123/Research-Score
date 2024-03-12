import React, { useState } from 'react'
import {impactData} from '../components/Result/ImpactFactor'

const test = () => {
  const [search,setSearch] = useState('')
  const [searchRes,setSearchRes] = useState('')
  
  const handleSearch = () => {
  let highestIF = -Infinity;
  let found = false;

  for (let i = 0; i < impactData.length; i++) {
    const data = impactData[i];
    const dataLower = data['Journal name'].toLowerCase();
    
    if (dataLower === search.toLowerCase()) {
      found = true;
      const jif = data['2022 JIF'];
      if (jif > highestIF) {
        highestIF = jif;
      }
    }
  }

  if (found) {
    setSearchRes(highestIF);
  } else {
    setSearchRes(`Sorry, no journal named "${search}" found`);
  }
}
  return (
    <div>
      <input type="text" name="" id="" value={search} onChange={(e)=>setSearch(e.target.value)} />
      <button onClick={handleSearch}>
        search
      </button>

      <div>
        {searchRes}
      </div>
    </div>
  )
}

export default test
