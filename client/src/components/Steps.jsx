import React from 'react'
import { assets } from '../assets/assets'

const Steps = () => {
  return (
    <div className='mx-4 lg:mx-44 py-20 x1:py-40'>
        <h1 className='text-center text text-2xl md:text-3xl lg:text-4xl mt-4 font-semibold '>Steps to remove the background <br /> on a image</h1>
        <div className='flex items-start flex-wrap gap-4 mt-16 xl:mt-24 justify-center'>

            <div className='flex items-start gap-4 bg-white border drop-shadow-md p-7 pb-10 rounded hover:scale-105 transition-all duration-500'>
                <img className='max-w-9' src={assets.upload_icon} alt="" />
                <div>
                    <p className='text-xl font-medium'>Upload Image</p>
                    <p className='text-sm text-neutral-500 mt-1'>First, upload your image by clicking <br /> the upload button</p>
                </div>
            </div>
            <div className='flex items-start gap-4 bg-white border drop-shadow-md p-7 pb-10 rounded hover:scale-105 transition-all duration-500'>
                <img className='max-w-9' src={assets.remove_bg_icon} alt="" />
                <div>
                    <p className='text-xl font-medium'>Remove Background</p>
                    <p className='text-sm text-neutral-500 mt-1'>Next, the app will automatically remove the <br /> background from your image within seconds.</p>
                </div>
            </div>
            <div className='flex items-start gap-4 bg-white border drop-shadow-md p-7 pb-10 rounded hover:scale-105 transition-all duration-500'>
                <img className='max-w-9' src={assets.download_icon} alt="" />
                <div>
                    <p className='text-xl font-medium'>Download Image</p>
                    <p className='text-sm text-neutral-500 mt-1'>Finally, download your image with the background <br /> removed and use it anywhere you like.</p>
                </div>
            </div>

        </div>
    </div>
  )
}

export default Steps