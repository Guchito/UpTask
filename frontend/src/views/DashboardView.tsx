import { Link } from 'react-router-dom'
export default function DashboardView() {
  return (
    <>
      <h1 className="text-4xl font-black">My projects</h1>
      <p className="text-2xl font-light text-gray-500 mt-5">Manage your projects</p>
      <nav className='my-5'>
        <Link
          className='bg-purple-400 hover:bg-[#c026d3] px-10 py-3 font-bold text-white text-xl cursor-pointer transition-colors'
          to='/projects/create'
        
        >New Project</Link>

      </nav>
    
    </>
  )
}
