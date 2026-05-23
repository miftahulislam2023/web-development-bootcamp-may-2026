import Hero from "./Hero";
import Features from "./Features";
import HowItWorks from "./HowItWorks";
import CTABanner from "./CTABanner";
import DashboardPreview from "./DashboardPreview";

const Home = () => {
    return (
        <div>
           <Hero/>
           <Features/>
           <DashboardPreview/>
            <HowItWorks/>
           <CTABanner/> 
        </div>
    );
};

export default Home;