// import ExpenseTracker from '../../components/ExpenseTracker';
import Banner from './Banner';
import Benefits from './Benefilts';
import Demo from './Demo';

const Home = () => {
    return (
        <div>
            <Banner></Banner>    
            {/* <ExpenseTracker></ExpenseTracker>   */}
            <Demo ></Demo>    
            <Benefits></Benefits>
        </div>
    );
};

export default Home;