import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
 
const InstagramPost = ({ data }: any ) => {
    return (
        <div>
            <Link href={'https://www.instagram.com/'} target='_blank' className="item relative block overflow-hidden">
                <Image
                    src={data.media_url}
                    width={300}
                    height={300}
                    alt='1'
                    className='h-full w-full duration-500 relative'
                />
                <div className="icon w-12 h-12 bg-white hover:bg-black duration-500 flex items-center justify-center rounded-2xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[1]">
                    <div className="icon-instagram text-2xl text-black"></div>
                </div>
            </Link>
        </div>
    )
}
 
export default InstagramPost