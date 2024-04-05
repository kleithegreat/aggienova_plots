import SNeNameSearch from "../components/SNeNameSearch";
import TypeSearch from "../components/TypeSearch";
import OptionsComponent from "../components/OptionsComponent/OptionsComponent";

const Home: React.FC = () => {
  return (
    <div>
      <SNeNameSearch />
      <TypeSearch />
      <OptionsComponent />
    </div>
  );
};

export default Home;