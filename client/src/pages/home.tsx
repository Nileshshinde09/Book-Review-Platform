import React from 'react'
import { BookCard } from '../components'

const Home = () => {
  return (
    <div className='h-screen w-full flex flex-wrap overflow-y-scroll'>
      <div className='mt-16 w-full'/>
      <BookCard img_src="/book.png" className='' genre='Thriller' rating={2.5}/>
      <BookCard img_src="/book.png" className='' genre='Thriller' rating={4.5}/>
      <BookCard img_src="/book.png" className='' genre='Thriller' rating={4.5}/>
      <BookCard img_src="/book.png" className='' genre='Thriller' rating={4.5}/>
      <BookCard img_src="/book.png" className='' genre='Thriller' rating={4.5}/>
      <BookCard img_src="/book.png" className='' genre='Thriller' rating={4.5}/>
      <BookCard img_src="/book.png" className='' genre='Thriller' rating={4.5}/>
      <BookCard img_src="/book.png" className='' genre='Thriller' rating={4.5}/>
      <BookCard img_src="/book.png" className='' genre='Thriller' rating={4.5}/>
      <div className='mt-16 w-full'/>
    </div>
  )
}

export default Home
