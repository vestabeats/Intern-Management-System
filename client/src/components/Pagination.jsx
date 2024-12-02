import React from 'react'

const Pagination = ({numbers,currentPage,setCurrentPage,nPage}) => {
    const prePage=()=>{
        if(currentPage !==1){
          setCurrentPage(currentPage-1)
        }
      }
      const nextPage=()=>{
        if(currentPage !==nPage){
          setCurrentPage(currentPage+1)
        }
    
      }
      const changePage=(id)=>{
        setCurrentPage(id)
      }
  return (
    <nav>
            <ul className="flex flex-row">
              <li className=" border-gray-300 rounded  text-center border text-blue-600">
                <a href="#" className="block py-2 px-4" onClick={prePage}>Prev</a>
              </li>
              {numbers.map((n, i) => (
                <li className={`border border-gray-300 rounded  text-center text-blue-600 ${currentPage === n ? 'bg-blue-600 text-white' : ''}`} key={i}>
                  <a href="#" className="block py-2 px-4" onClick={() => changePage(n)}>{n}</a>
                </li>
              ))}
              <li className="border-gray-300 rounded  text-center border text-blue-600">
                <a href="#" className="block py-2 px-4" onClick={nextPage}>Next</a>
              </li>
            </ul>
          </nav>
  )
}

export default Pagination