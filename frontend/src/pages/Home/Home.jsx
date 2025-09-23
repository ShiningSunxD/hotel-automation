import styles from './Home.module.css';
import Paper from '@mui/material/Paper';
import { TopNavigation, Footer, ArticleList } from '@components';
import { useEffect } from 'react';

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { URL } from '../../api';

function Home() {

   useEffect(() => {
      document.title = "Perfect rent";
   })

   

   const settingsForSlider = {
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

         <Slider {...settingsForSlider} className={styles.sliderContainer}>
            <img
                  src={URL + '/media/main_slider/slide1.jpg'}
                  alt={`Ошибка загрузки фото`}
            />
            <img
                  src={URL + '/media/main_slider/slide2.jpg'}
                  alt={`Ошибка загрузки фото`}
            />
            <img
                  src={URL + '/media/main_slider/slide3.jpg'}
                  alt={`Ошибка загрузки фото`}
            />
         </Slider>



         <ArticleList />
         
         <Footer />
     
     </>
  )
}

export default Home