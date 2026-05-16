import Hero from "./Hero";
import Features from "./Features";
import HowItWorks from "./HowItWorks";
import CTABanner from "./CTABanner";

const Home = () => {
    return (
        <div>
           <Hero/>
           <Features/>
            <HowItWorks/>
           <CTABanner/> 
        </div>
    );
};

export default Home;