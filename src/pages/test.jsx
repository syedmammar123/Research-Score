import React, { useState } from 'react'

const test = () => {
  const [data,setData] = useState([])
  const [name,setName] = useState()
  const [subject,setSubject] = useState()


  const addStd = ()=>{

  }

  const addSub = ()=>{
  }

  const submit = ()=>{
    console.log(data)
  }

  return (
    <div>
      <div>Name
        <input type="text" name="" id="" onChange={(e)=>setName(e.target.value)}/>
      </div>
      <div>subject
        <input type="text" name="" id=""  onChange={(e)=>setSubject(e.target.value)} />
        <button onClick={addSub}>Add Subject</button>
      </div>
      <div>
        <button onClick={addStd}>Add Student</button>
      </div>
      <br /><br />
      <div>
        <button onClick={submit}>submit</button>
      </div>
    </div>
  )
}

export default test