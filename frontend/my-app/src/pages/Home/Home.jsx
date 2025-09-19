import styles from './Home.module.css';
import Paper from '@mui/material/Paper';
import { TopNavigation, Footer } from '@components';
import { useEffect } from 'react';

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { URL } from '../../api';

function Home() {

   useEffect(() => {
      document.title = "Perfect rent";
   })

   

   const settings = {
    dots: true,
    fade: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    waitForAnimate: false,
    autoplaySpeed: 2000,
    autoplay: true,
  };
		


  return (
     <>
         <TopNavigation />
         <Slider {...settings} className={styles.sliderContainer}>
            <img
                  src={URL + '/media/main_slider/slide1.jpg'}
                  alt={`Фото отеля`}
            />
            <img
                  src={URL + '/media/main_slider/slide2.jpg'}
                  alt={`Фото отеля`}
            />
            <img
                  src={URL + '/media/main_slider/slide3.jpg'}
                  alt={`Фото отеля`}
            />
         </Slider>

         <Footer />
     
     </>
  )
}

export default Home