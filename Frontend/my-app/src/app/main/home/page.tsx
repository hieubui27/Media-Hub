import MovieRow from "@/src/components/Carousel/carouselCategory";
import CarouselTop from "@/src/components/Carousel/carouselTop";
import { KOREAN_MOVIES, TRENDING_BOOKS } from "@/public/mocks/movie";
import { EUROPEAN_MOVIES } from "@/public/mocks/movie";
import { CHINESE_MOVIES } from "@/public/mocks/movie";
function HomePage(){
    return (
        <div className=" bg-gray-800">
            <CarouselTop/>
            <div className="carousel bg-gray-900 w-fit mx-auto rounded mt-8">
                <MovieRow title="Phim Hàn Quốc mới" 
                        viewAllLink="/danh-muc/phim-han-quoc" 
                        movies={KOREAN_MOVIES}/>
            
                <MovieRow title="Phim US-UK mới" 
                        viewAllLink="/danh-muc/phim-au-my" 
                        movies={EUROPEAN_MOVIES}/>
                <MovieRow title="Phim Trung Quốc mới" 
                        viewAllLink="/danh-muc/phim-trung" 
                        movies={CHINESE_MOVIES}/>
            </div>
            <div>
                <MovieRow title="Trending book"
                viewAllLink="/danh-muc/book"
                movies={TRENDING_BOOKS}/>
            </div>
            
        </div>
    )
}

export default HomePage;