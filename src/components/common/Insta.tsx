'use client'
import React, { useEffect, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css/bundle';
import InstagramPost from './Instagrampost';
import { Grid, GridSpacing } from '@mui/material';
// import React from 'react';
import {  Card, CardMedia, CardContent } from '@mui/material';
import Masonry from 'react-masonry-css';
import Box from '@mui/material/Box';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';


type InstagramPost = {
    id: string;
    caption: string;
    media_url: string;
    media_type: string;
    timestamp: string;
    permalink: string;
}

type InstagramPaging = {
    cursors: {
        before: string;
        after: string;
    }
}

type InstagramFeed = {
    data: InstagramPost[];
    paging?: InstagramPaging;
}

const Instagram = () => {
    const [instagramFeed, setInstagramFeed] = useState<InstagramFeed | null>(null);
    const [after, setAfter] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const fetchFeed = async (after: string | null = null) => {
        try {
            let url = `https://graph.instagram.com/me/media?fields=id,caption,media_url,media_type,timestamp,permalink&access_token=${process.env.NEXT_PUBLIC_INSTAGRAM_ACCESS_TOKEN}`;
            if (after) {
                url += `&after=${after}`;
            }
            const data = await fetch(url);
            if (!data.ok) {
                throw new Error("Failed to fetch Instagram feed");
            }

            const feed = await data.json();
            

            setInstagramFeed(prevFeed => {
                if (prevFeed && prevFeed.data.length > 0) {
                    return {
                        ...feed,
                        data: [...prevFeed.data, ...feed.data]
                    };
                }
                return feed;
            });
            setAfter(feed.paging?.cursors.after);
        } catch (err: any) {
            console.error("Error fetching Instagram feed:", err.message);
            setError(err.message);
        }
    };

    useEffect(() => {
        fetchFeed();
    }, []);

    const imagePosts:any = instagramFeed?.data.filter(post => post.media_type === "IMAGE");
    

    return (
        <>
            <div className="instagram-block md:mt-20 mt-10 lg:py-20 md:py-14 py-10 bg-linear" >
                <div className="container" style={{marginTop:"200px"}}>
                    <div className="heading">
                        <div className="sectionTitle__title  text-55 pt-5 pb-60 text-center " >Atlas Fotobooth On Instagram</div>
                    </div>
                </div>
                <div className="list-instagram md:mt-10 mt-6">
                    <Swiper
                        slidesPerView={2}
                        loop={true}
                        modules={[Autoplay]}
                        autoplay={{
                            delay: 4000,
                        }}
                        breakpoints={{
                            576: {
                                slidesPerView: 3,
                            },
                            680: {
                                slidesPerView: 4,
                            },
                            992: {
                                slidesPerView: 5,
                            },
                            1290: {
                                slidesPerView: 6,
                            },
                        }}
                    >

{imagePosts?.map((post: InstagramPost) => (
                            <SwiperSlide key={post.id}>
                                <InstagramPost data={post} />
                            </SwiperSlide>
                        ))}


                    </Swiper>
                    <Box sx={{ width: "100%", marginBottom: "50px" }}>
    <ImageList variant="masonry" cols={3} gap={8}>
        {imagePosts?.map((post: InstagramPost) => (
            <ImageListItem key={post.id}>
                <a href={post.permalink} target="_blank" rel="noopener noreferrer">
                    <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                        <Card>
                            <CardMedia
                                component="img"
                                alt={post.caption}
                                height="140"
                                image={post.media_url}
                                title={post.caption}
                            />
                            <CardContent>
                                <p>{post.caption}</p>
                            </CardContent>
                        </Card>
                    </Grid>
                </a>
            </ImageListItem>
        ))}
    </ImageList>
</Box>

                    
                </div>
            </div>
        </>
    )
}

export default Instagram